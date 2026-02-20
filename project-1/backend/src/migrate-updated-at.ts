
import { db } from './db.js';

async function migrate() {
    try {
        console.log('Migrating database...');
        await db.query(`
            ALTER TABLE todo_lists 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `);
        console.log('Migration complete: added updated_at to todo_lists');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
