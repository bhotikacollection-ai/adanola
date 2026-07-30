import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, source: '' });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api('/products?limit=200').catch(() => ({ products: [] })),
      fetch('/api/health').then((r) => r.json()).catch(() => null),
    ]).then(([prod, h]) => {
      setStats({ products: prod.products?.length || 0, source: prod.source || '' });
      setHealth(h);
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Total Products', value: loading ? '…' : stats.products, to: '/admin/products', color: '#c8aa87' },
    { label: 'Database', value: health?.mongo ? '✅ Connected' : '⚠️ Offline', to: null, color: health?.mongo ? '#5c8a6a' : '#8a5c5c' },
    { label: 'Cloudinary', value: health?.cloudinary ? '✅ Ready' : '⚠️ Not set', to: null, color: health?.cloudinary ? '#5c8a6a' : '#8a5c5c' },
    { label: 'Site Content', value: 'Edit →', to: '/admin/site', color: '#6a7c8a' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>
        Welcome to the Bhotika admin panel. Manage products, photos, and site content.
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {cards.map((c) => {
          const inner = (
            <div style={{
              background: '#fff',
              borderRadius: 8,
              padding: '20px 24px',
              borderLeft: `4px solid ${c.color}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{c.value}</div>
            </div>
          );
          return c.to
            ? <Link key={c.label} to={c.to} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
            : <div key={c.label}>{inner}</div>;
        })}
      </div>

      {/* Quick links */}
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', maxWidth: 480 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/admin/products/new" style={btnStyle('#1a1a18', '#fff')}>➕ Add New Product</Link>
          <Link to="/admin/products" style={btnStyle('#c8aa87', '#1a1a18')}>👕 Manage Products</Link>
          <Link to="/admin/site" style={btnStyle('#e8d5b7', '#1a1a18')}>🖼️ Edit Site Content</Link>
          <Link to="/" target="_blank" style={btnStyle('#f0ebe0', '#1a1a18')}>🌐 View Live Site ↗</Link>
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    display: 'block',
    padding: '10px 16px',
    background: bg,
    color,
    borderRadius: 6,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
  };
}
