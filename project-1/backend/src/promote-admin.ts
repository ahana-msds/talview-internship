import { db } from './db.js';

async function promoteAdmin() {
    try {
        console.log('Promoting admin@example.com to admin role...');
        const result = await db.query(
            "UPDATE users SET role = 'admin' WHERE email = 'admin@example.com' RETURNING *"
        );
        if (result.rows.length > 0) {
            console.log('Admin promoted successfully:', result.rows[0]);
        } else {
            console.log('Admin user not found. Please register admin@example.com in Bruno first!\n                            Tip: If this is your first time, please <b>Sign Up</b> as admin@example.com with password \'Admin@123\' first.');
        }
    } catch (err) {
        console.error('Error promoting admin:', err);
    } finally {
        process.exit(0);
    }
}

promoteAdmin();
