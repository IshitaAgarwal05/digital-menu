import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="main-layout" style={{ height: '100dvh' }}>
            <aside className="sidebar" style={{ width: '260px' }}>
                <div style={{ padding: '0 15px 20px 15px', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
                    <h2 style={{ fontSize: '1.2em' }}>Glacier Admin</h2>
                </div>
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => `cat-item ${isActive ? 'active' : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    <div className="cat-icon">📊</div>
                    <div className="cat-name">Overview</div>
                </NavLink>
                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) => `cat-item ${isActive ? 'active' : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    <div className="cat-icon">🛍️</div>
                    <div className="cat-name">Orders</div>
                </NavLink>
                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => `cat-item ${isActive ? 'active' : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    <div className="cat-icon">🍨</div>
                    <div className="cat-name">Products</div>
                </NavLink>
                <div style={{ marginTop: 'auto' }}>
                    <NavLink
                        to="/"
                        className="cat-item"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="cat-icon">🏠</div>
                        <div className="cat-name">Exit Admin</div>
                    </NavLink>
                </div>
            </aside>
            <main className="content-area" style={{ flex: 1, padding: '40px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
