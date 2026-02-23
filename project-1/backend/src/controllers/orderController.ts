import { Request, Response } from 'express';
import { db } from '../db.js';
import * as Sentry from '@sentry/node';
import { getTemporalClient } from '../temporal-client.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Helper: release reservations
async function releaseReservationsForOrder(orderId: string) {
    const reservations = await db.query(
        "SELECT * FROM stock_reservations WHERE order_id = $1 AND status = 'HELD'",
        [orderId]
    );
    for (const r of reservations.rows) {
        await db.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [r.quantity, r.product_id]);
        await db.query("UPDATE stock_reservations SET status = 'RELEASED' WHERE id = $1", [r.id]);
    }
    await db.query("UPDATE orders SET status = 'CANCELLED' WHERE id = $1", [orderId]);
}

export const startOrder = async (req: AuthRequest, res: Response) => {
    const pgClient = await db.getClient();
    try {
        const { orderId, address, items } = req.body;
        // USE JWT EMAIL
        const userEmail = req.user?.email || 'guest';

        // ---- ATOMIC STOCK RESERVATION ----
        await pgClient.query('BEGIN');

        const unavailableItems: string[] = [];
        for (const item of items) {
            const result = await pgClient.query(
                'SELECT id, title, stock FROM products WHERE id = $1 FOR UPDATE',
                [item.id]
            );
            if (result.rows.length === 0) {
                unavailableItems.push(`Product ${item.id} not found`);
                continue;
            }
            const product = result.rows[0];
            if (product.stock < (item.quantity || 1)) {
                unavailableItems.push(product.title);
            }
        }

        if (unavailableItems.length > 0) {
            await pgClient.query('ROLLBACK');
            return res.status(409).json({
                error: 'Insufficient stock',
                unavailableItems,
            });
        }

        const workflowId = `order-${orderId}`;
        await pgClient.query(
            `INSERT INTO orders (id, workflow_id, user_email, address, items, status)
             VALUES ($1, $2, $3, $4, $5, 'PENDING')`,
            [workflowId, workflowId, userEmail, address, JSON.stringify(items)]
        );

        for (const item of items) {
            const qty = item.quantity || 1;
            await pgClient.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [qty, item.id]
            );
            await pgClient.query(
                `INSERT INTO stock_reservations (id, order_id, product_id, user_email, quantity, status, expires_at)
                 VALUES ($1, $2, $3, $4, $5, 'HELD', NOW() + INTERVAL '10 minutes')`,
                [`res-${orderId}-${item.id}`, workflowId, item.id, userEmail, qty]
            );
        }

        await pgClient.query('COMMIT');

        try {
            const temporalClient = await getTemporalClient();
            // @ts-ignore
            const { orderWorkflow } = await import('../workflows/order.js');
            await temporalClient.workflow.start(orderWorkflow, {
                taskQueue: 'order-tasks',
                args: [orderId, address, items],
                workflowId,
            });
        } catch (temporalErr: any) {
            console.error('Temporal workflow start failed, releasing reservation:', temporalErr);
            await releaseReservationsForOrder(workflowId);
            return res.status(500).json({ error: 'Failed to start order workflow' });
        }

        await db.query('DELETE FROM cart_items WHERE user_email = $1', [userEmail]);

        res.json({ workflowId });
    } catch (err: any) {
        await pgClient.query('ROLLBACK').catch(() => { });
        Sentry.captureException(err);
        res.status(500).json({ error: err.message });
    } finally {
        pgClient.release();
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const email = req.user?.email;
        const isAdmin = req.user?.role === 'admin';

        let result;
        if (isAdmin) {
            result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        } else {
            result = await db.query('SELECT * FROM orders WHERE user_email = $1 ORDER BY created_at DESC', [email]);
        }

        const orders = result.rows.map(r => ({
            id: r.id,
            workflowId: r.workflow_id,
            userEmail: r.user_email,
            address: r.address,
            items: r.items,
            status: r.status,
            createdAt: r.created_at,
        }));
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const r = result.rows[0];
        res.json({
            id: r.id,
            workflowId: r.workflow_id,
            userEmail: r.user_email,
            address: r.address,
            items: r.items,
            status: r.status,
            createdAt: r.created_at,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const signalOrder = async (req: AuthRequest, res: Response) => {
    try {
        const client = await getTemporalClient();
        const { id, signalName } = req.params as { id: string; signalName: string };
        const { payload } = req.body;
        const isAdmin = req.user?.role === 'admin';

        // 1. Role-Based Signal Restrictions
        const shipmentSignals = ['shipment-confirm', 'shipped', 'delivered'];
        if (shipmentSignals.includes(signalName) && !isAdmin) {
            return res.status(403).json({ error: 'Only admins can confirm shipments' });
        }

        // 2. Address Update Logic (User vs Admin)
        if (signalName === 'updateAddress') {
            const orderResult = await db.query('SELECT status, created_at, user_email FROM orders WHERE id = $1', [id]);
            if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

            const order = orderResult.rows[0];
            if (!isAdmin) {
                // Verify ownership
                if (order.user_email !== req.user?.email) return res.status(403).json({ error: 'Not your order' });

                // Verify status and timing (5 minute window)
                if (order.status !== 'PENDING') return res.status(409).json({ error: 'Order is already processing' });

                const createdAt = new Date(order.created_at).getTime();
                const now = Date.now();
                const diffMins = (now - createdAt) / (1000 * 60);

                if (diffMins > 5) {
                    return res.status(403).json({ error: 'Address can only be updated within 5 minutes of ordering' });
                }
            }

            await db.query('UPDATE orders SET address = $1 WHERE id = $2', [payload, id]);
        }

        // 3. Cancel Order Logic
        if (signalName === 'cancelOrder') {
            const orderResult = await db.query('SELECT status, user_email FROM orders WHERE id = $1', [id]);
            if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

            const order = orderResult.rows[0];
            if (!isAdmin && order.user_email !== req.user?.email) {
                return res.status(403).json({ error: 'Not your order' });
            }
            if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
                return res.status(409).json({ error: `Cannot cancel order in ${order.status} state` });
            }
        }

        const handle = client.workflow.getHandle(id);
        await handle.signal(signalName, payload);

        res.json({ success: true });
    } catch (err: any) {
        Sentry.captureException(err);
        res.status(500).json({ error: err.message });
    }
};
