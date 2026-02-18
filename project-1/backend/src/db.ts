import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err);
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    getClient: () => pool.connect(),
};
