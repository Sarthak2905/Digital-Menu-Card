import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Order, MenuItem, AnalyticsData } from '../types';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  link?: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, menuRes, analyticsRes] = await Promise.all([
          api.get('/api/admin/orders'),
          api.get('/api/menu'),
          api.get('/api/admin/analytics'),
        ]);
        setOrders(ordersRes.data);
        setMenuItems(menuRes.data);
        setAnalytics(analyticsRes.data.dailyRevenue ?? analyticsRes.data);
      } catch {
        // handle silently – data will just be empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt?.startsWith(today)).length;
  const analyticsRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
  const displayRevenue = totalRevenue > 0 ? totalRevenue : analyticsRevenue;

  const stats: StatCard[] = [
    { label: 'Total Revenue', value: `₹${displayRevenue.toFixed(2)}`, icon: '💰', link: '/admin/analytics' },
    { label: 'Total Orders', value: String(orders.length), icon: '🛒', link: '/admin/orders' },
    { label: "Today's Orders", value: String(todayOrders), icon: '📋', link: '/admin/orders' },
    { label: 'Menu Items', value: String(menuItems.length), icon: '🍽️', link: '/admin/menu' },
  ];

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-body">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
            {s.link && (
              <Link to={s.link} className="stat-link">
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="quick-links">
        <h3>Quick Actions</h3>
        <div className="quick-links-grid">
          <Link to="/admin/menu" className="quick-link-card">
            <span>🍽️</span>
            <span>Manage Menu</span>
          </Link>
          <Link to="/admin/orders" className="quick-link-card">
            <span>📦</span>
            <span>View Orders</span>
          </Link>
          <Link to="/admin/analytics" className="quick-link-card">
            <span>📊</span>
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
