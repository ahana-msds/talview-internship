import { useState } from 'react';
// RTK Query hook for fetching products
import { useGetProductsQuery } from './productsApi';

// Type definitions for products
import type { Product } from './productsApi';

interface ProductListProps {
    products?: Product[]; // Optional prop to inject local data (useful for stories)
}

/**
 * ProductList: Fetches and displays products with pagination support.
 * Displays 8 products per page.
 */
const ProductList = ({ products: injectedProducts }: ProductListProps) => {
    const [page, setPage] = useState(0);
    const LIMIT = 8;

    // Execute the RTK Query fetch if no local data is provided
    const { data, error, isLoading, isFetching } = useGetProductsQuery(
        { limit: LIMIT, skip: page * LIMIT },
        { skip: !!injectedProducts }
    );

    // Use either the injected products or the fetched data
    const products = injectedProducts || data?.products;
    const total = data?.total || 0;
    const hasNextPage = (page + 1) * LIMIT < total;

    // Handle loading and error states
    if (!injectedProducts && isLoading) return <p>Loading products...</p>;
    if (!injectedProducts && error) return <p>Error loading products</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Products (Server State)</h2>
                {/* Pagination Controls */}
                {!injectedProducts && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0 || isFetching}
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', textTransform: 'none', display: 'flex', alignItems: 'center' }}
                        >
                            ←
                        </button>

                        {/* Numbered Page Buttons (Sliding Window of 4) */}
                        {(() => {
                            const totalPages = Math.ceil(total / LIMIT);
                            const pages = [];
                            let start = Math.max(0, page - 1);
                            let end = Math.min(totalPages, start + 4);

                            // Adjust to ensure we always show 4 pages if they exist
                            if (end - start < 4) {
                                start = Math.max(0, end - 4);
                            }

                            for (let i = start; i < end; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className="btn btn-secondary"
                                        style={{
                                            padding: '5px 12px',
                                            textTransform: 'none',
                                            backgroundColor: page === i ? 'var(--color-primary)' : 'transparent',
                                            color: page === i ? 'var(--color-bg)' : 'var(--color-text)',
                                            border: page === i ? 'none' : '1px solid var(--color-border)',
                                            minWidth: '40px'
                                        }}
                                        disabled={isFetching}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            }
                            return pages;
                        })()}

                        {Math.ceil(total / LIMIT) > 4 && page < Math.ceil(total / LIMIT) - 3 && (
                            <span style={{ opacity: 0.5, margin: '0 4px' }}>...</span>
                        )}

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!hasNextPage || isFetching}
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', textTransform: 'none', display: 'flex', alignItems: 'center' }}
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                {products?.map((product: Product) => (
                    <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.title}</h3>
                        <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '1rem' }}>${product.price}</p>
                        <div style={{ marginTop: 'auto' }}>
                            <button
                                onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                className="btn"
                                style={{ width: '100%' }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
