import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { items, subtotal, discount, total, couponCode, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, menuItem: i._id })),
        subtotal,
        discount,
        total,
        couponCode,
        paymentMethod,
        deliveryAddress: address,
      };
      const { data } = await api.post('/api/orders', payload);
      clearCart();
      navigate(`/payment-success/${data._id}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Checkout</h1>
      </section>
      <section className="section">
        <div className="container checkout-layout">
          <div className="checkout-form">
            <h2>Delivery Address</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input name="street" value={address.street} onChange={handleChange} placeholder="123, MG Road" className="form-input" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input name="city" value={address.city} onChange={handleChange} placeholder="Bangalore" className="form-input" />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="560001" className="form-input" />
              </div>
            </div>

            <h2 style={{ marginTop: '2rem' }}>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                💵 Cash on Delivery
              </label>
              <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                📱 UPI
              </label>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="upi-info">
                <p>UPI ID: <strong>cafe@upi</strong></p>
                <div className="upi-qr">
                  <div className="qr-placeholder">
                    <span>QR Code</span>
                    <small>Scan with any UPI app</small>
                  </div>
                </div>
                <p className="upi-note">⚠️ This is a demo. No real payment will be processed.</p>
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {items.map((item) => (
              <div key={item._id} className="checkout-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
              <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
            <button className="btn-primary btn-full" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
