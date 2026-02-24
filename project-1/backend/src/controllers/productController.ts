import { Request, Response } from 'express';
import { db } from '../db.js';

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

export const getProducts = async (req: Request, res: Response) => {
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
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(mapProduct(result.rows[0]));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
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
};

export const searchProducts = async (req: Request, res: Response) => {
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
};

export const getProductsByCategory = async (req: Request, res: Response) => {
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
};

export const updateProductStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const user = (req as any).user;

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can update stock' });
        }

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: 'Valid stock number is required' });
        }

        const result = await db.query(
            'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
            [stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(mapProduct(result.rows[0]));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
