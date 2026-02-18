/**
 * test-stock-race.ts
 * Tests the atomic stock reservation logic by sending concurrent orders.
 * Run: npx ts-node --esm src/test-stock-race.ts
 */
import assert from 'assert';

async function testRaceCondition() {
    const TEST_PRODUCT_ID = 1; // Essence Mascara (stock 99 initially)
    const API_URL = 'http://localhost:4002/api/orders/start';

    console.log('🏁 Starting Race Condition Test 🏁');

    // Fetch current stock first
    const productRes = await fetch(`http://localhost:4002/api/products/${TEST_PRODUCT_ID}`);
    const product = await productRes.json();
    console.log(`📦 Current Stock for Product ${TEST_PRODUCT_ID}: ${product.stock}`);

    if (product.stock < 10) {
        console.warn('⚠️ Stock too low for this test. Please re-seed or pick another product.');
        return;
    }

    // Prepare two conflicting orders
    // Both try to buy most of the stock simultaneously
    const qty1 = Math.floor(product.stock * 0.8);
    const qty2 = Math.floor(product.stock * 0.5);
    // Total demand > 100% of stock

    console.log(`🚀 Sending two concurrent orders: Order A (${qty1} units) and Order B (${qty2} units)`);

    const p1 = fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Email': 'userA@test.com' },
        body: JSON.stringify({
            orderId: `race-${Date.now()}-A`,
            address: '123 Test Lane',
            items: [{ id: TEST_PRODUCT_ID, quantity: qty1 }]
        })
    });

    const p2 = fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Email': 'userB@test.com' },
        body: JSON.stringify({
            orderId: `race-${Date.now()}-B`,
            address: '456 Conflict Road',
            items: [{ id: TEST_PRODUCT_ID, quantity: qty2 }]
        })
    });

    const [res1, res2] = await Promise.all([p1, p2]);

    console.log(`\n📝 Results:`);
    const text1 = await res1.text();
    const text2 = await res2.text();

    console.log(`Order A Status: ${res1.status} - Body: ${text1}`);
    console.log(`Order B Status: ${res2.status} - Body: ${text2}`);

    const successCount = (res1.status === 200 ? 1 : 0) + (res2.status === 200 ? 1 : 0);
    const conflictCount = (res1.status === 409 ? 1 : 0) + (res2.status === 409 ? 1 : 0);

    if (successCount === 1 && conflictCount === 1) {
        console.log('✅ TEST PASSED: Exactly one order succeeded and one failed due to conflict.');
    } else {
        console.error('❌ TEST FAILED: Unexpected outcome.');
        if (successCount === 2) console.error('   Both orders succeeded! Overselling occurred!');
        if (conflictCount === 2) console.error('   Both orders failed! Locking might be too aggressive or stock too low.');
    }

    // Verify final stock
    const finalProductRes = await fetch(`http://localhost:4002/api/products/${TEST_PRODUCT_ID}`);
    const finalProduct = await finalProductRes.json();
    console.log(`\n📦 Final Stock: ${finalProduct.stock}`);
}

testRaceCondition().catch(console.error);
