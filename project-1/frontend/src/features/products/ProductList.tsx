import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductsQuery } from './productsApi';
import { addToCart } from '../cart/cartSlice';
import type { Product } from './productsApi';

interface ProductListProps {
    products?: Product[];
    sortBy?: string;
}

const ProductList = ({ products: injectedProducts, sortBy }: ProductListProps) => {
    const [page, setPage] = useState(0);
    const LIMIT = 12;
    const { data, error, isLoading, isFetching } = useGetProductsQuery(
        { limit: LIMIT, skip: page * LIMIT },
        { skip: !!injectedProducts }
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    let products = injectedProducts || data?.products;
    const total = data?.total || 0;
    const hasNextPage = (page + 1) * LIMIT < total;

    // Client-side sorting
    if (products && sortBy) {
        products = [...products].sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
            return 0;
        });
    }

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
                            <button onClick={() => handleBuyNow(product)} className="btn" style={{ width: '100%' }}>Buy Now</button>
                            <button onClick={() => navigate(`/product/${product.id}`)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
