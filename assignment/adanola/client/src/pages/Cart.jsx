import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/api';

export default function Cart() {
  const { items, subtotal, shipping, total, freeShippingThreshold, setQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Your bag is empty.</p>
        <Link to="/shop" className="btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>
          Continue shopping
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="section cart-layout">
      <div>
        <h1 className="page-title">Bag</h1>
        {items.map((item) => (
          <div className="cart-item" key={item.key}>
            <Link to={`/product/${item.slug || item.productId}`}>
              <img src={item.image} alt={item.name} />
            </Link>
            <div>
              <Link to={`/product/${item.slug || item.productId}`} style={{ fontSize: 12, fontWeight: 500 }}>
                {item.name}
              </Link>
              <p style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)', marginTop: 4 }}>
                {[item.color, item.size].filter(Boolean).join(' / ')}
              </p>
              <p style={{ fontSize: 12, marginTop: 8 }}>{formatPrice(item.price)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <label style={{ fontSize: 12 }}>
                  Qty
                  <select
                    value={item.quantity}
                    onChange={(e) => setQty(item.key, Number(e.target.value))}
                    style={{
                      marginLeft: 8,
                      border: 'none',
                      borderBottom: '1px solid var(--color-smoke-charcoal)',
                      background: 'transparent',
                      fontSize: 12,
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    textDecoration: 'underline',
                    color: 'var(--color-smoke-charcoal)',
                    padding: 8,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <aside className="cart-summary">
        <h3>Summary</h3>
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="cart-summary__row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>
        {remaining > 0 && (
          <p style={{ fontSize: 11, color: 'var(--color-smoke-charcoal)', margin: '8px 0 0' }}>
            You are {formatPrice(remaining)} away from free delivery.
          </p>
        )}
        <div className="cart-summary__total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link to="/checkout" className="btn-fill btn-fill--block">
          Checkout
        </Link>
        <Link
          to="/shop"
          className="btn-ghost"
          style={{ width: '100%', marginTop: 8, textAlign: 'center' }}
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
