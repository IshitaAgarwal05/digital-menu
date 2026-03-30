import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product, onClick }) => {
  const { cart, addToCart, changeQty } = useContext(CartContext);
  const cartItem = cart[product.name];

  const extractVolumeText = (name) => {
    const match = name.match(/(\d+\s*(ml|l|ltr|gm|g|kg))/i);
    return match ? match[0] : '';
  };

  const volText = extractVolumeText(product.name);
  const displayName = product.name.replace(volText, '').trim() || product.name;
  const discountNum = product.discount || 0;

  return (
    <motion.div
      className={`menu-card ${product.bestseller ? 'bestseller-card' : ''} ${product.mrp && product.mrp > product.price ? 'discount-card' : ''}`}
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-img-wrapper" onClick={onClick} style={{ cursor: 'zoom-in' }}>
        {product.bestseller && <div className="bestseller-badge">⭐ Bestseller</div>}
        {product.mrp && product.mrp > product.price && (
          <div className="discount-tag">
            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% <span>OFF</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/300x220/f4f6f9/a0a0a0?text=No+Image' }}
        />
      </div>
      <div className="brand-tag">{product.brand}</div>
      <div className="item-name">{displayName}</div>
      <div className="item-volume">{volText || '\u00A0'}</div>
      <div className="price-section">
        <div className="price-row">
          <span className="item-price">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && <span className="item-mrp">₹{product.mrp}</span>}
        </div>
      </div>
      <div className="btn-container">
        {cartItem ? (
          <div className="app-qty-control">
            <button onClick={() => changeQty(product.name, -1)}>−</button>
            <span>{cartItem.qty}</span>
            <button onClick={() => changeQty(product.name, 1)}>+</button>
          </div>
        ) : (
          <div className="app-add-btn" onClick={() => addToCart(product)}>+</div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
