import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/admin/orders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin orders', error);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div>Loading Orders...</div>;

    return (
        <div className="admin-content">
            <h1>Recent Orders</h1>
            <div className="orders-table" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--main-bg)', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '15px' }}>Date</th>
                            <th style={{ padding: '15px' }}>Items Summary</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '15px' }}>{new Date(order.timestamp).toLocaleString()}</td>
                                <td style={{ padding: '15px', maxWidth: '300px' }}>{order.itemsSummary}</td>
                                <td style={{ padding: '15px', fontWeight: 800 }}>₹{order.totalAmount}</td>
                                <td style={{ padding: '15px', fontSize: '0.8em', color: 'var(--text-secondary)' }}>{order.userId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
