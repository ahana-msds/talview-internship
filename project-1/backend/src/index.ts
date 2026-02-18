import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import { getTemporalClient } from './temporal-client.js';
import { db } from './db.js';

dotenv.config();

process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, exiting gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, exiting gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

const app = express();
const PORT = process.env.PORT || 4002;

// Initialize Sentry
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });
}

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// ============================================
// ORDER ENDPOINTS (PostgreSQL-backed)
// ============================================

app.post('/api/orders/start', async (req, res) => {
    const pgClient = await db.getClient();
    try {
        const { orderId, address, items } = req.body;
        const userEmail = req.header('X-User-Email') || 'guest';

        // ---- ATOMIC STOCK RESERVATION ----
        await pgClient.query('BEGIN');

        const unavailableItems: string[] = [];
        for (const item of items) {
            // Lock the product row to prevent concurrent modification
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

        // Persist order FIRST to satisfy foreign key in stock_reservations
        const workflowId = `order-${orderId}`;
        await pgClient.query(
            `INSERT INTO orders (id, workflow_id, user_email, address, items, status)
             VALUES ($1, $2, $3, $4, $5, 'PENDING')`,
            [workflowId, workflowId, userEmail, address, JSON.stringify(items)]
        );

        // Decrement stock and create reservations
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

        // Start Temporal workflow (after commit so reservation is durable)
        try {
            const temporalClient = await getTemporalClient();
            // @ts-ignore
            const { orderWorkflow } = await import('./workflows/order.js');
            await temporalClient.workflow.start(orderWorkflow, {
                taskQueue: 'order-tasks',
                args: [orderId, address, items],
                workflowId,
            });
        } catch (temporalErr: any) {
            console.error('Temporal workflow start failed, releasing reservation:', temporalErr);
            // Release stock reservations if Temporal fails
            await releaseReservationsForOrder(workflowId);
            return res.status(500).json({ error: 'Failed to start order workflow' });
        }

        // Clear cart for this user after successful order
        await db.query('DELETE FROM cart_items WHERE user_email = $1', [userEmail]);

        res.json({ workflowId });
    } catch (err: any) {
        await pgClient.query('ROLLBACK').catch(() => { });
        Sentry.captureException(err);
        res.status(500).json({ error: err.message });
    } finally {
        pgClient.release();
    }
});

// Helper: release reservations and restore stock for a given order
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

app.get('/api/orders', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        let result;
        if (email) {
            result = await db.query('SELECT * FROM orders WHERE user_email = $1 ORDER BY created_at DESC', [email]);
        } else {
            result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        }
        // Map DB columns to camelCase for frontend
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
});

app.get('/api/orders/:id', async (req, res) => {
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
});

