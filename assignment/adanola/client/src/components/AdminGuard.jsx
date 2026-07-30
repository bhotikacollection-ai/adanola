import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects /admin/* routes — redirects to /login if not authenticated,
 * redirects to / if authenticated but not admin role.
 */
export default function AdminGuard({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#888' }}>
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?next=/admin" replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Admin Access Only</h1>
        <p style={{ color: '#888', fontSize: 14 }}>Your account does not have admin privileges.</p>
        <a href="/" style={{ color: '#c8aa87', fontSize: 13 }}>← Back to store</a>
      </div>
    );
  }

  return children;
}
