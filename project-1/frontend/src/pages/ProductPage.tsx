import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import {
    useGetProductsQuery,
    useGetCategoriesQuery,
    useSearchProductsQuery,
    useGetProductsByCategoryQuery,
    type Product,
} from '../features/products/productsApi';

const LIMIT = 12;

export const ProductPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset page on category change
    useEffect(() => { setPage(0); }, [selectedCategory]);

    // Fetch categories
    const { data: categories } = useGetCategoriesQuery();

    // Decide which query to use
    const isSearch = searchQuery.length > 0;
    const isCategory = selectedCategory.length > 0 && !isSearch;

    const defaultQuery = useGetProductsQuery(
        { limit: LIMIT, skip: page * LIMIT },
        { skip: isSearch || isCategory }
    );
    const searchQueryResult = useSearchProductsQuery(
        { q: searchQuery, limit: LIMIT, skip: page * LIMIT },
        { skip: !isSearch }
    );
    const categoryQuery = useGetProductsByCategoryQuery(
        { category: selectedCategory, limit: LIMIT, skip: page * LIMIT },
        { skip: !isCategory }
    );

    const activeQuery = isSearch ? searchQueryResult : isCategory ? categoryQuery : defaultQuery;
    const { data, isLoading, isFetching } = activeQuery;

    let products = data?.products || [];
    const total = data?.total || 0;
    const hasNextPage = (page + 1) * LIMIT < total;

    // Client-side sort
    const sortedProducts = useMemo(() => {
        if (!sortBy || !products.length) return products;
        return [...products].sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
            return 0;
        });
    }, [products, sortBy]);

    const handleBuyNow = (product: Product) => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        }));
        navigate('/checkout');
    };

    const goToDashboard = () => {
        if (window.opener) window.close();
        else navigate('/dashboard');
    };

    const selectStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '0.9rem',
        minWidth: '160px',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ padding: '1rem 20px', textAlign: 'left' }}>
                <button onClick={goToDashboard} className="btn btn-secondary">← Back to Dashboard</button>
            </div>
            <div className="container" style={{ padding: '1rem 20px', flex: 1, textAlign: 'left' }}>
                <h2>Product Catalog</h2>

                {/* Filter / Sort / Search Toolbar */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    padding: '14px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                }}>
                    {/* Search */}
                    <div style={{ flex: '1 1 250px' }}>
                        <input
                            type="text"
                            className="input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="🔍 Search products..."
                            style={{ width: '100%', padding: '8px 12px' }}
                        />
                    </div>

                    {/* Filter by category */}
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setSearchInput(''); setSearchQuery(''); }}
                            style={selectStyle}
                            disabled={isSearch}
                        >
                            <option value="">All Categories</option>
                            {categories?.map(cat => (
                                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort by */}
                    <div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
                            <option value="">Sort By</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="name-asc">Name: A → Z</option>
                        </select>
                    </div>

                    {(searchQuery || selectedCategory || sortBy) && (
                        <button
                            onClick={() => { setSearchInput(''); setSearchQuery(''); setSelectedCategory(''); setSortBy(''); setPage(0); }}
                            className="btn btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                            ✕ Clear All
                        </button>
                    )}
                </div>

                {/* Results info */}
                {(searchQuery || selectedCategory) && (
                    <p style={{ opacity: 0.7, marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {searchQuery ? `Search results for "${searchQuery}"` : `Category: ${selectedCategory}`}
                        {' '} — {total} product{total !== 1 ? 's' : ''} found
                    </p>
                )}

                {/* Products Grid */}
                <div style={{ marginTop: '1rem', width: '100%', maxWidth: '1200px', margin: '1rem auto' }}>
                    {isLoading ? (
                        <p>Loading products...</p>
                    ) : sortedProducts.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, opacity: 0.8 }}>
                                    {sortedProducts.length} of {total} products
                                </h3>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0 || isFetching} className="btn btn-secondary" style={{ padding: '5px 10px' }}>←</button>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Page {page + 1}</span>
                                    <button onClick={() => setPage(p => p + 1)} disabled={!hasNextPage || isFetching} className="btn btn-secondary" style={{ padding: '5px 10px' }}>→</button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', opacity: isFetching ? 0.6 : 1 }}>
                                {sortedProducts.map((product) => {
                                    const outOfStock = product.stock !== undefined && product.stock <= 0;
                                    return (
                                        <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', opacity: outOfStock ? 0.65 : 1 }}>
                                            {outOfStock && (
                                                <div style={{
                                                    position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                                                    background: '#e74c3c', color: '#fff', padding: '4px 12px',
                                                    borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem',
                                                    letterSpacing: '0.5px', textTransform: 'uppercase',
                                                }}>Out of Stock</div>
                                            )}
                                            <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1rem' }} />
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.title}</h3>
                                            <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.3rem' }}>${product.price}</p>
                                            {product.stock !== undefined && (
                                                <p style={{ fontSize: '0.78rem', opacity: 0.6, marginBottom: '1rem' }}>
                                                    {outOfStock ? 'Currently unavailable' : `${product.stock} left in stock`}
                                                </p>
                                            )}
                                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleBuyNow(product)}
                                                    className="btn"
                                                    style={{ width: '100%', ...(outOfStock ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
                                                    disabled={outOfStock}
                                                >{outOfStock ? 'Out of Stock' : 'Buy Now'}</button>
                                                <button onClick={() => navigate(`/product/${product.id}`)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>View Details</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};