import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../context/AuthContext';
import { productsApi, wishlistApi, productId } from '../lib/api';

export default function Wishlist() {
  const { isAuthenticated, localWishlist } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const res = await wishlistApi.list();
          if (!cancelled) setProducts(res.wishlist || []);
        } else if (localWishlist.length) {
          const res = await productsApi.list();
          const all = res.products || [];
          const filtered = all.filter((p) => localWishlist.includes(String(productId(p))));
          if (!cancelled) setProducts(filtered);
        } else if (!cancelled) {
          setProducts([]);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, localWishlist]);

  return (
    <div className="section container">
      <h1 className="page-title">Wishlist</h1>
      {!loading && products.length === 0 ? (
        <div className="empty-state">
          <p>No saved pieces yet.</p>
          <Link to="/shop" className="btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>
            Browse shop
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} loading={loading} showTitle={false} />
      )}
    </div>
  );
}
