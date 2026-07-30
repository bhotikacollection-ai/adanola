import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '👕 Products' },
  { to: '/admin/products/new', label: '➕ Add Product' },
  { to: '/admin/site', label: '🖼️ Site Content' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#1a1a18',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #333' }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>BHOTIKA</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 24px',
                color: isActive ? '#fff' : '#aaa',
                background: isActive ? '#333' : 'transparent',
                textDecoration: 'none',
                fontSize: 13,
                borderLeft: isActive ? '3px solid #c8aa87' : '3px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #333' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{user?.email}</div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #444',
              color: '#aaa',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
              width: '100%',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#f8f6f2', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
