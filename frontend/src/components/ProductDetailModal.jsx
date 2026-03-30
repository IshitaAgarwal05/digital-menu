import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';

const ProductDetailModal = ({ product, onClose }) => {
    const { cart, addToCart, changeQty } = useContext(CartContext);

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

                            <p className="detail-desc">
                                Indulge in the premium taste of {product.brand}'s {product.name}.
                                Perfect for sharing or treating yourself to a moment of frozen perfection.
                            </p>

                            <div className="detail-meta">
                                <div className="detail-tag-box" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    {product.bestseller && <span className="tag-bestseller">⭐ Bestseller</span>}
                                    <span className="tag-stock">In Stock ⚡</span>
                                </div>
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
