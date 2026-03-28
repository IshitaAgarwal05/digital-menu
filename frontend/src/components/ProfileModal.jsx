import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProfileModal = ({ onClose }) => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [address, setAddress] = useState(user?.address || '');
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user && activeTab === 'orders') {
            fetchOrders();
        }
    }, [user, activeTab]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMsg('');
        try {
            const { data } = await api.put('/users/profile', { name, address });
            setUser(data);
            setMsg('Profile saved successfully! ✅');
        } catch (error) {
            setMsg('Failed to save.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="custom-modal">
            <div className="modal-content-box">
                <div className="modal-header-row" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: '5px' }}>
                    <h2>My Account</h2>
                    <div className="close-modal-icon" onClick={onClose}>×</div>
                </div>

                <div id="modal-tab-bar" style={{ display: 'flex', width: '100%', borderBottom: '2px solid #f1f5f9', marginBottom: '20px', flexShrink: 0 }}>
                    <div
                        className={`modal-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                        style={{ flex: 1, textAlign: 'center', padding: '12px', fontWeight: 700, fontSize: '0.95em', color: activeTab === 'profile' ? 'var(--glacier-blue)' : '#64748b', cursor: 'pointer', borderBottom: activeTab === 'profile' ? '2px solid var(--glacier-blue)' : 'none' }}
                    >👤 Profile</div>
                    <div
                        className={`modal-tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                        style={{ flex: 1, textAlign: 'center', padding: '12px', fontWeight: 700, fontSize: '0.95em', color: activeTab === 'orders' ? 'var(--glacier-blue)' : '#64748b', cursor: 'pointer', borderBottom: activeTab === 'orders' ? '2px solid var(--glacier-blue)' : 'none' }}
                    >🛍️ Past Orders</div>
                </div>

                {activeTab === 'profile' ? (
                    <div className="modal-tab-content active" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '25px' }}>
                            <span className="auth-label" style={{ fontSize: '0.85em', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Full Name</span>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="e.g. Rahul Sharma"
                                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1em', marginBottom: '15px' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <span className="auth-label" style={{ fontSize: '0.85em', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Delivery Address</span>
                            <textarea
                                className="auth-input"
                                rows="3"
                                placeholder="Flat No, Building, Street, Landmark..."
                                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1em', marginBottom: '15px', fontFamily: 'inherit' }}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            <button
                                className="auth-btn"
                                style={{ width: '100%', padding: '16px', background: 'var(--glacier-blue)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.05em', fontWeight: 'bold', cursor: 'pointer' }}
                                onClick={handleUpdateProfile}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Details'}
                            </button>
                            {msg && <div style={{ color: '#10b981', fontSize: '0.85em', marginTop: '8px', textAlign: 'center', fontWeight: 700 }}>{msg}</div>}

                            {user?.role === 'admin' && (
                                <button
                                    className="auth-btn"
                                    style={{ width: '100%', padding: '16px', background: '#475569', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.05em', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}
                                    onClick={() => { window.location.href = '/admin'; }}
                                >
                                    ⚙️ Admin Dashboard
                                </button>
                            )}
                        </div>
                        <button className="checkout-btn btn-clear" style={{
                            width: '100%', padding: '16px', border: '2px solid #fee2e2', borderRadius: '12px',
                            fontSize: '1.1em', fontWeight: 'bold', color: '#e74c3c', cursor: 'pointer',
                            marginTop: 'auto', background: '#fff'
                        }} onClick={() => { logout(); onClose(); }}>🚪 Logout</button>
                    </div>
                ) : (
                    <div className="modal-tab-content active">
                        <div id="order-history-list" style={{ maxHeight: '280px', overflowY: 'auto', padding: '5px' }}>
                            {orders.length === 0 ? (
                                <p style={{ fontSize: '0.85em', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No past orders found. 🍦</p>
                            ) : (
                                orders.map(order => (
                                    <div key={order._id} className="order-history-card" style={{
                                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', marginBottom: '15px'
                                    }}>
                                        <div className="order-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #f1f5f9', paddingBottom: '10px', marginBottom: '10px' }}>
                                            <div className="order-history-date" style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85em' }}>
                                                📅 {new Date(order.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="order-history-total" style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.1em' }}>₹{order.totalAmount}</div>
                                        </div>
                                        <div className="order-history-items" style={{ color: '#475569', fontSize: '0.85em', lineHieght: '1.6' }}>
                                            {order.itemsSummary.split(', ').map((item, i) => (
                                                <div key={i} className="order-item-line" style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
                                                    <span style={{ color: '#cbd5e1' }}>▪</span> <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
