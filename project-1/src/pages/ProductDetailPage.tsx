import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/products/productsApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { Navbar } from '../components/Navbar';

/**
 * ProductDetailPage: Displays detailed information about a single product.
 * Allows users to choose quantity and add to cart or buy immediately.
 */
export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1);

    // Fetch product details using RTK Query
    const { data: product, isLoading, error } = useGetProductByIdQuery(id || '');

    if (isLoading) return <div className="container">Loading product details...</div>;
    if (error || !product) return <div className="container">Error: Product not found</div>;

    /**
     * Handles adding the product to the Redux cart.
     */
    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: quantity
        }));
        alert(`${quantity} ${product.title}(s) added to cart!`);
    };

    /**
     * Handles the "Buy Now" action: Adds to cart and navigates to cart page.
     */
    const handleBuyNow = () => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: quantity
        }));
        navigate('/cart');
    };

    return (
        <div className="pageWrapper">
            <Navbar />
            <div className="container">
                <button
                    onClick={() => window.opener ? window.close() : navigate(-1)}
                    className="btn btn-secondary"
                    style={{ marginBottom: '2rem' }}
                >
                    ← Back
                </button>

                <div className="card" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '3rem', alignItems: 'start' }}>
                    <div style={{ width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ marginBottom: '0.5rem' }}>{product.title}</h1>
                        <p style={{ color: 'var(--color-accent)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            {product.description}
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                ${product.price}
                            </span>
                            {product.discountPercentage && (
                                <span style={{ marginLeft: '1rem', color: '#e74c3c', fontWeight: 'bold' }}>
                                    {product.discountPercentage}% OFF
                                </span>
                            )}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Quantity:</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: '5px 15px', minWidth: '40px' }}
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                >-</button>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                                    {quantity}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: '5px 15px', minWidth: '40px' }}
                                    onClick={() => setQuantity(q => q + 1)}
                                >+</button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleAddToCart}
                                className="btn"
                                style={{ flex: 1 }}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="btn"
                                style={{ flex: 1, backgroundColor: 'var(--color-accent)' }}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
