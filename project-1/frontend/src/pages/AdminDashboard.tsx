import React, { useState } from 'react';
import { useGetOrdersQuery, useSignalOrderMutation } from '../features/admin/adminApi';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    const [signalOrder] = useSignalOrderMutation();
    const [overrideStatus, setOverrideStatus] = useState<Record<string, string>>({});

    if (isLoading) return <div className={styles.container}>Loading Dashboard...</div>;
    if (error) return <div className={styles.container}>Error loading orders.</div>;

    const handleSignal = async (id: string, signal: string, payload?: any) => {
        try {
            await signalOrder({ id: `order-${id}`, signal, payload }).unwrap();
            alert(`Signal ${signal} sent successfully!`);
        } catch (err) {
            console.error('Failed to send signal:', err);
            alert('Failed to send signal.');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
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
                        <div key={order.id} className={styles.orderCard}>
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
                                        value={overrideStatus[order.id] || ''}
                                        onChange={(e) => setOverrideStatus({ ...overrideStatus, [order.id]: e.target.value })}
                                        className={styles.select}
                                    >
                                        <option value="">Status Signal</option>
                                        <option value="shipment-confirm">Confirm Shipment</option>
                                        <option value="shipped">Mark Shipped</option>
                                        <option value="delivered">Mark Delivered</option>
                                        <option value="cancelOrder">Cancel Order</option>
                                    </select>
                                    <button
                                        onClick={() => handleSignal(order.id, overrideStatus[order.id])}
                                        disabled={!overrideStatus[order.id]}
                                        className={styles.signalBtn}
                                    >
                                        Send Signal
                                    </button>
                                </div>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        placeholder="Update Address"
                                        className={styles.select}
                                        id={`addr-${order.id}`}
                                    />
                                    <button
                                        className={styles.signalBtn}
                                        onClick={() => {
                                            const val = (document.getElementById(`addr-${order.id}`) as HTMLInputElement)?.value;
                                            if (val) handleSignal(order.id, 'updateAddress', val);
                                        }}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!orders?.length && <p className={styles.empty}>No active orders found.</p>}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
