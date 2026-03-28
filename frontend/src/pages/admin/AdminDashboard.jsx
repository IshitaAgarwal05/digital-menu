import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats', error);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    const chartData = Object.entries(stats.brandSales).map(([name, value]) => ({ name, value }));

    return (
        <div className="admin-content">
            <h1>Admin Dashboard</h1>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3>Total Sales</h3>
                    <p style={{ fontSize: '1.8em', fontWeight: 800 }}>₹{stats.totalSales}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3>Orders</h3>
                    <p style={{ fontSize: '1.8em', fontWeight: 800 }}>{stats.totalOrders}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3>Products</h3>
                    <p style={{ fontSize: '1.8em', fontWeight: 800 }}>{stats.totalProducts}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3>Users</h3>
                    <p style={{ fontSize: '1.8em', fontWeight: 800 }}>{stats.totalUsers}</p>
                </div>
            </div>

            <h2>Sales by Brand</h2>
            <div style={{ width: '100%', height: 300, background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="var(--glacier-blue)" name="Sales (₹)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;
