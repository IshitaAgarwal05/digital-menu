import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import DeliveryTypeSelector from './DeliveryTypeSelector';
import AddressManager from './AddressManager';
import api from '../services/api';

const WHATSAPP_NUMBER = "919829610570";

const CartDrawer = () => {
    const {
        cart, changeQty, clearCart, totalPrice, totalQty, isCartOpen, toggleCart,
        orderType, deliveryAddress, setDeliveryAddress
    } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [instructions, setInstructions] = useState('');
    const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, type, address, confirm

    const cartItems = Object.entries(cart);
    const deliveryFee = orderType === 'delivery' ? (totalPrice >= 1000 ? 0 : 80) : 0;
    const finalTotal = totalPrice + deliveryFee;

    const handleFinalOrder = async () => {
        if (cartItems.length === 0) return;

        try {
            const orderData = {
                items: cartItems.map(([name, item]) => ({
                    name,
                    price: item.price,
                    qty: item.qty,
                    brand: item.brand
                })),
                totalAmount: finalTotal,
                itemsSummary: cartItems.map(([name, item]) => `${item.qty}x ${name}`).join(', '),
                orderType,
                deliveryAddress: orderType === 'delivery' ? deliveryAddress : null
            };

            await api.post('/orders', orderData);

            let message = `Hello Glacier Ice Cream!🍦\n\n*Order Type: ${orderType.toUpperCase()}*\n`;
            cartItems.forEach(([name, item]) => {
                message += `- ${item.qty}x [${item.brand}] ${name} (₹${item.price * item.qty})\n`;
            });
            message += `\n*Item Total: ₹${totalPrice}*`;
            if (orderType === 'delivery') {
                message += `\n*Delivery Fee: ₹${deliveryFee}*`;
            }
            message += `\n*Grand Total: ₹${finalTotal}*`;

            if (orderType === 'delivery' && deliveryAddress) {
                message += `\n\n*Delivery Address:*\n${deliveryAddress.fullName}\n${deliveryAddress.house}, ${deliveryAddress.street}\n${deliveryAddress.city} - ${deliveryAddress.pincode}${deliveryAddress.latitude ? `\n📍 Location: https://www.google.com/maps?q=${deliveryAddress.latitude},${deliveryAddress.longitude}` : ''}\nPhone: ${deliveryAddress.phone}`;
            }
            if (instructions.trim()) message += `\n\n*Notes:* ${instructions}`;
            message += `\n\n_Please confirm my order._`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            clearCart();
            toggleCart(false);
            setCheckoutStep('cart');
            window.location.href = waUrl;
        } catch (error) {
            alert('Failed to place order. Please try again.');
        }
    };

    const nextStep = () => {
        if (checkoutStep === 'cart') setCheckoutStep('type');
        else if (checkoutStep === 'type') {
            if (orderType === 'pickup') setCheckoutStep('confirm');
            else setCheckoutStep('address');
        }
        else if (checkoutStep === 'address') setCheckoutStep('confirm');
    };

    const prevStep = () => {
        if (checkoutStep === 'type') setCheckoutStep('cart');
        else if (checkoutStep === 'address') setCheckoutStep('type');
        else if (checkoutStep === 'confirm') {
            if (orderType === 'pickup') setCheckoutStep('type');
            else setCheckoutStep('address');
        }
    };

    const steps = [
        { id: 'cart', label: 'Cart' },
        { id: 'type', label: 'Type' },
        { id: 'address', label: 'Address' },
        { id: 'confirm', label: 'Confirm' }
    ].filter(s => orderType === 'pickup' ? s.id !== 'address' : true);

    const activeStepIndex = steps.findIndex(s => s.id === checkoutStep);

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
                        className="cart-drawer-elite"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    >
                        <div className="elite-drawer-header">
                            <div className="header-top">
                                <span className="drawer-title">
                                    {checkoutStep === 'cart' ? 'My Selection' : 'Checkout'}
                                </span>
                                <button className="close-elite" onClick={() => toggleCart(false)}>×</button>
                            </div>

                            <div className="elite-stepper">
                                {steps.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className={`elite-step-item ${i <= activeStepIndex ? 'active' : ''} ${i === activeStepIndex ? 'current' : ''}`}
                                        onClick={() => i < activeStepIndex && setCheckoutStep(s.id)}
                                    >
                                        <div className="step-circle">
                                            {i < activeStepIndex ? '✓' : i + 1}
                                        </div>
                                        <span className="step-label">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="elite-drawer-body">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={checkoutStep}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="step-content-box"
                                >
                                    {checkoutStep === 'cart' && (
                                        <>
                                            {totalPrice > 0 && (
                                                <div className="cart-upsell-card">
                                                    <div className="upsell-text">
                                                        {totalPrice >= 500
                                                            ? "🌟 Free topping unlocked!"
                                                            : <>Add <b>₹{500 - totalPrice}</b> for a <b>FREE topping!</b></>
                                                        }
                                                    </div>
                                                    <div className="upsell-progress-container">
                                                        <div className="bar"><div className="fill" style={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}></div></div>
                                                    </div>
                                                </div>
                                            )}

                                            {cartItems.length === 0 ? (
                                                <div className="elite-empty-state">
                                                    <div className="empty-icon">🍦</div>
                                                    <h3>Your cart is empty</h3>
                                                    <p>Looks like you haven't added any treats yet!</p>
                                                    <button onClick={() => toggleCart(false)}>Start Shopping</button>
                                                </div>
                                            ) : (
                                                <div className="elite-cart-items">
                                                    <div className="items-scroll-box">
                                                        {cartItems.map(([name, item]) => (
                                                            <div key={name} className="elite-cart-item">
                                                                <div className="item-main">
                                                                    <div className="item-details">
                                                                        <span className="brand">{item.brand}</span>
                                                                        <span className="name">{name}</span>
                                                                        <span className="price">₹{item.price * item.qty}</span>
                                                                    </div>
                                                                    <div className="qty-picker">
                                                                        <button onClick={() => changeQty(name, -1)}>−</button>
                                                                        <span>{item.qty}</span>
                                                                        <button onClick={() => changeQty(name, 1)}>+</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="notes-section">
                                                        <label>Cooking Instructions</label>
                                                        <textarea
                                                            placeholder="Any special request? (e.g. Less sugar, extra napkins)"
                                                            value={instructions}
                                                            onChange={(e) => setInstructions(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {checkoutStep === 'type' && (
                                        <div className="elite-type-view">
                                            <DeliveryTypeSelector />
                                            {orderType === 'delivery' && (
                                                <div className={`delivery-promo ${totalPrice >= 1000 ? 'unlocked' : ''}`}>
                                                    <div className="promo-header">
                                                        <span className="icon">🚚</span>
                                                        <span className="msg">
                                                            {totalPrice >= 1000
                                                                ? "Free Delivery Unlocked!"
                                                                : <>₹{1000 - totalPrice} more for Free Delivery</>}
                                                        </span>
                                                    </div>
                                                    <div className="promo-progress">
                                                        <div className="fill" style={{ width: `${Math.min((totalPrice / 1000) * 100, 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {checkoutStep === 'address' && (
                                        <div className="elite-address-view">
                                            <AddressManager onSelect={(addr) => setDeliveryAddress(addr)} />
                                        </div>
                                    )}

                                    {checkoutStep === 'confirm' && (
                                        <div className="elite-confirm-view">
                                            <div className="order-summary-box">
                                                <h5>Items Summary</h5>
                                                {cartItems.map(([name, item]) => (
                                                    <div key={name} className="summary-item">
                                                        <span>{item.qty}x {name}</span>
                                                        <span>₹{item.qty * item.price}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bill-card-elite">
                                                <div className="bill-row">
                                                    <span>Order Method</span>
                                                    <span className="val">{orderType === 'pickup' ? '🏪 Pickup' : '🛵 Delivery'}</span>
                                                </div>
                                                {orderType === 'delivery' && deliveryAddress && (
                                                    <div className="bill-row addr">
                                                        <span>Deliver To</span>
                                                        <span className="val">{deliveryAddress.fullName}, {deliveryAddress.house}...</span>
                                                    </div>
                                                )}
                                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '15px 0' }} />
                                                <div className="bill-row"><span>Sub Total</span><span>₹{totalPrice}</span></div>
                                                {orderType === 'delivery' && (
                                                    <div className="bill-row">
                                                        <span>Delivery Fee</span>
                                                        <span className={deliveryFee === 0 ? 'free' : ''}>
                                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="bill-row total">
                                                    <span>Grand Total</span>
                                                    <span>₹{finalTotal}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="elite-drawer-footer">
                                <div className="footer-price-info">
                                    <div className="total-label">Total Amount</div>
                                    <div className="total-val">₹{finalTotal}</div>
                                </div>
                                <div className="footer-actions">
                                    {checkoutStep !== 'cart' && (
                                        <button className="elite-back-btn" onClick={prevStep}>Back</button>
                                    )}
                                    <button
                                        className={`elite-action-btn ${checkoutStep === 'confirm' ? 'final' : ''}`}
                                        onClick={checkoutStep === 'confirm' ? handleFinalOrder : nextStep}
                                        disabled={checkoutStep === 'address' && !deliveryAddress}
                                    >
                                        {checkoutStep === 'cart' ? (user ? 'Proceed to Pay' : 'Login to Order') :
                                            checkoutStep === 'confirm' ? 'Place Order via WhatsApp' : 'Next Step'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
