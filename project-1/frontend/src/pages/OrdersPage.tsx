
import { Navbar } from '../components/Navbar';
import { useGetOrdersQuery } from '../features/admin/adminApi';
import { useNavigate } from 'react-router-dom';

export const OrdersPage = () => {
    const navigate = useNavigate();
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    if (isLoading) {
        return (
            <div className="pageWrapper">
                <Navbar />
                <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <div className="loader"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pageWrapper">
                <Navbar />
                <div className="container" style={{ textAlign: 'center', marginTop: '4rem', color: 'red' }}>
                    <h3>Error loading orders</h3>
                    <p>Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pageWrapper">
            <Navbar />
            <div className="container">
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                    ← Back to Dashboard
                </button>

                <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

                {orders && orders.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                        <p style={{ fontSize: '1.2rem' }}>No orders found.</p>
                        <button onClick={() => navigate('/products')} className="btn" style={{ marginTop: '1rem' }}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {orders?.map((order) => (
                            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Order #{order.id}</h3>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4px' }}>
                                            Placed on {new Date(order.createdAt || '').toLocaleDateString()} at {new Date(order.createdAt || '').toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>Items:</strong>
                                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                                        {order.items.map((item: any, idx: number) => (
                                            <li key={idx} style={{ marginBottom: '4px' }}>
                                                {item.title} (x{item.quantity}) - ${item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ fontSize: '0.9rem', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                                    <strong>📍 Delivery to:</strong> <br />
                                    {order.address}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
