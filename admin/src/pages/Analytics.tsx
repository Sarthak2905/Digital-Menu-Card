import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import api from '../api/axios';
import type { AnalyticsData } from '../types';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = (title: string) => ({
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: title },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true },
  },
});

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        setData(res.data.dailyRevenue ?? res.data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  );

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data.map((d) => d.revenue),
        backgroundColor: 'rgba(26, 60, 52, 0.7)',
        borderColor: '#1a3c34',
        borderWidth: 1,
      },
    ],
  };

  const orderCountChartData = {
    labels,
    datasets: [
      {
        label: 'Orders',
        data: data.map((d) => d.orderCount),
        borderColor: '#d4a96a',
        backgroundColor: 'rgba(212, 169, 106, 0.15)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#d4a96a',
      },
    ],
  };

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orderCount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) return <div className="loading">Loading analytics…</div>;

  return (
    <div className="page">
      <h2 className="page-title">Analytics (Last 30 Days)</h2>

      <div className="stats-grid stats-grid--small">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-body">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-body">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-body">
            <p className="stat-label">Avg Order Value</p>
            <p className="stat-value">₹{avgOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <Bar data={revenueChartData} options={chartOptions('Daily Revenue (₹)')} />
        </div>
        <div className="chart-card">
          <Line data={orderCountChartData} options={chartOptions('Daily Order Count')} />
        </div>
      </div>
    </div>
  );
}
