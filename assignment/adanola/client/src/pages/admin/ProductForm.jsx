import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

const CATEGORIES = ['shirts', 'dresses', 'jackets', 'bags', 'jewelry', 'handmade', 'hemp', 'new', 'shop'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const empty = {
  name: '', slug: '', description: '', price: '', category: 'shirts',
  tags: '', sizes: [], images: [''], featured: false, trending: false,
  newArrival: false, inStock: true, stock: 50, currency: 'USD',
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    api(`/products/${id}`)
      .then(({ product }) => {
        setForm({
          ...product,
          tags: (product.tags || []).join(', '),
          images: product.images?.length ? product.images : [''],
        });
      })
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function autoSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function handleName(e) {
    const name = e.target.value;
    setForm((prev) => ({ ...prev, name, slug: isEdit ? prev.slug : autoSlug(name) }));
  }

  function toggleSize(s) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter((x) => x !== s) : [...prev.sizes, s],
    }));
  }

  function setImage(idx, val) {
    setForm((prev) => {
      const imgs = [...prev.images];
      imgs[idx] = val;
      return { ...prev, images: imgs };
    });
  }

  function addImageField() {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  }

  function removeImage(idx) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function uploadFile(idx, file) {
    setUploadingIdx(idx);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('bhotika_token') || localStorage.getItem('adanola_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setImage(idx, data.url);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploadingIdx(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images.filter(Boolean),
      };
      if (isEdit) {
        await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(body) });
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 32, color: '#888' }}>Loading…</div>;

  return (
    <div style={{ padding: 32, maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1a1a18' }}>
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>
        {isEdit ? `Editing: ${form.name}` : 'Fill in the details below to add a new product.'}
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Info</h2>
          <div style={styles.row}>
            <label style={styles.label}>
              Product Name *
              <input style={styles.input} value={form.name} onChange={handleName} required placeholder="Hemp Linen Shirt" />
            </label>
            <label style={styles.label}>
              Slug *
              <input style={styles.input} value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="hemp-linen-shirt" />
            </label>
          </div>
          <label style={styles.label}>
            Description
            <textarea
              style={{ ...styles.input, height: 100, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe this product…"
            />
          </label>
          <div style={styles.row}>
            <label style={styles.label}>
              Price (USD) *
              <input style={styles.input} type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required />
            </label>
            <label style={styles.label}>
              Category *
              <select style={styles.input} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label style={styles.label}>
              Stock
              <input style={styles.input} type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
            </label>
          </div>
          <label style={styles.label}>
            Tags (comma separated)
            <input style={styles.input} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="hemp, handmade, new" />
          </label>
        </section>

        {/* Images */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Photos</h2>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
            Upload images or paste a URL. First image is the main photo.
          </p>
          {form.images.map((img, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              {img && (
                <img src={img} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 4, border: '1px solid #ede9e0', flexShrink: 0 }} />
              )}
              <input
                style={{ ...styles.input, flex: 1, margin: 0 }}
                value={img}
                onChange={(e) => setImage(idx, e.target.value)}
                placeholder="https://… or upload below"
              />
              <label style={styles.uploadBtn}>
                {uploadingIdx === idx ? '…' : '📁'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && uploadFile(idx, e.target.files[0])} />
              </label>
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(idx)} style={styles.removeBtn}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField} style={styles.ghostBtn}>+ Add another photo</button>
        </section>

        {/* Sizes */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Sizes</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SIZES.map((s) => (
              <button
                key={s} type="button" onClick={() => toggleSize(s)}
                style={{
                  padding: '6px 14px', border: '1px solid', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  background: form.sizes.includes(s) ? '#1a1a18' : '#fff',
                  color: form.sizes.includes(s) ? '#fff' : '#1a1a18',
                  borderColor: form.sizes.includes(s) ? '#1a1a18' : '#ede9e0',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Flags */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Visibility</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['featured', 'Featured'], ['trending', 'Trending'], ['newArrival', 'New Arrival'], ['inStock', 'In Stock']].map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={!!form[key]} onChange={(e) => set(key, e.target.checked)} style={{ width: 16, height: 16, accentColor: '#c8aa87' }} />
                {label}
              </label>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? 'Saving…' : isEdit ? '💾 Save Changes' : '✅ Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  section: { background: '#fff', borderRadius: 8, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1a1a18', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f0ebe0', paddingBottom: 10 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 600, color: '#555', flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '9px 12px', border: '1px solid #e8d5b7', borderRadius: 6, fontSize: 13, color: '#1a1a18', background: '#faf8f4', outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 2 },
  row: { display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  error: { background: '#fce8e8', border: '1px solid #e8c5c5', borderRadius: 6, padding: '10px 16px', fontSize: 13, color: '#8a2a2a', marginBottom: 20 },
  uploadBtn: { background: '#f0ebe0', border: '1px solid #e8d5b7', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', fontSize: 16, flexShrink: 0 },
  removeBtn: { background: '#fce8e8', border: 'none', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', color: '#8a2a2a', flexShrink: 0 },
  ghostBtn: { background: 'none', border: '1px dashed #c8aa87', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 12, color: '#888', marginTop: 4 },
  submitBtn: { background: '#1a1a18', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { background: '#f0ebe0', color: '#555', border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, cursor: 'pointer' },
};
