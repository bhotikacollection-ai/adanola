import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import CategoryTabs from '../components/CategoryTabs';
import { productsApi } from '../lib/api';

const FILTERS = ['HOODIES', 'SHORTS', 'T-SHIRTS', 'LEGGINGS', 'SETS'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'shop';
  const q = params.get('q') || '';
  const tag = params.get('tag') || '';
  const trending = params.get('trending');
  const newArrival = params.get('newArrival');
  const sort = params.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const query = { sort };
    if (category && category !== 'shop') query.category = category;
    if (tag) query.tag = tag;
    if (q) query.q = q;
    if (trending) query.trending = 'true';
    if (newArrival) query.newArrival = 'true';

    productsApi
      .list(query)
      .then((res) => {
        if (!cancelled) setProducts(res.products || []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, q, tag, trending, newArrival, sort]);

  function onTab(value) {
    const next = new URLSearchParams(params);
    next.set('tag', value);
    next.delete('category');
    setParams(next);
  }

  const title = q
    ? `Search: “${q}”`
    : category !== 'shop'
      ? category.replace(/-/g, ' ').toUpperCase()
      : tag
        ? tag.replace(/-/g, ' ').toUpperCase()
        : 'Shop';

  return (
    <div className="section container">
      <h1 className="page-title">{title}</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyItems: 'center', marginBottom: 8 }}>
        <CategoryTabs
          tabs={FILTERS}
          active={tag || ''}
          onChange={onTab}
        />
        <label style={{ marginLeft: 'auto', fontSize: 12 }}>
          Sort{' '}
          <select
            value={sort}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              next.set('sort', e.target.value);
              setParams(next);
            }}
            style={{
              border: 'none',
              borderBottom: '1px solid var(--color-smoke-charcoal)',
              background: 'transparent',
              fontSize: 12,
              padding: '4px 0',
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <ProductGrid products={products} loading={loading} showTitle={false} />
    </div>
  );
}
