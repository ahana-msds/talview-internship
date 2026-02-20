import { db } from './db.js';

async function migrate() {
    try {
        console.log('Adding updated_at to todo_lists if not exists...');
        await db.query(`
            ALTER TABLE todo_lists 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `);
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit(0);
    }
}

migrate();
