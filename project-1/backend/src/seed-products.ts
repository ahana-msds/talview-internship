/**
 * seed-products.ts
 * Fetches all products from DummyJSON and upserts them into PostgreSQL.
 * Run: npx ts-node --esm src/seed-products.ts
 */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seedProducts() {
    console.log('🌱 Fetching products from DummyJSON...');

    // Fetch ALL products (limit=0 returns all)
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();
    const products = data.products;

    console.log(`📦 Fetched ${products.length} products. Seeding into PostgreSQL...`);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const p of products) {
            await client.query(
                `INSERT INTO products (id, title, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                 ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    price = EXCLUDED.price,
                    discount_percentage = EXCLUDED.discount_percentage,
                    rating = EXCLUDED.rating,
                    stock = EXCLUDED.stock,
                    brand = EXCLUDED.brand,
                    category = EXCLUDED.category,
                    thumbnail = EXCLUDED.thumbnail,
                    images = EXCLUDED.images`,
                [
                    p.id,
                    p.title,
                    p.description,
                    p.price,
                    p.discountPercentage || 0,
                    p.rating || 0,
                    p.stock || 0,
                    p.brand || null,
                    p.category || 'uncategorized',
                    p.thumbnail,
                    JSON.stringify(p.images || []),
                ]
            );
        }

        await client.query('COMMIT');
        console.log(`✅ Successfully seeded ${products.length} products!`);

        // Show category breakdown
        const categories = await pool.query(
            'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC'
        );
        console.log('\n📊 Categories:');
        categories.rows.forEach((r: any) => console.log(`   ${r.category}: ${r.count} products`));

        // Show stock summary
        const stockInfo = await pool.query(
            'SELECT COUNT(*) as total, SUM(stock) as total_stock, COUNT(*) FILTER (WHERE stock = 0) as out_of_stock FROM products'
        );
        const s = stockInfo.rows[0];
        console.log(`\n📈 Stock: ${s.total_stock} total units across ${s.total} products (${s.out_of_stock} out of stock)`);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seedProducts().catch(() => process.exit(1));
