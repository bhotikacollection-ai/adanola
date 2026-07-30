import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api('/products?limit=200');
      setProducts(res.products || []);
    } catch {
      setMsg('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api(`/products/${id}`, { method: 'DELETE' });
      setMsg(`"${name}" deleted.`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setMsg(err.message || 'Delete failed.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Products</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{products.length} total</p>
        </div>
        <Link to="/admin/products/new" style={{
          background: '#1a1a18', color: '#fff', padding: '10px 20px',
          borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 500,
        }}>
          + Add Product
        </Link>
      </div>

      {msg && (
        <div style={{ padding: '10px 16px', background: '#f0ebe0', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888', fontSize: 14 }}>Loading products…</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f6f2', borderBottom: '1px solid #ede9e0' }}>
                <th style={th}>Photo</th>
                <th style={th}>Name</th>
                <th style={th}>Category</th>
                <th style={th}>Price</th>
                <th style={th}>Stock</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #f0ebe0' }}>
                  <td style={td}>
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#ede9e0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👕</div>
                    )}
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>{p.slug}</div>
                  </td>
                  <td style={td}>
                    <span style={{ background: '#f0ebe0', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={td}>${p.price}</td>
                  <td style={td}>{p.stock ?? '—'}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        style={{ padding: '4px 12px', background: '#e8d5b7', borderRadius: 4, textDecoration: 'none', color: '#1a1a18', fontSize: 12 }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        disabled={deleting === p._id}
                        style={{ padding: '4px 12px', background: '#fce8e8', border: 'none', borderRadius: 4, color: '#8a2a2a', cursor: 'pointer', fontSize: 12 }}
                      >
                        {deleting === p._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
              No products yet. <Link to="/admin/products/new">Add one →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 };
const td = { padding: '12px 16px', verticalAlign: 'middle' };
