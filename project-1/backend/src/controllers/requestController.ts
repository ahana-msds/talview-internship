import { Response } from 'express';
import { db } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { description, sentryId, orderId } = req.body;
        const userId = req.user?.email || 'guest';

        await db.query(
            'INSERT INTO admin_requests (user_id, description, sentry_id, order_id) VALUES ($1, $2, $3, $4)',
            [userId, description, sentryId, orderId]
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const result = await db.query('SELECT * FROM admin_requests ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
