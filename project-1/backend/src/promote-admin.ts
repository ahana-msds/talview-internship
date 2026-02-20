import { db } from './db.js';

async function promoteAdmin() {
    try {
        console.log('Promoting admin@talview.com to admin role...');
        const result = await db.query(
            "UPDATE users SET role = 'admin' WHERE email = 'admin@talview.com' RETURNING *"
        );
        if (result.rows.length > 0) {
            console.log('Admin promoted successfully:', result.rows[0]);
        } else {
            console.log('Admin user not found. Please register admin@talview.com in Bruno first!');
        }
    } catch (err) {
        console.error('Error promoting admin:', err);
    } finally {
        process.exit(0);
    }
}

promoteAdmin();
