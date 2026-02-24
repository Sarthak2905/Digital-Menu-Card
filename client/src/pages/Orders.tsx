import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS: Record<string, string> = {
  Placed: '#f59e0b',
  Preparing: '#3b82f6',
  'Out for delivery': '#8b5cf6',
  Delivered: '#10b981',
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/api/orders/my')
      .then(({ data }) => setOrders(Array.isArray(data) ? data : data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <section className="page-hero">
        <h1>My Orders</h1>
        <p>Your order history</p>
      </section>
      <section className="section">
        <div className="container">
          {orders.length === 0 ? (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
              <Link to="/menu" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Menu</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  className="order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="order-card-header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <div>
                      <p className="order-id">#{order._id}</p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="order-card-right">
                      <span className="status-badge" style={{ background: STATUS_COLORS[order.status] || '#6b7280' }}>
                        {order.status}
                      </span>
                      <span className="order-total">₹{order.total.toFixed(2)}</span>
                      <span className="expand-arrow">{expanded === order._id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded === order._id && (
                      <motion.div
                        className="order-card-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {order.items.map((item, i) => (
                          <div key={i} className="order-detail-item">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <p className="order-meta">Payment: {order.paymentMethod}</p>
                        {order.orderType === 'Dine-In' ? (
                          <p className="order-meta">🪑 Dine-In — Table <strong>{order.tableNumber}</strong></p>
                        ) : (
                          <p className="order-meta">🚚 Delivery</p>
                        )}
                        {order.status !== 'Delivered' && (
                          <Link to={`/track/${order._id}`} className="btn-secondary btn-sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                            Track Order
                          </Link>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;
