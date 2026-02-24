import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import type { MenuItem } from '../types';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addItem } = useCart();

  return (
    <motion.div
      className="menu-card"
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="menu-card-img-wrapper">
        <img
          src={item.image || PLACEHOLDER}
          alt={item.name}
          className="menu-card-img"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <span className={`veg-badge ${item.type === 'Veg' ? 'veg' : 'non-veg'}`}>
          <span className="veg-dot" />
        </span>
      </div>
      <div className="menu-card-body">
        <div className="menu-card-header">
          <h3 className="menu-card-name">{item.name}</h3>
          <span className="menu-card-price">₹{item.price}</span>
        </div>
        <p className="menu-card-desc">{item.description}</p>
        <div className="menu-card-footer">
          <span className="menu-card-category">{item.category}</span>
          {item.available ? (
            <button className="btn-primary btn-sm" onClick={() => addItem(item)}>
              Add to Cart
            </button>
          ) : (
            <span className="unavailable-badge">Unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
