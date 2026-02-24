import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { getNextId } from '../utils/idGenerator.js';
// In a real app, use bcrypt to hash passwords
// import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Simple validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check availability
        const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Create user (storing plain text for this demo as requested "simple", but normally hash it!)
        // const hash = await bcrypt.hash(password, 10);
        const hash = password;

        // Advanced ID: user-{count}-{slug}
        const userId = await getNextId('users', 'user', email.split('@')[0]);

        const result = await db.query(
            'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, role',
            [userId, email, hash]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        // const match = await bcrypt.compare(password, user.password_hash);
        const match = password === user.password_hash;

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
