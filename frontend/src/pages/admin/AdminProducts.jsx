import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [mrp, setMrp] = useState(0);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [bestseller, setBestseller] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products', { params: { limit: 1000 } });
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin products', error);
        }
    };

    const handleEdit = (p) => {
        setEditingProduct(p);
        setName(p.name);
        setPrice(p.price);
        setMrp(p.mrp);
        setBrand(p.brand);
        setCategory(p.category);
        setImage(p.image);
        setBestseller(p.bestseller);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { name, price, mrp, brand, category, image, bestseller };
        try {
            if (editingProduct) {
                // PUT /api/products/:id (Need to implement this route)
                alert('Edit functionality coming soon! (Backend route required)');
            } else {
                // POST /api/products (Need to implement this route)
                alert('Add functionality coming soon! (Backend route required)');
            }
            setEditingProduct(null);
            clearForm();
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const clearForm = () => {
        setName(''); setPrice(0); setMrp(0); setBrand(''); setCategory(''); setImage(''); setBestseller(false);
    };

    if (loading) return <div>Loading Products...</div>;

    return (
        <div className="admin-content">
            <h1>Product Management</h1>

            <div className="product-form" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group"><label>Product Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px' }} /></div>
                    <div className="form-group"><label>Brand</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} required style={{ width: '100%', padding: '10px' }} /></div>
                    <div className="form-group"><label>Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} required style={{ width: '100%', padding: '10px' }} /></div>
                    <div className="form-group"><label>Image URL</label><input type="text" value={image} onChange={e => setImage(e.target.value)} required style={{ width: '100%', padding: '10px' }} /></div>
                    <div className="form-group"><label>Price (₹)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: '10px' }} /></div>
                    <div className="form-group"><label>MRP (₹)</label><input type="number" value={mrp} onChange={e => setMrp(e.target.value)} style={{ width: '100%', padding: '10px' }} /></div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label><input type="checkbox" checked={bestseller} onChange={e => setBestseller(e.target.checked)} /> Mark as Bestseller</label>
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                        <button type="submit" className="action-btn" style={{ background: 'var(--glacier-blue)', color: 'white' }}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                        {editingProduct && <button type="button" className="action-btn" onClick={() => { setEditingProduct(null); clearForm(); }}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="products-table" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--main-bg)', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '15px' }}>Image</th>
                            <th style={{ padding: '15px' }}>Name</th>
                            <th style={{ padding: '15px' }}>Brand</th>
                            <th style={{ padding: '15px' }}>Price</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '15px' }}><img src={p.image} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt={p.name} /></td>
                                <td style={{ padding: '15px' }}>{p.name}</td>
                                <td style={{ padding: '15px' }}>{p.brand}</td>
                                <td style={{ padding: '15px', fontWeight: 800 }}>₹{p.price}</td>
                                <td style={{ padding: '15px' }}>
                                    <button onClick={() => handleEdit(p)} style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'var(--glacier-blue)', fontWeight: 'bold' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
