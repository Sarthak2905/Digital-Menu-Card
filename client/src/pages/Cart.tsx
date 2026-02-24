import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, subtotal, discount, total, couponCode, couponError, applyCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items from the menu to get started.</p>
          <Link to="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Your Cart</h1>
      </section>
      <section className="section">
        <div className="container cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item-row">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'; }}
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus /></button>
                </div>
                <p className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button className="remove-btn" onClick={() => removeItem(item._id)}><FiTrash2 /></button>
              </div>
            ))}
            <button className="btn-outline-danger" onClick={clearCart}>Clear Cart</button>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="coupon-row">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="coupon-input"
              />
              <button className="btn-secondary btn-sm" onClick={handleApplyCoupon}>Apply</button>
            </div>
            {couponCode && <p className="coupon-success">✅ Coupon "{couponCode}" applied!</p>}
            {couponError && <p className="coupon-error">{couponError}</p>}

            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
              <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
            <button className="btn-primary btn-full" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
