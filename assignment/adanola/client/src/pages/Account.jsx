import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Account() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { count } = useCart();

  if (loading) {
    return <div className="empty-state">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/account' }} />;
  }

  return (
    <div className="auth-card">
      <h1 className="page-title">Account</h1>
      <p style={{ fontSize: 14, marginBottom: 8 }}>{user.name}</p>
      <p style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)', marginBottom: 24 }}>
        {user.email}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link to="/wishlist" className="btn-ghost" style={{ textAlign: 'center' }}>
          Wishlist
        </Link>
        <Link to="/cart" className="btn-ghost" style={{ textAlign: 'center' }}>
          Bag ({count})
        </Link>
        <button type="button" className="btn-fill btn-fill--block" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
