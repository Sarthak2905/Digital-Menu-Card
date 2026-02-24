import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const STEPS = ['Placed', 'Preparing', 'Out for delivery', 'Delivered'] as const;
const STEP_ICONS = ['📋', '👨‍🍳', '🛵', '✅'];

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(() => {
    if (!id) return;
    api.get(`/api/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const currentStep = order ? STEPS.indexOf(order.status) : 0;

  if (loading) return <LoadingSpinner />;

  if (!order) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Order not found</h2>
          <Link to="/orders" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Track Order</h1>
        <p>Order #{order._id}</p>
      </section>
      <section className="section">
        <div className="container tracking-container">
          <div className="tracking-steps">
            {STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              return (
                <div key={step} className={`tracking-step ${done ? 'done' : ''} ${idx === currentStep ? 'active' : ''}`}>
                  <motion.div
                    className="step-circle"
                    animate={done ? { backgroundColor: 'var(--primary)', scale: 1.1 } : { backgroundColor: '#e0e0e0', scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span>{STEP_ICONS[idx]}</span>
                  </motion.div>
                  <span className="step-label">{step}</span>
                  {idx < STEPS.length - 1 && (
                    <div className={`step-connector ${idx < currentStep ? 'done' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="order-detail-card">
            <h3>Order Details</h3>
            {order.items.map((item, i) => (
              <div key={i} className="order-detail-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
              <div className="summary-row total"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
            </div>
            <p className="order-meta">Payment: {order.paymentMethod} | {order.paymentStatus}</p>
            {order.orderType === 'Dine-In' ? (
              <p className="order-meta">🪑 Dine-In — Table <strong>{order.tableNumber}</strong></p>
            ) : (
              <p className="order-meta">
                Delivery to: {order.deliveryAddress.street}, {order.deliveryAddress.city} – {order.deliveryAddress.pincode}
              </p>
            )}
            <p className="order-refresh-note">🔄 Status refreshes every 10 seconds</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;
