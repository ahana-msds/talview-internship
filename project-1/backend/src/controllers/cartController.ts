import { Request, Response } from 'express';
import { db } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

function getUserEmail(req: AuthRequest): string {
    return req.user?.email || req.header('X-User-Email') || 'guest';
}

export const getCart = async (req: AuthRequest, res: Response) => {
    try {
        const email = getUserEmail(req);
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
};

export const addToCart = async (req: AuthRequest, res: Response) => {
    try {
        const email = getUserEmail(req);
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
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const email = getUserEmail(req);
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
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const email = getUserEmail(req);
        await db.query(
            'DELETE FROM cart_items WHERE user_email = $1 AND product_id = $2',
            [email, req.params.productId]
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
    try {
        const email = getUserEmail(req);
        await db.query('DELETE FROM cart_items WHERE user_email = $1', [email]);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
