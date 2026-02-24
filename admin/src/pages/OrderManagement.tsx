import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Placed', 'Preparing', 'Out for delivery', 'Delivered'] as const;
type FilterStatus = typeof STATUSES[number];

const STATUS_COLORS: Record<string, string> = {
  Placed: 'badge-placed',
  Preparing: 'badge-preparing',
  'Out for delivery': 'badge-out',
  Delivered: 'badge-delivered',
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/admin/orders');
        setOrders(res.data);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await api.put(`/api/admin/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status ?? status } : o)));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="loading">Loading orders…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Order Management</h2>
        <div className="filter-tabs">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-tab${filter === s ? ' filter-tab--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Type</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <>
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.user?.name ?? 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    {order.orderType === 'Dine-In'
                      ? <span className="badge badge-dinein" aria-label={`Dine-in at table ${order.tableNumber ?? ''}`}>🪑 Table {order.tableNumber ?? '—'}</span>
                      : <span className="badge badge-delivery" aria-label="Delivery order">🚚 Delivery</span>}
                  </td>
                  <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td><span className="badge badge-payment">{order.paymentMethod}</span></td>
                  <td>
                    <select
                      className={`status-select ${STATUS_COLORS[order.status] ?? ''}`}
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUSES.slice(1).map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-expand"
                      onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    >
                      {expanded === order._id ? '▲' : '▼'}
                    </button>
                  </td>
                </tr>
                {expanded === order._id && (
                  <tr key={`${order._id}-detail`} className="expanded-row">
                    <td colSpan={9}>
                      <div className="order-detail">
                        <div className="order-detail-section">
                          <strong>Items:</strong>
                          <ul>
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item.name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="order-detail-section">
                          {order.orderType === 'Dine-In' ? (
                            <><strong>Order Type:</strong> <span>🪑 Dine-In — Table {order.tableNumber}</span></>
                          ) : (
                            <><strong>Delivery Address:</strong>
                            <p>{order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</p></>
                          )}
                        </div>
                        <div className="order-detail-section">
                          <strong>Subtotal:</strong> ₹{order.subtotal?.toFixed(2)} |{' '}
                          <strong>Discount:</strong> ₹{order.discount?.toFixed(2)} |{' '}
                          <strong>Total:</strong> ₹{order.total?.toFixed(2)}
                          {order.couponCode && <> | <strong>Coupon:</strong> {order.couponCode}</>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="empty-row">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
