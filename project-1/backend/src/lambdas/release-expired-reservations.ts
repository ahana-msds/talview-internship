/**
 * release-expired-reservations.ts
 * Lambda that releases expired stock reservations.
 * This is called by the setInterval in index.ts every 60 seconds.
 * Can also be triggered manually via API for testing.
 */
import { db } from '../db.js';

export interface ReservationReleaseResult {
    releasedCount: number;
    cancelledOrders: string[];
    restoredStock: { productId: number; quantity: number }[];
}

export async function releaseExpiredReservations(): Promise<ReservationReleaseResult> {
    const result: ReservationReleaseResult = {
        releasedCount: 0,
        cancelledOrders: [],
        restoredStock: [],
    };

    const expired = await db.query(
        "SELECT * FROM stock_reservations WHERE status = 'HELD' AND expires_at < NOW()"
    );

    for (const r of expired.rows) {
        await db.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [r.quantity, r.product_id]);
        await db.query("UPDATE stock_reservations SET status = 'RELEASED' WHERE id = $1", [r.id]);
        result.restoredStock.push({ productId: r.product_id, quantity: r.quantity });
    }

    if (expired.rows.length > 0) {
        const orderIds = [...new Set(expired.rows.map((r: any) => r.order_id))] as string[];
        for (const oid of orderIds) {
            await db.query("UPDATE orders SET status = 'CANCELLED' WHERE id = $1 AND status = 'PENDING'", [oid]);
        }
        result.cancelledOrders = orderIds;
    }

    result.releasedCount = expired.rows.length;
    return result;
}
