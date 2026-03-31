import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';

const DeliveryTypeSelector = () => {
    const { orderType, setOrderType } = useContext(CartContext);

    return (
        <div className="delivery-type-selector">
            <div className="selector-tabs">
                <button
                    className={`tab ${orderType === 'pickup' ? 'active' : ''}`}
                    onClick={() => setOrderType('pickup')}
                >
                    <span className="icon">🥡</span>
                    <span className="label">Self Pickup</span>
                    <span className="fee">FREE</span>
                </button>
                <button
                    className={`tab ${orderType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setOrderType('delivery')}
                >
                    <span className="icon">🛵</span>
                    <span className="label">Home Delivery</span>
                    <span className="fee">₹80</span>
                </button>
            </div>
            {orderType === 'delivery' && (
                <motion.p
                    className="delivery-hint"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    ✨ Free delivery on orders above ₹1000!
                </motion.p>
            )}
        </div>
    );
};

export default DeliveryTypeSelector;
