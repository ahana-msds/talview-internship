import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart, removeFromCart } from '../features/cart/cartSlice';
import { useStartOrderMutation } from '../features/admin/adminApi';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const { user } = useAuth();
    const [startOrder] = useStartOrderMutation();

    const [address, setAddress] = useState({
        name: user?.displayName || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [stockError, setStockError] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            alert('Cart is empty.');
            return;
        }

        // Custom Validation
        if (!address.phone.startsWith('+91') || address.phone.length !== 13) {
            alert('Phone number must start with +91 and be followed by 10 digits.');
            return;
        }

        setIsSubmitting(true);
        setStockError([]);

        try {
            // Readable Order ID: ORD-{timestamp}-{random}
            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            const fullAddress = `${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone}`;

            const result = await startOrder({
                orderId,
                address: fullAddress,
                items: items.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity, thumbnail: i.thumbnail })),
            }).unwrap();

            dispatch(clearCart());
            navigate(`/order-confirmation/${result.workflowId}`);
        } catch (err: any) {
            console.error('Failed to place order:', err);
            // Handle 409 Conflict — stock unavailable
            if (err?.status === 409 && err?.data?.unavailableItems) {
                setStockError(err.data.unavailableItems);
            } else {
                alert('Failed to place order. Please ensure the backend & Temporal are running.');
            }
            setIsSubmitting(false);
        }
    };

    // Remove out-of-stock items from cart
    const handleRemoveUnavailable = () => {
        // Remove items that match stock error titles
        items.forEach(item => {
            if (stockError.includes(item.title)) {
                dispatch(removeFromCart(item.id));
            }
        });
        setStockError([]);
    };

    if (items.length === 0) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Your cart is empty</h2>
                    <p>Add some products before checking out.</p>
                    <button onClick={() => navigate('/products')} className="btn" style={{ marginTop: '1rem' }}>Browse Products</button>
                </div>
            </div>
        );
    }

    // Guest users must login/signup to place an order
    if (user?.provider === 'guest') {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Login Required</h2>
                        <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>You need to be logged in to place an order. Your cart items will be saved.</p>
                        <button onClick={() => navigate('/login', { state: { from: '/cart' } })} className="btn" style={{ width: '100%', marginBottom: '0.8rem', padding: '12px' }}>
                            Login to Continue
                        </button>
                        <button onClick={() => navigate('/signup', { state: { from: '/cart' } })} className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
                            Create an Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
        fontSize: '1rem',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                <button onClick={() => navigate('/cart')} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>← Back to Cart</button>
                <h2 style={{ marginBottom: '1.5rem' }}>Checkout</h2>

                {/* Stock Error Banner */}
                {stockError.length > 0 && (
                    <div style={{
                        background: '#fddfdf', border: '1px solid #e74c3c', borderRadius: 'var(--radius)',
                        padding: '1rem 1.5rem', marginBottom: '1.5rem', color: '#c0392b',
                    }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>⚠️ Some items are out of stock</h3>
                        <ul style={{ margin: '0 0 0.75rem 1rem', padding: 0 }}>
                            {stockError.map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                            ))}
                        </ul>
                        <button
                            onClick={handleRemoveUnavailable}
                            className="btn"
                            style={{ background: '#e74c3c', fontSize: '0.85rem', padding: '6px 14px' }}
                        >
                            Remove Unavailable Items
                        </button>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Address Form */}
                    <form onSubmit={handlePlaceOrder} id="checkout-form">
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1.2rem' }}>📍 Delivery Address</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input name="name" value={address.name} onChange={handleChange} placeholder="Full Name" required style={inputStyle} />
                                <input name="street" value={address.street} onChange={handleChange} placeholder="Street Address" required style={inputStyle} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input name="city" value={address.city} onChange={handleChange} placeholder="City" required style={{ ...inputStyle, flex: 1 }} />
                                    <input name="state" value={address.state} onChange={handleChange} placeholder="State" required style={{ ...inputStyle, flex: 1 }} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="Pincode" required pattern="[0-9]{5,6}" title="5-6 digit pincode" style={{ ...inputStyle, flex: 1 }} />
                                    <input name="phone" value={address.phone} onChange={handleChange} placeholder="Phone (+91...)" required pattern="\+91[0-9]{10}" title="+91 followed by 10 digits" style={{ ...inputStyle, flex: 1 }} />
                                </div>
                            </div>

                            <h3 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>💳 Payment Method</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', border: '2px solid var(--color-primary)', cursor: 'default' }}>
                                <input type="radio" checked readOnly />
                                <span style={{ fontWeight: 'bold' }}>Cash on Delivery (COD)</span>
                            </label>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '6px' }}>More payment options coming soon.</p>
                        </div>
                    </form>

                    {/* Order Summary */}
                    <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '1rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🛒 Order Summary</h3>
                        {items.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                                <img src={item.thumbnail} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.title}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Qty: {item.quantity}</div>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn"
                            disabled={isSubmitting}
                            style={{ width: '100%', marginTop: '1.5rem', padding: '14px', fontSize: '1.1rem' }}
                        >
                            {isSubmitting ? 'Placing Order...' : '🛍️ Place Order (COD)'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
