import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const WHATSAPP_NUMBER = "919829610570";

const CartDrawer = () => {
    const { cart, changeQty, clearCart, totalPrice, totalQty, isCartOpen, toggleCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [instructions, setInstructions] = useState('');

    const cartItems = Object.entries(cart);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        let message = "Hello Glacier Ice Cream!🍦\n\n*New Order:*\n";

        cartItems.forEach(([name, item]) => {
            message += `- ${item.qty}x [${item.brand}] ${name} (₹${item.price * item.qty})\n`;
        });

        if (instructions.trim()) {
            message += `\n*Special Instructions:* ${instructions}\n`;
        }

        if (user) {
            message += `\n*Delivery Details:*\nName: ${user.name || 'Customer'}\nAddress: ${user.address || 'Not Provided'}\nPhone: ${user.phone || ''}\n`;
        } else {
            message += `\n*Note:* This guest order needs a delivery address.\n`;
        }

        message += `\n*Total Amount: ₹${totalPrice}*\n\n_Please confirm my order._`;

        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.location.href = waUrl;
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        className="drawer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => toggleCart(false)}
                    />
                    <motion.div
                        className="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="drawer-header">
                            <h3>My Scoop Cart ({totalQty})</h3>
                            <button className="close-drawer" onClick={() => toggleCart(false)}>×</button>
                        </div>

                        {totalPrice > 0 && (
                            <div className="cart-progress-container">
                                <span className="progress-text">
                                    {totalPrice >= 500
                                        ? "🎉 You've unlocked a FREE topping!"
                                        : <>Add <span>₹{500 - totalPrice}</span> more to unlock a <b>FREE topping!</b></>
                                    }
                                </span>
                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="drawer-body">
                            {cartItems.length === 0 ? (
                                <div className="empty-cart-msg">
                                    <div className="empty-icon">🍦</div>
                                    <p>Your cart is parched! Add some scoops.</p>
                                    <button className="start-shopping" onClick={() => toggleCart(false)}>Let's Roll</button>
                                </div>
                            ) : (
                                <motion.div
                                    className="cart-items-list"
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        show: {
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {cartItems.map(([name, item]) => (
                                        <motion.div
                                            key={name}
                                            className="drawer-item"
                                            variants={{
                                                hidden: { opacity: 0, scale: 0.8, x: 20 },
                                                show: { opacity: 1, scale: 1, x: 0 }
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="item-info">
                                                <span className="item-brand">{item.brand}</span>
                                                <span className="item-name">{name}</span>
                                                <span className="item-price-unit">₹{item.price} each</span>
                                            </div>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={name}
                                                    className="cart-item-thumb"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://placehold.co/100x100/f8f9fc/a0a0a0?text=🍦';
                                                    }}
                                                />
                                            )}
                                            <div className="item-actions">
                                                <span className="item-total">₹{item.qty * item.price}</span>
                                                <div className="app-qty-control mini-qty">
                                                    <button onClick={() => changeQty(name, -1)}>−</button>
                                                    <span>{item.qty}</span>
                                                    <button onClick={() => changeQty(name, 1)}>+</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {cartItems.length > 0 && (
                                <div className="special-instructions-box">
                                    <span className="variant-label">Special Instructions</span>
                                    <textarea
                                        placeholder="E.g. Send extra spoons, or 'Pack separately'..."
                                        rows="3"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="drawer-footer">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                                <button className="clear-all-btn" onClick={clearCart}>Clear All</button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
