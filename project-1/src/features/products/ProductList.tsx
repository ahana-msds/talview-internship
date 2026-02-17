import { useState } from 'react';
import * as Sentry from "@sentry/react";
import { useGetProductsQuery } from './productsApi';
import { useStartOrderMutation } from '../admin/adminApi';
import type { Product } from './productsApi';

interface ProductListProps {
    products?: Product[];
}

const ProductList = ({ products: injectedProducts }: ProductListProps) => {
    const [page, setPage] = useState(0);
    const LIMIT = 12;
    const { data, error, isLoading, isFetching } = useGetProductsQuery(
        { limit: LIMIT, skip: page * LIMIT },
        { skip: !!injectedProducts }
    );

    const [startOrder] = useStartOrderMutation();

    const products = injectedProducts || data?.products;
    const total = data?.total || 0;
    const hasNextPage = (page + 1) * LIMIT < total;

    const handleBuyNow = async (product: Product) => {
        try {
            const orderId = Math.random().toString(36).substring(7);
            const address = "123 Default Street, Tech City"; // Placeholder
            await startOrder({ orderId, address, items: [product] }).unwrap();
            alert(`Order ${orderId} placed! You have a 5-minute grace period to change the address in your profile.`);
        } catch (err) {
            console.error('Failed to buy:', err);
            Sentry.captureException(err);
        }
    };

    const handleFlagIssue = (product: Product) => {
        const eventId = Sentry.captureMessage(`Issue flagged for product: ${product.title}`);
        Sentry.showReportDialog({ eventId });
    };

    if (!injectedProducts && isLoading) return <p>Loading products...</p>;
    if (!injectedProducts && error) return <p>Error loading products</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Products (Server State)</h2>
                {!injectedProducts && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0 || isFetching} className="btn btn-secondary" style={{ padding: '5px 10px' }}>←</button>
                        <button onClick={() => setPage(p => p + 1)} disabled={!hasNextPage || isFetching} className="btn btn-secondary" style={{ padding: '5px 10px' }}>→</button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', opacity: isFetching ? 0.6 : 1 }}>
                {products?.map((product: Product) => (
                    <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.title}</h3>
                        <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '1rem' }}>${product.price}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button onClick={() => handleBuyNow(product)} className="btn" style={{ width: '100%' }}>Buy Now (Temporal)</button>
                            <button onClick={() => handleFlagIssue(product)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>Flag Issue (Sentry)</button>
                            <button onClick={() => window.open(`/product/${product.id}`, '_blank')} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
