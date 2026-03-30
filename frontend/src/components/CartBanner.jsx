import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

const CartBanner = ({ onClick }) => {
    const { totalQty, totalPrice } = useContext(CartContext);

    if (totalQty === 0) return null;

    return (
        <motion.div
            id="bottom-cart-banner"
            className="visible"
            onClick={onClick}
            key={totalQty}
            style={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                x: '-50%', // Framer Motion handles x transform, preserving centering
            }}
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="banner-left">
                <motion.span
                    className="banner-items"
                    animate={{ scale: [1, 1.2, 1] }}
                    key={totalQty}
                >
                    {totalQty} ITEM{totalQty > 1 ? 'S' : ''}
                </motion.span>
                <span className="banner-price">₹{totalPrice}</span>
            </div>
            <motion.div
                className="banner-right"
                animate={{ rotate: [0, -10, 10, -5, 0] }}
                key={`wiggle-${totalQty}`}
            >
                View Cart 🛒
            </motion.div>
        </motion.div>
    );
};

export default CartBanner;
