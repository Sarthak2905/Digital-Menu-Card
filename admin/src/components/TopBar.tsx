import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { admin } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar-title">Durga's Café Admin Panel</div>
      <div className="topbar-user">
        <span className="topbar-avatar">{admin?.name?.charAt(0).toUpperCase() ?? 'A'}</span>
        <span className="topbar-name">{admin?.name ?? 'Admin'}</span>
      </div>
    </header>
  );
}
