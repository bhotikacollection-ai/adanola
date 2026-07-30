import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, productId, wishlistApi } from '../lib/api';
import { IconHeart } from './Icons';

export default function ProductCard({ product }) {
  const id = productId(product);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlistLocal, isAuthenticated, setUser, user } = useAuth();
  const [activeColor, setActiveColor] = useState(0);
  const [busy, setBusy] = useState(false);

  const wished = isWishlisted(id);
  const image =
    product.colors?.[activeColor]?.image ||
    product.images?.[0] ||
    '';

  async function onWish(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toggleWishlistLocal(id);
      return;
    }

    try {
      setBusy(true);
      const data = wished
        ? await wishlistApi.remove(id)
        : await wishlistApi.add(id);
      if (user) {
        setUser({ ...user, wishlist: data.wishlist.map((p) => p._id || p) });
      }
    } catch {
      toggleWishlistLocal(id);
    } finally {
      setBusy(false);
    }
  }

  function onQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, {
      color: product.colors?.[activeColor]?.name || '',
      size: product.sizes?.[0] || 'M',
      quantity: 1,
    });
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug || id}`} className="product-card__media">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          width={600}
          height={800}
        />
        <button
          type="button"
          className={`product-card__wish ${wished ? 'is-active' : ''}`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={onWish}
          disabled={busy}
        >
          <IconHeart filled={wished} />
        </button>
      </Link>

      <div className="product-card__body">
        {product.colors?.length > 0 && (
          <div className="product-card__swatches" role="list" aria-label="Colors">
            {product.colors.slice(0, 6).map((c, i) => (
              <button
                key={c.name || i}
                type="button"
                className={`swatch ${i === activeColor ? 'is-active' : ''}`}
                style={{ background: c.hex || 'var(--color-stone-gray)' }}
                aria-label={c.name}
                title={c.name}
                onClick={() => setActiveColor(i)}
              />
            ))}
          </div>
        )}

        <Link to={`/product/${product.slug || id}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__row">
          <p className="product-card__price">
            {formatPrice(product.price, product.currency)}
          </p>
          <button type="button" className="btn-fill" onClick={onQuickAdd}>
            Quick Add
          </button>
        </div>
      </div>
    </article>
  );
}
