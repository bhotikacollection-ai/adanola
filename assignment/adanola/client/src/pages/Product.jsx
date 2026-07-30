import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsApi, formatPrice, productId, wishlistApi } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/ProductGrid';
import { IconHeart } from '../components/Icons';

export default function Product() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlistLocal, isAuthenticated, user, setUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIndex, setImgIndex] = useState(0);
  const [size, setSize] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setImgIndex(0);
    setAdded(false);

    productsApi
      .one(slug)
      .then((res) => {
        if (cancelled) return;
        setProduct(res.product);
        setRelated(res.related || []);
        setSize(res.product.sizes?.[0] || '');
        setColorIdx(0);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Product not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pdp" aria-busy="true">
        <div className="pdp__main-img skeleton" />
        <div>
          <div className="skeleton" style={{ height: 24, width: '70%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: '30%' }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="empty-state">
        <p>{error || 'Product not found'}</p>
        <Link to="/shop" className="btn-ghost" style={{ marginTop: 16 }}>
          Back to shop
        </Link>
      </div>
    );
  }

  const id = productId(product);
  const wished = isWishlisted(id);
  const images = product.images?.length ? product.images : [];

  function onAdd() {
    addItem(product, {
      size,
      color: product.colors?.[colorIdx]?.name || '',
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  async function onWish() {
    if (!isAuthenticated) {
      toggleWishlistLocal(id);
      return;
    }
    try {
      const data = wished ? await wishlistApi.remove(id) : await wishlistApi.add(id);
      if (user) setUser({ ...user, wishlist: data.wishlist.map((p) => p._id || p) });
    } catch {
      toggleWishlistLocal(id);
    }
  }

  return (
    <>
      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__main-img">
            {images[imgIndex] && (
              <img src={images[imgIndex]} alt={product.name} />
            )}
          </div>
          {images.length > 1 && (
            <div className="pdp__thumbs">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={i === imgIndex ? 'is-active' : ''}
                  onClick={() => setImgIndex(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          <h1>{product.name}</h1>
          <p className="pdp__price">{formatPrice(product.price, product.currency)}</p>
          <p className="pdp__desc">{product.description}</p>

          {product.colors?.length > 0 && (
            <>
              <p className="pdp__label">
                Colour — {product.colors[colorIdx]?.name}
              </p>
              <div className="product-card__swatches" style={{ marginBottom: 24, gap: 8 }}>
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`swatch ${i === colorIdx ? 'is-active' : ''}`}
                    style={{ background: c.hex, width: 16, height: 16 }}
                    aria-label={c.name}
                    onClick={() => setColorIdx(i)}
                  />
                ))}
              </div>
            </>
          )}

          {product.sizes?.length > 0 && (
            <>
              <p className="pdp__label">Size</p>
              <div className="pdp__sizes">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={size === s ? 'is-active' : ''}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="pdp__actions">
            <button type="button" className="btn-fill" style={{ padding: '12px 28px' }} onClick={onAdd}>
              {added ? 'Added to bag' : 'Add to bag'}
            </button>
            <button type="button" className="btn-ghost" onClick={onWish} aria-label="Wishlist">
              <IconHeart filled={wished} />
              {wished ? ' Saved' : ' Save'}
            </button>
          </div>

          <p style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)' }}>
            FREE Standard Delivery on orders over €125
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <ProductGrid title="You may also like" products={related} />
      )}
    </>
  );
}
