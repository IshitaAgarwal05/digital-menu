import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';

const ProductDetailModal = ({ product, onClose }) => {
    const { cart, addToCart, changeQty } = useContext(CartContext);
    const [activeTab, setActiveTab] = React.useState('details');

    if (!product) return null;

    const cartItem = cart[product.name];
    const savings = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    return (
        <AnimatePresence>
            <motion.div
                className="custom-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content-box product-detail-modal"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-modal-icon" onClick={onClose}>×</button>

                    <div className="modal-body-flex">
                        <div className="detail-img-container">
                            {savings > 0 && <div className="detail-discount-badge">{savings}% OFF</div>}
                            <img src={product.image} alt={product.name} className="detail-main-img" />
                        </div>

                        <div className="detail-info-container">
                            <div className="detail-badges-row">
                                <span className="badge-nutri veg">☘️ Pure Veg</span>
                                {product.name.toLowerCase().includes('fruit') && <span className="badge-nutri fruit">🍓 Real Fruit</span>}
                                <span className="badge-nutri natural">🍃 100% Natural</span>
                            </div>

                            <h2 className="detail-title">{product.name}</h2>

                            {/* Tab Navigation */}
                            <div className="detail-tabs">
                                <button
                                    className={`detail-tab ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Details
                                </button>
                                <button
                                    className={`detail-tab ${activeTab === 'specs' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('specs')}
                                >
                                    Specs
                                </button>
                            </div>

                            <div className="tab-viewport">
                                {activeTab === 'details' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="tab-content"
                                    >
                                        <p className="detail-desc">
                                            Indulge in the premium taste of {product.brand}'s {product.name}.
                                            Perfect for sharing or treating yourself to a moment of frozen perfection.
                                        </p>
                                        <div className="detail-tag-box" style={{ display: 'flex', gap: '15px' }}>
                                            {product.bestseller && <span className="tag-bestseller">⭐ Bestseller</span>}
                                            <span className="tag-stock">In Stock ⚡</span>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'specs' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="tab-content"
                                    >
                                        <div className="specs-grid">
                                            <div className="spec-item">
                                                <span className="spec-label">Brand</span>
                                                <span className="spec-value">{product.brand}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Category</span>
                                                <span className="spec-value">{product.category}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Volume/Size</span>
                                                <span className="spec-value">{product.name.match(/(\d+\s*(ml|l|ltr|gm|g|kg))/i)?.[0] || 'Standard Pack'}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="detail-actions">
                                {cartItem ? (
                                    <div className="detail-qty-row">
                                        <div className="app-qty-control big-qty">
                                            <button onClick={() => changeQty(product.name, -1)}>−</button>
                                            <span>{cartItem.qty}</span>
                                            <button onClick={() => changeQty(product.name, 1)}>+</button>
                                        </div>
                                        <span className="item-total-price">₹{cartItem.qty * product.price}</span>
                                    </div>
                                ) : (
                                    <button className="add-to-cart-big" onClick={() => addToCart(product)}>
                                        Add to Cart • ₹{product.price}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductDetailModal;
