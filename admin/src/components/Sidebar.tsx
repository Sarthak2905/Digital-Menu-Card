import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdRestaurantMenu, MdShoppingCart, MdBarChart, MdLogout, MdQrCode2 } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/admin/menu', label: 'Menu Management', icon: MdRestaurantMenu },
  { to: '/admin/orders', label: 'Orders', icon: MdShoppingCart },
  { to: '/admin/analytics', label: 'Analytics', icon: MdBarChart },
  { to: '/admin/tables', label: 'Table QR Codes', icon: MdQrCode2 },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo">☕ {!collapsed && "Durga's Café Admin"}</span>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
          >
            <Icon className="sidebar-icon" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <MdLogout className="sidebar-icon" />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
