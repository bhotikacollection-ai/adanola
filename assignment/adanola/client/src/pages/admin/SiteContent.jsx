import { useEffect, useState } from 'react';
import { siteConfigApi } from '../../lib/api';

const DEFAULT = {
  announcement: '🇳🇵 Handcrafted in Nepal — FREE Delivery on orders over $100',
  heroHeadline: 'Himalayan Craftsmanship',
  heroCta: 'SHOP COLLECTION',
  heroImages: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4e0e?w=1920&q=80',
  ],
  editorialImages: [
    'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=1200&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
  ],
};

export default function SiteContent() {
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    siteConfigApi.get()
      .then((data) => {
        if (data) {
          setForm({
            announcement: data.announcement || DEFAULT.announcement,
            heroHeadline: data.heroHeadline || DEFAULT.heroHeadline,
            heroCta: data.heroCta || DEFAULT.heroCta,
            heroImages: data.heroImages?.length ? data.heroImages : DEFAULT.heroImages,
            editorialImages: data.editorialImages?.length ? data.editorialImages : DEFAULT.editorialImages,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set(key, val) { setForm((p) => ({ ...p, [key]: val })); }

  function setImg(arrayKey, idx, val) {
    setForm((p) => {
      const arr = [...(p[arrayKey] || [])];
      arr[idx] = val;
      return { ...p, [arrayKey]: arr };
    });
  }

  async function uploadFile(arrayKey, idx, file) {
    const key = `${arrayKey}_${idx}`;
    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('adanola_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setImg(arrayKey, idx, data.url);
    } catch (err) {
      setMsg('Upload failed: ' + err.message);
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await siteConfigApi.update(form);
      setMsg('✅ Saved! Changes are live on the website.');
    } catch (err) {
      setMsg('❌ ' + (err.message || 'Save failed. Make sure DB is connected.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 32, color: '#888' }}>Loading current content…</div>;

  return (
    <div style={{ padding: 32, maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1a1a18' }}>Site Content</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        Changes save to the database and go live on the website immediately.
      </p>

      {msg && (
        <div style={{
          padding: '10px 16px', borderRadius: 6, marginBottom: 20, fontSize: 13,
          background: msg.startsWith('✅') ? '#e8f5e9' : '#fce8e8',
          color: msg.startsWith('✅') ? '#2e7d32' : '#8a2a2a',
          border: `1px solid ${msg.startsWith('✅') ? '#a5d6a7' : '#e8c5c5'}`,
        }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* Announcement */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📢 Announcement Bar</h2>
          <label style={styles.label}>
            Message (shown at top of every page)
            <input style={styles.input} value={form.announcement} onChange={(e) => set('announcement', e.target.value)} />
          </label>
        </section>

        {/* Hero Banner */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏔️ Banner / Hero Section</h2>
          <div style={styles.row}>
            <label style={styles.label}>
              Headline Text
              <input style={styles.input} value={form.heroHeadline} onChange={(e) => set('heroHeadline', e.target.value)} />
            </label>
            <label style={styles.label}>
              Button Text
              <input style={styles.input} value={form.heroCta} onChange={(e) => set('heroCta', e.target.value)} />
            </label>
          </div>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>Banner Photos (2 images that slide):</p>
          <div style={styles.row}>
            {[0, 1].map((idx) => (
              <ImageField
                key={idx}
                label={`Banner Photo ${idx + 1}`}
                value={form.heroImages[idx] || ''}
                onChange={(val) => setImg('heroImages', idx, val)}
                onUpload={(file) => uploadFile('heroImages', idx, file)}
                uploading={uploadingKey === `heroImages_${idx}`}
              />
            ))}
          </div>
        </section>

        {/* Editorial Photos */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🖼️ Editorial Photos</h2>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>4 photos shown in the split sections on the homepage.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[0, 1, 2, 3].map((idx) => (
              <ImageField
                key={idx}
                label={`Editorial Photo ${idx + 1}`}
                value={form.editorialImages[idx] || ''}
                onChange={(val) => setImg('editorialImages', idx, val)}
                onUpload={(file) => uploadFile('editorialImages', idx, file)}
                uploading={uploadingKey === `editorialImages_${idx}`}
              />
            ))}
          </div>
        </section>

        <button type="submit" disabled={saving} style={styles.submitBtn}>
          {saving ? 'Saving…' : '💾 Save & Publish'}
        </button>
      </form>
    </div>
  );
}

function ImageField({ label, value, onChange, onUpload, uploading }) {
  return (
    <label style={{ ...styles.label, flex: 1 }}>
      {label}
      {value && (
        <img src={value} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, marginBottom: 6, border: '1px solid #ede9e0' }} />
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...styles.input, flex: 1, margin: 0, fontSize: 11 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL or upload →"
        />
        <label style={styles.uploadBtn} title="Upload from computer">
          {uploading ? '⏳' : '📁'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
        </label>
      </div>
    </label>
  );
}

const styles = {
  section: { background: '#fff', borderRadius: 8, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginBottom: 16, color: '#1a1a18', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f0ebe0', paddingBottom: 10 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 600, color: '#555', flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '9px 12px', border: '1px solid #e8d5b7', borderRadius: 6, fontSize: 13, color: '#1a1a18', background: '#faf8f4', outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 2 },
  row: { display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  uploadBtn: { background: '#f0ebe0', border: '1px solid #e8d5b7', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', fontSize: 16, flexShrink: 0, display: 'flex', alignItems: 'center' },
  submitBtn: { background: '#1a1a18', color: '#fff', border: 'none', borderRadius: 6, padding: '14px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};
