import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderQuery, useSignalOrderMutation } from '../features/admin/adminApi';
import { Navbar } from '../components/Navbar';

const GRACE_PERIOD_MS = 5 * 60 * 1000; // 5 minutes

export const OrderConfirmationPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading, refetch } = useGetOrderQuery(orderId || '', { skip: !orderId, pollingInterval: 5000 });
    const [signalOrder] = useSignalOrderMutation();

    const [timeLeft, setTimeLeft] = useState<number>(GRACE_PERIOD_MS);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [isSignaling, setIsSignaling] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (!order?.createdAt) return;
        const createdAt = new Date(order.createdAt).getTime();

        const tick = () => {
            const elapsed = Date.now() - createdAt;
            const remaining = Math.max(0, GRACE_PERIOD_MS - elapsed);
            setTimeLeft(remaining);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [order?.createdAt]);

    const graceExpired = timeLeft <= 0;
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    const handleChangeAddress = async () => {
        if (!newAddress.trim() || !orderId) return;
        setIsSignaling(true);
        try {
            await signalOrder({ id: orderId, signal: 'updateAddress', payload: newAddress }).unwrap();
            setShowAddressForm(false);
            setNewAddress('');
            refetch();
            alert('Address updated successfully!');
        } catch (err) {
            console.error('Failed to update address:', err);
            alert('Failed to update address. The grace period may have expired.');
        }
        setIsSignaling(false);
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Loading order details...</h2>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Order not found</h2>
                    <p>The order ID <code>{orderId}</code> could not be found.</p>
                    <button onClick={() => navigate('/products')} className="btn" style={{ marginTop: '1rem' }}>Back to Products</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                    <h2 style={{ margin: '0 0 0.5rem 0' }}>Order Placed!</h2>
                    <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>Order ID: <code style={{ fontWeight: 'bold' }}>{order.id}</code></p>

                    {/* Timer */}
                    <div style={{
                        background: graceExpired ? 'var(--color-bg-alt)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: graceExpired ? 'var(--color-text)' : 'white',
                        padding: '1.2rem',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1.5rem',
                    }}>
                        {graceExpired ? (
                            <div>
                                <strong>⏰ Grace period expired</strong>
                                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', opacity: 0.7 }}>Address can no longer be changed.</p>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '4px' }}>Address change window</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Details */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>📦 Items</h4>
                        {order.items?.map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                                {item.thumbnail && <img src={item.thumbnail} alt={item.title} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />}
                                <span style={{ flex: 1 }}>{item.title} × {item.quantity || 1}</span>
                                <span style={{ fontWeight: 'bold' }}>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                        ))}

                        <h4 style={{ marginTop: '1.2rem', marginBottom: '0.5rem' }}>📍 Delivery Address</h4>
                        <p style={{ background: 'var(--color-bg-alt)', padding: '10px', borderRadius: 'var(--radius)', margin: 0 }}>{order.address}</p>

                        <h4 style={{ marginTop: '1.2rem', marginBottom: '0.5rem' }}>📋 Status</h4>
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            background: order.status === 'PENDING' ? '#ffeaa7' : order.status === 'SHIPPED' ? '#55efc4' : '#fab1a0',
                            color: '#333',
                        }}>
                            {order.status}
                        </span>
                    </div>

                    {/* Change Address */}
                    {!graceExpired && (
                        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                            {!showAddressForm ? (
                                <button onClick={() => setShowAddressForm(true)} className="btn btn-secondary" style={{ width: '100%' }}>
                                    ✏️ Change Delivery Address
                                </button>
                            ) : (
                                <div style={{ background: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                                    <h4 style={{ marginTop: 0 }}>New Address</h4>
                                    <textarea
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        placeholder="Enter new full address..."
                                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', minHeight: '80px', fontSize: '1rem', resize: 'vertical', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button onClick={handleChangeAddress} disabled={isSignaling} className="btn" style={{ flex: 1 }}>
                                            {isSignaling ? 'Updating...' : 'Update Address'}
                                        </button>
                                        <button onClick={() => setShowAddressForm(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={() => navigate('/products')} className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};
