import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/api';

export default function Cart() {
  const { items, subtotal, removeItem, setQty } = useCart();

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

  // Build a WhatsApp order message
  const orderText = items.map((i) =>
    `• ${i.name} (${[i.color, i.size].filter(Boolean).join(', ')}) x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
  ).join('\n');
  const whatsappMsg = encodeURIComponent(`Hi Bhotika! I'd like to order:\n\n${orderText}\n\nTotal: $${subtotal.toFixed(2)}`);
  const whatsappUrl = `https://wa.me/977XXXXXXXXXX?text=${whatsappMsg}`;

  return (
    <div className="section cart-layout">
      <div>
        <h1 className="page-title">Your Bag</h1>
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
              <p style={{ fontSize: 12, marginTop: 8 }}>${item.price}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <label style={{ fontSize: 12 }}>
                  Qty
                  <select
                    value={item.quantity}
                    onChange={(e) => setQty(item.key, Number(e.target.value))}
                    style={{ marginLeft: 8, border: 'none', borderBottom: '1px solid var(--color-smoke-charcoal)', background: 'transparent', fontSize: 12 }}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  style={{ background: 'none', border: 'none', fontSize: 12, textDecoration: 'underline', color: 'var(--color-smoke-charcoal)', padding: 8, cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <aside className="cart-summary">
        <h3>Order Summary</h3>
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-summary__row">
          <span>Shipping</span>
          <span>On enquiry</span>
        </div>
        <div className="cart-summary__total">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Order via WhatsApp */}
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-fill btn-fill--block" style={{ textDecoration: 'none', textAlign: 'center', display: 'block', padding: '12px 24px' }}>
          📲 Order via WhatsApp
        </a>

        {/* Order via Email */}
        <a
          href={`mailto:hello@bhotika.com?subject=Order Enquiry&body=${encodeURIComponent(`Hi Bhotika,\n\nI'd like to order:\n\n${orderText}\n\nPlease confirm availability and shipping cost.\n\nThank you!`)}`}
          className="btn-ghost"
          style={{ width: '100%', marginTop: 8, textAlign: 'center', display: 'block' }}
        >
          ✉️ Order via Email
        </a>

        <Link to="/shop" className="btn-ghost" style={{ width: '100%', marginTop: 8, textAlign: 'center', display: 'block' }}>
          Continue Shopping
        </Link>

        <p style={{ fontSize: 11, color: 'var(--color-smoke-charcoal)', marginTop: 16, lineHeight: 1.5, textAlign: 'center' }}>
          🇳🇵 We'll confirm your order, availability, and shipping cost personally.
        </p>
      </aside>
    </div>
  );
}
