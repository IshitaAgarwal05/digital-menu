import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

// Detect flavor from product name -> { emoji, color, label, tint }
const getFlavorProfile = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('chocolate') || n.includes('choco')) return { emoji: '🍫', color: '#7b4f2e', label: 'Chocolate', tint: 'rgba(123,79,46,0.06)' };
  if (n.includes('mango')) return { emoji: '🥭', color: '#e68a00', label: 'Mango', tint: 'rgba(230,138,0,0.06)' };
  if (n.includes('strawberry') || n.includes('strawbery')) return { emoji: '🍓', color: '#e0395a', label: 'Strawberry', tint: 'rgba(224,57,90,0.06)' };
  if (n.includes('vanilla')) return { emoji: '🍦', color: '#d4a017', label: 'Vanilla', tint: 'rgba(212,160,23,0.06)' };
  if (n.includes('mint') || n.includes('pista') || n.includes('pistachio')) return { emoji: '🌿', color: '#2da575', label: 'Mint', tint: 'rgba(45,165,117,0.06)' };
  if (n.includes('butterscotch')) return { emoji: '🧈', color: '#c8860a', label: 'Butterscotch', tint: 'rgba(200,134,10,0.06)' };
  if (n.includes('kesar') || n.includes('saffron')) return { emoji: '🌸', color: '#e8800a', label: 'Kesar', tint: 'rgba(232,128,10,0.06)' };
  if (n.includes('kulfi')) return { emoji: '🍧', color: '#f59e0b', label: 'Kulfi', tint: 'rgba(245,158,11,0.06)' };
  if (n.includes('rabri') || n.includes('rasmalai')) return { emoji: '🥛', color: '#c084fc', label: 'Classic', tint: 'rgba(192,132,252,0.06)' };
  return null;
};

const ProductCard = ({ product, onClick }) => {
  const { cart, addToCart, changeQty } = useContext(CartContext);
  const cartItem = cart[product.name];

  const extractVolumeText = (name) => {
    const match = name.match(/(\d+\s*(ml|l|ltr|gm|g|kg))/i);
    return match ? match[0] : '';
  };

  const volText = extractVolumeText(product.name);
  const displayName = product.name.replace(volText, '').trim() || product.name;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    }
  };

  const launchDate = product.launchingyear ? new Date(product.launchingyear) : null;
  const isNewArrival = launchDate && (new Date() - launchDate) < (90 * 24 * 60 * 60 * 1000);

  const flavor = getFlavorProfile(product.name);

  return (
    <motion.div
      className={`menu-card ${product.bestseller ? 'bestseller-card' : ''} ${isNewArrival ? 'new-arrival-card' : ''} ${product.mrp && product.mrp > product.price ? 'discount-card' : ''}`}
      style={flavor ? { background: `linear-gradient(to bottom, ${flavor.tint}, var(--card-bg))` } : {}}
      variants={itemVariants}
      whileHover={{ y: -10, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-img-wrapper" onClick={onClick} style={{ cursor: 'zoom-in' }}>
        <div className="card-badge-container">
          {isNewArrival && <div className="badge-new">NEW</div>}
          {product.mrp && product.mrp > product.price && (
            <div className="discount-tag">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% <span>OFF</span>
            </div>
          )}
        </div>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/300x220/f4f6f9/a0a0a0?text=No+Image' }}
        />
      </div>
      <div className="brand-tag">{product.brand}</div>
      <div className="item-name">{displayName}</div>

      {/* Flavor pill chip */}
      {flavor && (
        <div className="flavor-chip" style={{ color: flavor.color, borderColor: `${flavor.color}44`, background: `${flavor.color}11` }}>
          {flavor.emoji} {flavor.label}
        </div>
      )}

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
