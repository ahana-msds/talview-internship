import { db } from '../db.js';

/**
 * Check stock availability for all items.
 * Queries PostgreSQL for actual stock levels.
 */
export async function checkStock(items: any[]): Promise<boolean> {
    console.log('📦 Checking stock for items:', items.map(i => `${i.title}(x${i.quantity || 1})`));
    for (const item of items) {
        const result = await db.query('SELECT stock FROM products WHERE id = $1', [item.id]);
        if (result.rows.length === 0 || result.rows[0].stock < (item.quantity || 1)) {
            console.log(`❌ Insufficient stock for product ${item.id}`);
            return false;
        }
    }
    console.log('✅ All items in stock');
    return true;
}

/**
 * Generate invoice data for an order.
 * Computes totals, tax, and formatted line items.
 */
export async function generateInvoice(orderId: string, items: any[]): Promise<void> {
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    console.log(`🧾 Invoice for order ${orderId}:`);
    console.log(`   Items: ${items.length}`);
    items.forEach((item: any) => {
        console.log(`   - ${item.title} x${item.quantity || 1} @ $${item.price} = $${(item.price * (item.quantity || 1)).toFixed(2)}`);
    });
    console.log(`   Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   Tax (18%): $${tax.toFixed(2)}`);
    console.log(`   Total: $${total.toFixed(2)}`);
}

/**
 * Update order status in PostgreSQL.
 */
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
    console.log(`📋 Updating order ${orderId} status to: ${status}`);
    await db.query(
        "UPDATE orders SET status = $1 WHERE id = $2 OR workflow_id = $2",
        [status, orderId]
    );
}

/**
 * Confirm stock reservation — marks reservation as CONFIRMED.
 * Called when order completes successfully.
 */
export async function confirmReservation(orderId: string): Promise<void> {
    const workflowId = orderId.startsWith('order-') ? orderId : `order-${orderId}`;
    console.log(`✅ Confirming reservations for order ${workflowId}`);
    await db.query(
        "UPDATE stock_reservations SET status = 'CONFIRMED' WHERE order_id = $1 AND status = 'HELD'",
        [workflowId]
    );
}

/**
 * Release stock reservation — restores stock and marks reservation as RELEASED.
 * Called when order is cancelled or fails.
 */
export async function releaseReservation(orderId: string): Promise<void> {
    const workflowId = orderId.startsWith('order-') ? orderId : `order-${orderId}`;
    console.log(`🔓 Releasing reservations for order ${workflowId}`);
    const reservations = await db.query(
        "SELECT * FROM stock_reservations WHERE order_id = $1 AND status = 'HELD'",
        [workflowId]
    );
    for (const r of reservations.rows) {
        await db.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [r.quantity, r.product_id]);
        await db.query("UPDATE stock_reservations SET status = 'RELEASED' WHERE id = $1", [r.id]);
    }
}
