import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal, discount, total, couponCode } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="drawer-header">
              <h2>Your Cart</h2>
              <button onClick={onClose} aria-label="Close cart"><FiX size={22} /></button>
            </div>

            {items.length === 0 ? (
              <div className="drawer-empty">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  {items.map((item) => (
                    <div key={item._id} className="drawer-item">
                      <div className="drawer-item-info">
                        <p className="drawer-item-name">{item.name}</p>
                        <p className="drawer-item-price">₹{item.price}</p>
                      </div>
                      <div className="drawer-item-controls">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus size={14} /></button>
                        <button className="remove-btn" onClick={() => removeItem(item._id)}><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="drawer-summary">
                  <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="summary-row discount"><span>Discount ({couponCode})</span><span>-₹{discount.toFixed(2)}</span></div>
                  )}
                  <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
                <button className="btn-primary btn-full" onClick={handleCheckout}>
                  View Cart & Checkout
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
