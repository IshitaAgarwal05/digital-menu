import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CartModal = ({ onClose }) => {
    const { cart, changeQty, clearCart, totalPrice } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const handleCheckout = async () => {
        if (Object.keys(cart).length === 0) return;

        const WHATSAPP_NUMBER = "919829610570";
        let message = "Hello Glacier Ice Cream!🍦\n\n*New Order:*\n";
        let itemsSummary = [];

        for (const [name, data] of Object.entries(cart)) {
            message += `- ${data.qty}x [${data.brand}] ${name} (₹${data.price * data.qty})\n`;
            itemsSummary.push(`${data.qty}x ${name}`);
        }

        if (user && user.address) {
            message += `\n*Delivery Details:*\nName: ${user.name}\nAddress: ${user.address}\nPhone: ${user.phone}\n`;

            try {
                await api.post('/orders', {
                    items: Object.entries(cart).map(([name, data]) => ({
                        name,
                        price: data.price,
                        qty: data.qty,
                        brand: data.brand
                    })),
                    totalAmount: totalPrice,
                    itemsSummary: itemsSummary.join(', ')
                });
            } catch (error) {
                console.error('Error saving order', error);
            }
        }

        message += `\n*Total Amount: ₹${totalPrice}*\n\n_Please confirm my order._`;
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="custom-modal">
            <div className="modal-content-box">
                <div className="modal-header-row">
                    <h2>Your Cart</h2>
                    <div className="close-modal-icon" onClick={onClose}>×</div>
                </div>

                <div id="cart-items-list">
                    {Object.entries(cart).map(([name, data]) => (
                        <div key={name} className="cart-item" style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
                            fontWeight: '500', borderBottom: '1px dashed #e2e8f0', paddingBottom: '15px'
                        }}>
                            <div className="cart-item-details" style={{ flex: 2, fontSize: '0.95em', color: '#334155' }}>
                                <div style={{ fontSize: '0.75em', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>{data.brand}</div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{name}</div>
                            </div>
                            <div className="cart-item-controls" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                                <button className="qty-btn" onClick={() => changeQty(name, -1)}>-</button>
                                <span style={{ fontWeight: 700 }}>{data.qty}</span>
                                <button className="qty-btn" onClick={() => changeQty(name, 1)}>+</button>
                            </div>
                            <div className="cart-item-price" style={{ flex: 1, textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                ₹{data.price * data.qty}
                            </div>
                        </div>
                    ))}
                    {Object.keys(cart).length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', fontWeight: '500' }}>Your cart is empty. 🍦</p>}
                </div>

                <div className="cart-total" style={{
                    fontSize: '1.4em', fontWeight: 800, color: '#0f172a', textAlign: 'right',
                    marginTop: '10px', borderTop: '2px solid #f1f5f9', paddingTop: '15px'
                }}>
                    Total: ₹{totalPrice}
                </div>

                <button className="checkout-btn btn-wa" style={{
                    width: '100%', padding: '16px', border: 'none', borderRadius: '12px',
                    fontSize: '1.1em', fontWeight: 'bold', color: 'white', cursor: 'pointer',
                    marginTop: '15px', background: '#10b981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }} onClick={handleCheckout}>
                    📱 Order on WhatsApp
                </button>

                <button className="checkout-btn btn-clear" style={{
                    width: '100%', padding: '16px', border: '2px solid #fee2e2', borderRadius: '12px',
                    fontSize: '1.1em', fontWeight: 'bold', color: '#e74c3c', cursor: 'pointer',
                    marginTop: '10px', background: '#fff'
                }} onClick={() => { if (window.confirm('Clear cart?')) clearCart() }}>
                    🗑️ Clear Cart
                </button>
            </div>
        </div>
    );
};

export default CartModal;
