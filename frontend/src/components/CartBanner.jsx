import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CartBanner = ({ onClick }) => {
    const { totalQty, totalPrice } = useContext(CartContext);

    if (totalQty === 0) return null;

    return (
        <div id="bottom-cart-banner" className="visible" onClick={onClick}>
            <div className="banner-left">
                <span className="banner-items">{totalQty} ITEM{totalQty > 1 ? 'S' : ''}</span>
                <span className="banner-price">₹{totalPrice}</span>
            </div>
            <div className="banner-right">View Cart ➔</div>
        </div>
    );
};

export default CartBanner;
