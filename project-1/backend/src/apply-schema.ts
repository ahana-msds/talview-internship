import { db } from './db.js';
import fs from 'fs';
import path from 'path';

async function applySchema() {
    try {
        const schemaPath = path.join(process.cwd(), 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying schema...');
        await db.query(schemaSql);
        console.log('Schema applied successfully.');
    } catch (err) {
        console.error('Error applying schema:', err);
    } finally {
        process.exit(0);
    }
}

applySchema();
