import { useState } from 'react';

/**
 * Site Content Editor
 * Since SITE data lives in seed/data.js (static), this page shows
 * the current values and generates the updated data.js code to copy-paste,
 * OR when DB is connected, these could be stored in a SiteConfig collection.
 * For now: edit hero text, announcement, and editorial image URLs live.
 */

const DEFAULT = {
  announcement: '🇳🇵 Handcrafted in Nepal — FREE Delivery on orders over $100',
  heroHeadline: 'Himalayan Craftsmanship',
  heroCta: 'SHOP COLLECTION',
  heroImage1: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  heroImage2: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e0e?w=1920&q=80',
  editorial1: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=1200&q=80',
  editorial2: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
  editorial3: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80',
  editorial4: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
};

export default function SiteContent() {
  const [form, setForm] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);

  function set(key, val) { setForm((p) => ({ ...p, [key]: val })); }

  async function uploadFile(key, file) {
    setUploadingKey(key);
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
      set(key, data.url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingKey(null);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    // Save to localStorage so it persists in browser
    localStorage.setItem('bhotika_site_content', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ padding: 32, maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1a1a18' }}>Site Content</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
        Edit your homepage text and photos. Changes save to your browser. To make permanent, update <code>server/seed/data.js</code>.
      </p>

      {saved && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '10px 16px', fontSize: 13, color: '#2e7d32', marginBottom: 20 }}>
          ✅ Saved to browser! Copy the generated code below to make it permanent.
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* Announcement */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📢 Announcement Bar</h2>
          <label style={styles.label}>
            Message
            <input style={styles.input} value={form.announcement} onChange={(e) => set('announcement', e.target.value)} />
          </label>
        </section>

        {/* Hero */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏔️ Hero Section</h2>
          <div style={styles.row}>
            <label style={styles.label}>
              Headline
              <input style={styles.input} value={form.heroHeadline} onChange={(e) => set('heroHeadline', e.target.value)} />
            </label>
            <label style={styles.label}>
              Button Text
              <input style={styles.input} value={form.heroCta} onChange={(e) => set('heroCta', e.target.value)} />
            </label>
          </div>
          <div style={styles.row}>
            <ImageField label="Hero Image 1" fieldKey="heroImage1" form={form} set={set} uploadFile={uploadFile} uploadingKey={uploadingKey} />
            <ImageField label="Hero Image 2" fieldKey="heroImage2" form={form} set={set} uploadFile={uploadFile} uploadingKey={uploadingKey} />
          </div>
        </section>

        {/* Editorial */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🖼️ Editorial Photos</h2>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>These appear in the split editorial sections on the homepage.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[1, 2, 3, 4].map((n) => (
              <ImageField key={n} label={`Editorial ${n}`} fieldKey={`editorial${n}`} form={form} set={set} uploadFile={uploadFile} uploadingKey={uploadingKey} />
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={styles.submitBtn}>💾 Save Changes</button>
        </div>
      </form>

      {/* Generated code preview */}
      <section style={{ ...styles.section, marginTop: 32, background: '#1a1a18' }}>
        <h2 style={{ ...styles.sectionTitle, color: '#c8aa87', borderColor: '#333' }}>📋 Generated Code (copy to data.js to make permanent)</h2>
        <pre style={{ fontSize: 11, color: '#e8d5b7', overflow: 'auto', lineHeight: 1.6 }}>
{`// In server/seed/data.js — replace IMG and SITE:

const IMG = {
  hero:       '${form.heroImage1}',
  hero2:      '${form.heroImage2}',
  editorial1: '${form.editorial1}',
  editorial2: '${form.editorial2}',
  editorial3: '${form.editorial3}',
  editorial4: '${form.editorial4}',
};

export const SITE = {
  announcement: '${form.announcement}',
  hero: {
    headline: '${form.heroHeadline}',
    cta: '${form.heroCta}',
    ctaLink: '/shop',
    images: [IMG.hero, IMG.hero2],
  },
  editorial: [
    { image: IMG.editorial1, alt: 'Editorial 1' },
    { image: IMG.editorial2, alt: 'Editorial 2' },
    { image: IMG.editorial3, alt: 'Editorial 3' },
    { image: IMG.editorial4, alt: 'Editorial 4' },
  ],
};`}
        </pre>
      </section>
    </div>
  );
}

function ImageField({ label, fieldKey, form, set, uploadFile, uploadingKey }) {
  return (
    <label style={{ ...styles.label, flex: 1 }}>
      {label}
      {form[fieldKey] && (
        <img src={form[fieldKey]} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4, marginBottom: 6, border: '1px solid #ede9e0' }} />
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...styles.input, flex: 1, margin: 0, fontSize: 11 }}
          value={form[fieldKey]}
          onChange={(e) => set(fieldKey, e.target.value)}
          placeholder="https://… or upload"
        />
        <label style={styles.uploadBtn} title="Upload from computer">
          {uploadingKey === fieldKey ? '…' : '📁'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && uploadFile(fieldKey, e.target.files[0])} />
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
  submitBtn: { background: '#1a1a18', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};
