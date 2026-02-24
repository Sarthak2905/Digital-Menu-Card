import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

type OrderType = 'Dine-In' | 'Delivery';

const Checkout: React.FC = () => {
  const { items, subtotal, discount, total, couponCode, clearCart } = useCart();
  const navigate = useNavigate();

  // Read table number stored when QR code was scanned
  const storedTable = localStorage.getItem('cafe_table') || '';
  const [orderType, setOrderType] = useState<OrderType>(storedTable ? 'Dine-In' : 'Delivery');
  const [tableNumber, setTableNumber] = useState(storedTable);
  const [address, setAddress] = useState({ street: '', city: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'Delivery') {
      if (!address.street || !address.city || !address.pincode) {
        toast.error('Please fill in all delivery address fields');
        return;
      }
    } else {
      const tableNum = Number(tableNumber);
      if (!tableNumber || isNaN(tableNum) || tableNum < 1) {
        toast.error('Please enter a valid table number');
        return;
      }
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
        orderType,
        tableNumber: orderType === 'Dine-In' ? Number(tableNumber) : undefined,
        deliveryAddress: orderType === 'Delivery' ? address : { street: '', city: '', pincode: '' },
      };
      const { data } = await api.post('/api/orders', payload);
      clearCart();
      if (orderType === 'Dine-In') localStorage.removeItem('cafe_table');
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

            {/* Order Type Toggle */}
            <h2>How would you like your order?</h2>
            <div className="order-type-toggle">
              <button
                type="button"
                className={`order-type-btn ${orderType === 'Dine-In' ? 'selected' : ''}`}
                onClick={() => setOrderType('Dine-In')}
              >
                🪑 Dine-In
              </button>
              <button
                type="button"
                className={`order-type-btn ${orderType === 'Delivery' ? 'selected' : ''}`}
                onClick={() => setOrderType('Delivery')}
              >
                🚚 Delivery
              </button>
            </div>

            {/* Dine-In: Table number */}
            {orderType === 'Dine-In' && (
              <div className="dine-in-section">
                <div className="form-group">
                  <label>Table Number</label>
                  <input
                    type="number"
                    min="1"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. 5"
                    className="form-input table-number-input"
                  />
                </div>
                <p className="dine-in-note">🪑 Your order will be brought directly to your table.</p>
              </div>
            )}

            {/* Delivery: Address */}
            {orderType === 'Delivery' && (
              <>
                <h2 style={{ marginTop: '1.5rem' }}>Delivery Address</h2>
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
              </>
            )}

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
            {orderType === 'Dine-In' && tableNumber && (
              <p className="checkout-table-note">🪑 Dine-In — Table <strong>{tableNumber}</strong></p>
            )}
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
