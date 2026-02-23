import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import { getTemporalClient } from './temporal-client.js';
import { db } from './db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

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
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        if (res.statusCode === 401 || res.statusCode === 403) {
            console.log('  Headers:', JSON.stringify({
                authorization: req.headers.authorization ? 'Present' : 'Missing',
                origin: req.headers.origin,
            }, null, 2));
            console.log('  JWT_SECRET matches env:', process.env.JWT_SECRET === 'your-secret-key' ? 'DEFAULT' : 'LOADED');
        }
    });
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// ============================================
// MOUNT ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/todo-lists', todoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/requests', requestRoutes);

// Stock auto-release runs here


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