app.post('/api/orders/:id/signal/:signalName', async (req, res) => {
    try {
        const client = await getTemporalClient();
        const { id, signalName } = req.params;
        const { payload } = req.body;

        const handle = client.workflow.getHandle(id);
        await handle.signal(signalName, payload);

        // Update DB if address change
        if (signalName === 'updateAddress') {
            await db.query('UPDATE orders SET address = $1 WHERE id = $2', [payload, id]);
        }

        res.json({ success: true });
    } catch (err: any) {
        Sentry.captureException(err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// TODO LIST ENDPOINTS (PostgreSQL-backed)
// ============================================

const LIST_1_ID = 'list-1';

// Helper: determine user's role for a list
const getUserRole = async (listId: string, email: string | undefined): Promise<string> => {
    if (listId === LIST_1_ID) return 'owner'; // General Tasks is public
    if (!email) return 'none';

    // Check if user is owner
    const listResult = await db.query('SELECT owner_id FROM todo_lists WHERE id = $1', [listId]);
    if (listResult.rows.length === 0) return 'none';
    if (listResult.rows[0].owner_id === email) return 'owner';

    // Check permissions table
    const permResult = await db.query(
        'SELECT role FROM todo_permissions WHERE list_id = $1 AND user_id = $2', [listId, email]
    );
    if (permResult.rows.length > 0) return permResult.rows[0].role;

    return 'none';
};

app.get('/api/todo-lists', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        // Get lists the user owns OR has permissions for OR is the public General Tasks list
        const result = await db.query(`
            SELECT DISTINCT l.id, l.name, l.owner_id, l.created_at
            FROM todo_lists l
            LEFT JOIN todo_permissions p ON l.id = p.list_id
            WHERE l.id = $1
               OR l.owner_id = $2
               OR p.user_id = $2
            ORDER BY l.created_at ASC
        `, [LIST_1_ID, email || '']);

        const lists = result.rows.map(r => ({
            id: r.id,
            name: r.name,
            owner_id: r.owner_id,
            role: r.id === LIST_1_ID ? 'owner' : (r.owner_id === email ? 'owner' : 'editor'),
        }));
        res.json(lists);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/todo-lists', async (req, res) => {
    try {
        const email = req.header('X-User-Email') || 'guest@talview.com';
        const { name, emails } = req.body;
        const listId = `list-${Date.now()}`;

        await db.query('INSERT INTO todo_lists (id, name, owner_id) VALUES ($1, $2, $3)', [listId, name, email]);

        // Add shared users as editors
        if (emails && emails.length > 0) {
            for (const sharedEmail of emails.filter(Boolean)) {
                await db.query(
                    'INSERT INTO todo_permissions (user_id, list_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                    [sharedEmail, listId, 'editor']
                );
            }
        }

        res.json({ id: listId, name, owner_id: email, role: 'owner' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/todo-lists/:id/todos', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        const role = await getUserRole(req.params.id, email);
        if (role === 'none') return res.status(403).json({ error: 'Access denied' });

        const result = await db.query(
            'SELECT * FROM todos WHERE list_id = $1 ORDER BY created_at ASC', [req.params.id]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/todo-lists/:id/todos', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        const role = await getUserRole(req.params.id, email);
        if (role !== 'owner' && role !== 'editor') {
            return res.status(403).json({ error: 'Only owners and editors can add tasks' });
        }

        const { text } = req.body;
        const todoId = Date.now().toString();

        await db.query(
            'INSERT INTO todos (id, text, completed, list_id) VALUES ($1, $2, false, $3)',
            [todoId, text, req.params.id]
        );

        res.json({ id: todoId, text, completed: false, list_id: req.params.id });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/todo-lists/:listId/todos/:todoId', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        const { listId, todoId } = req.params;
        const role = await getUserRole(listId, email);

        if (role !== 'owner' && role !== 'editor') {
            return res.status(403).json({ error: 'Only owners and editors can modify tasks' });
        }

        const { text, completed } = req.body;
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (text !== undefined) {
            updates.push(`text = $${paramIndex++}`);
            values.push(text);
        }
        if (completed !== undefined) {
            updates.push(`completed = $${paramIndex++}`);
            values.push(completed);
        }

        if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });

        values.push(todoId, listId);
        const result = await db.query(
            `UPDATE todos SET ${updates.join(', ')} WHERE id = $${paramIndex++} AND list_id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/todo-lists/:listId/todos/:todoId', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        const { listId, todoId } = req.params;
        const role = await getUserRole(listId, email);

        if (role !== 'owner' && role !== 'editor') {
            return res.status(403).json({ error: 'Only owners and editors can delete tasks' });
        }

        const result = await db.query('DELETE FROM todos WHERE id = $1 AND list_id = $2', [todoId, listId]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/todo-lists/:id', async (req, res) => {
    try {
        const email = req.header('X-User-Email');
        const { id } = req.params;

        if (id === LIST_1_ID) return res.status(403).json({ error: 'Cannot delete public list' });

        const listResult = await db.query('SELECT owner_id FROM todo_lists WHERE id = $1', [id]);
        if (listResult.rows.length === 0) return res.status(404).json({ error: 'List not found' });
        if (listResult.rows[0].owner_id !== email) {
            return res.status(403).json({ error: 'Only owners can delete lists' });
        }

        // CASCADE will delete todos and permissions
        await db.query('DELETE FROM todo_lists WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/todo-lists/:id/share', async (req, res) => {
    try {
        const { userId, role } = req.body;
        await db.query(
            'INSERT INTO todo_permissions (user_id, list_id, role) VALUES ($1, $2, $3) ON CONFLICT (user_id, list_id) DO UPDATE SET role = $3',
            [userId, req.params.id, role || 'editor']
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// PRODUCT ENDPOINTS (PostgreSQL-backed)
// ============================================

app.get('/api/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = parseInt(req.query.skip as string) || 0;

        const countResult = await db.query('SELECT COUNT(*) FROM products');
        const total = parseInt(countResult.rows[0].count);

        const result = await db.query(
            'SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2',
            [limit, skip]
        );

        res.json({
            products: result.rows.map(mapProduct),
            total,
            skip,
            limit,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/categories', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category ASC'
        );
        res.json(result.rows.map((r: any) => ({
            slug: r.category,
            name: r.category.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            url: `/products/category/${r.category}`,
        })));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const q = req.query.q as string || '';
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = parseInt(req.query.skip as string) || 0;

        const countResult = await db.query(
            'SELECT COUNT(*) FROM products WHERE title ILIKE $1 OR description ILIKE $1',
            [`%${q}%`]
        );
        const total = parseInt(countResult.rows[0].count);

        const result = await db.query(
            'SELECT * FROM products WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY id ASC LIMIT $2 OFFSET $3',
            [`%${q}%`, limit, skip]
        );

        res.json({
            products: result.rows.map(mapProduct),
            total,
            skip,
            limit,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/category/:slug', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = parseInt(req.query.skip as string) || 0;

        const countResult = await db.query(
            'SELECT COUNT(*) FROM products WHERE category = $1',
            [req.params.slug]
        );
        const total = parseInt(countResult.rows[0].count);

        const result = await db.query(
            'SELECT * FROM products WHERE category = $1 ORDER BY id ASC LIMIT $2 OFFSET $3',
            [req.params.slug, limit, skip]
        );

        res.json({
            products: result.rows.map(mapProduct),
            total,
            skip,
            limit,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(mapProduct(result.rows[0]));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Map DB row to frontend-compatible product object
function mapProduct(r: any) {
    return {
        id: r.id,
        title: r.title,
        description: r.description,
        price: parseFloat(r.price),
        discountPercentage: parseFloat(r.discount_percentage),
        rating: parseFloat(r.rating),
        stock: r.stock,
        brand: r.brand,
        category: r.category,
        thumbnail: r.thumbnail,
        images: r.images || [],
    };
}

// ============================================
// CART ENDPOINTS (PostgreSQL-backed, per-user)
// ============================================

app.get('/api/cart', async (req, res) => {
    try {
        const email = req.header('X-User-Email') || 'guest';
        const result = await db.query(
            'SELECT * FROM cart_items WHERE user_email = $1 ORDER BY created_at ASC',
            [email]
        );
        res.json(result.rows.map((r: any) => ({
            id: r.product_id,
            title: r.title,
            price: parseFloat(r.price),
            thumbnail: r.thumbnail,
            quantity: r.quantity,
        })));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cart', async (req, res) => {
    try {
        const email = req.header('X-User-Email') || 'guest';
        const { id, title, price, thumbnail, quantity } = req.body;
        const cartItemId = `cart-${email}-${id}`;

        await db.query(
            `INSERT INTO cart_items (id, user_email, product_id, title, price, thumbnail, quantity)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (user_email, product_id) DO UPDATE SET
                quantity = cart_items.quantity + EXCLUDED.quantity`,
            [cartItemId, email, id, title, price, thumbnail, quantity || 1]
        );

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/cart/:productId', async (req, res) => {
    try {
        const email = req.header('X-User-Email') || 'guest';
        const { quantity } = req.body;

        if (quantity <= 0) {
            await db.query(
                'DELETE FROM cart_items WHERE user_email = $1 AND product_id = $2',
                [email, req.params.productId]
            );
        } else {
            await db.query(
                'UPDATE cart_items SET quantity = $1 WHERE user_email = $2 AND product_id = $3',
                [quantity, email, req.params.productId]
            );
        }

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/cart/:productId', async (req, res) => {
    try {
        const email = req.header('X-User-Email') || 'guest';
        await db.query(
            'DELETE FROM cart_items WHERE user_email = $1 AND product_id = $2',
            [email, req.params.productId]
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/cart', async (req, res) => {
    try {
        const email = req.header('X-User-Email') || 'guest';
        await db.query('DELETE FROM cart_items WHERE user_email = $1', [email]);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// STOCK RESERVATION AUTO-RELEASE (runs every 60s)
// ============================================

async function releaseExpiredReservations() {
    try {
        const expired = await db.query(
            "SELECT * FROM stock_reservations WHERE status = 'HELD' AND expires_at < NOW()"
        );
        for (const r of expired.rows) {
            await db.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [r.quantity, r.product_id]);
            await db.query("UPDATE stock_reservations SET status = 'RELEASED' WHERE id = $1", [r.id]);
            console.log(`🔓 Released expired reservation ${r.id} — restored ${r.quantity} units of product ${r.product_id}`);
        }
        if (expired.rows.length > 0) {
            // Also cancel the corresponding orders
            const orderIds = [...new Set(expired.rows.map((r: any) => r.order_id))];
            for (const oid of orderIds) {
                await db.query("UPDATE orders SET status = 'CANCELLED' WHERE id = $1 AND status = 'PENDING'", [oid]);
            }
            console.log(`🔓 Released ${expired.rows.length} expired reservations`);
        }
    } catch (err) {
        console.error('Error releasing expired reservations:', err);
    }
}

// Run reservation cleanup every 60 seconds
setInterval(releaseExpiredReservations, 60_000);

// ============================================
// ERROR HANDLING & SERVER START
// ============================================

if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}

const server = app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'NOT CONFIGURED'}`);
    console.log(`Hasura Console: ${process.env.HASURA_PROJECT_URL || 'NOT CONFIGURED'}`);
});

server.on('error', (err) => {
    console.error('Server failed to start/stay alive:', err);
});

// Heartbeat to keep the event loop alive if something is misbehaving
setInterval(() => {
    // console.log('Heartbeat...'); 
}, 60000);
