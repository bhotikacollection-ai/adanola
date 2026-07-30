import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useReveal } from '../hooks/useReveal';

export default function ProductGrid({
  title,
  products = [],
  loading = false,
  showTitle = true,
  linkTo,
}) {
  const ref = useReveal();

  return (
    <section className="section container reveal" ref={ref}>
      {(showTitle && title) && (
        <div className="product-section__head">
          <h2 className="product-section__title">{title}</h2>
          {linkTo && (
            <Link to={linkTo} className="btn-ghost" style={{ padding: '4px 12px' }}>
              View all
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="product-grid" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card">
              <div className="product-card__media skeleton" />
              <div className="skeleton" style={{ height: 12, width: '60%', marginTop: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '30%', marginTop: 4 }} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="empty-state">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id || p.id || p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
