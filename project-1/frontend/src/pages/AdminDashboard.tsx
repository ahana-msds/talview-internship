import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery, useGetRequestsQuery, useSignalOrderMutation } from '../features/admin/adminApi';
import styles from './AdminDashboard.module.css';

const OrderCard = ({ order, handleSignal }: { order: any, handleSignal: (id: string, signal: string, payload?: any) => Promise<void> }) => {
    const [overrideStatus, setOverrideStatus] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '', street: '', city: '', state: '', pincode: '', phone: ''
    });

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullAddress = `${newAddress.name}, ${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}, Phone: ${newAddress.phone}`;
        handleSignal(order.id, 'updateAddress', fullAddress);
        setShowAddressForm(false);
        setNewAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-border)',
        fontSize: '0.9rem', marginBottom: '8px', background: 'var(--color-bg)'
    };

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderHeader}>
                <span className={styles.orderId}>ID: {order.id.slice(0, 8)}...</span>
                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                </span>
            </div>
            <div className={styles.orderContent}>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Workflow:</strong> {order.workflow_id}</p>
            </div>
            <div className={styles.actions}>
                <div className={styles.inputGroup} style={{ marginBottom: '10px' }}>
                    <select
                        value={overrideStatus}
                        onChange={(e) => setOverrideStatus(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Status Signal</option>
                        <option value="shipment-confirm">Confirm Shipment</option>
                        <option value="shipped">Mark Shipped</option>
                        <option value="delivered">Mark Delivered</option>
                        <option value="cancelOrder">Cancel Order</option>
                    </select>
                    <button
                        onClick={() => handleSignal(order.id, overrideStatus)}
                        disabled={!overrideStatus}
                        className={styles.signalBtn}
                    >
                        Send Signal
                    </button>
                </div>

                {!showAddressForm ? (
                    <button onClick={() => setShowAddressForm(true)} className={styles.signalBtn} style={{ width: '100%' }}>
                        Change Address
                    </button>
                ) : (
                    <form onSubmit={handleAddressSubmit} style={{ background: 'var(--color-bg-alt)', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>New Address</div>
                        <input name="name" value={newAddress.name} onChange={handleAddressChange} placeholder="Full Name" required style={inputStyle} />
                        <input name="street" value={newAddress.street} onChange={handleAddressChange} placeholder="Street" required style={inputStyle} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="City" required style={{ ...inputStyle, flex: 1 }} />
                            <input name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="State" required style={{ ...inputStyle, flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input name="pincode" value={newAddress.pincode} onChange={handleAddressChange} placeholder="Pin" required pattern="[0-9]{5,6}" style={{ ...inputStyle, flex: 1 }} />
                            <input name="phone" value={newAddress.phone} onChange={handleAddressChange} placeholder="+91..." required pattern="\+91[0-9]{10}" style={{ ...inputStyle, flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button type="submit" className={styles.signalBtn} style={{ flex: 1 }}>Update</button>
                            <button type="button" onClick={() => setShowAddressForm(false)} className={styles.signalBtn} style={{ flex: 1, background: '#ccc', color: '#333' }}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { data: orders, isLoading: isLoadingOrders, error: errorOrders } = useGetOrdersQuery();
    const { data: requests, isLoading: isLoadingRequests, error: errorRequests } = useGetRequestsQuery();
    const [signalOrder] = useSignalOrderMutation();

    const isLoading = isLoadingOrders || isLoadingRequests;
    const error = errorOrders || errorRequests;

    if (isLoading) return <div className={styles.container}>Loading Dashboard...</div>;
    if (error) return <div className={styles.container}>Error loading dashboard data.</div>;

    const handleSignal = async (id: string, signal: string, payload?: any) => {
        try {
            await signalOrder({ id, signal, payload }).unwrap();
            alert(`Signal ${signal} sent successfully!`);
        } catch (err) {
            console.error('Failed to send signal:', err);
            alert('Failed to send signal.');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '15px' }}>
                    ← Back to Dashboard
                </button>
                <h1>Admin Control Center</h1>
                <p>Monitor and manage resilient order workflows</p>
            </header>

            <section className={styles.stats}>
                <div className={styles.statCard}>
                    <h3>Active Orders</h3>
                    <p>{orders?.length || 0}</p>
                </div>
            </section>

            <section className={styles.orderList}>
                <h2>Live Orders (Temporal + Hasura)</h2>
                <div className={styles.grid}>
                    {orders?.map((order) => (
                        <OrderCard key={order.id} order={order} handleSignal={handleSignal} />
                    ))}
                    {!orders?.length && <p className={styles.empty}>No active orders found.</p>}
                </div>
            </section>

            <section className={styles.orderList} style={{ marginTop: '40px' }}>
                <h2>Flagged User Issues</h2>
                <div className={styles.grid}>
                    {requests?.map((req) => (
                        <div key={req.id} className={styles.orderCard} style={{ borderLeft: '4px solid var(--color-error)' }}>
                            <div className={styles.orderHeader}>
                                <span className={styles.orderId}>Issue #{req.id}</span>
                                <span className={`${styles.status} ${styles.pending}`}>
                                    {req.status}
                                </span>
                            </div>
                            <div className={styles.orderContent}>
                                <p><strong>User:</strong> {req.user_id}</p>
                                <p><strong>Order ID:</strong> {req.order_id}</p>
                                <p><strong>Description:</strong> {req.description}</p>
                                <p><strong>Sentry ID:</strong> {req.sentry_id}</p>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '10px' }}>
                                    Reported: {new Date(req.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {!requests?.length && <p className={styles.empty}>No generic issues flagged.</p>}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
