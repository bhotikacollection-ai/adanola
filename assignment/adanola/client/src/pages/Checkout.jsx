import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, ordersApi } from '../lib/api';

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'Ireland',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0 && !success) {
    return (
      <div className="empty-state">
        <p>Nothing to checkout.</p>
        <Link to="/shop" className="btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>
          Shop
        </Link>
      </div>
    );
  }

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await ordersApi.create({
        email: form.email,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone,
        },
      });
      clear();
      setSuccess(data.order);
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Order confirmed</h1>
        <p className="form-success">
          Thank you. Order <strong>{success._id || success.id}</strong> is pending.
          A confirmation will go to {success.email}.
        </p>
        <p style={{ fontSize: 14, marginBottom: 24 }}>
          Total paid: {formatPrice(success.total)}
        </p>
        <button type="button" className="btn-ghost" onClick={() => navigate('/shop')}>
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="section checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
      <form onSubmit={onSubmit}>
        <h1 className="page-title">Checkout</h1>
        {error && <p className="form-error">{error}</p>}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={update} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" required value={form.firstName} onChange={update} />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" required value={form.lastName} onChange={update} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="line1">Address</label>
          <input id="line1" name="line1" required value={form.line1} onChange={update} />
        </div>
        <div className="form-field">
          <label htmlFor="line2">Apartment, suite (optional)</label>
          <input id="line2" name="line2" value={form.line2} onChange={update} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" required value={form.city} onChange={update} />
          </div>
          <div className="form-field">
            <label htmlFor="postalCode">Postal code</label>
            <input id="postalCode" name="postalCode" required value={form.postalCode} onChange={update} />
          </div>
          <div className="form-field">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" required value={form.country} onChange={update} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={update} />
        </div>

        <button type="submit" className="btn-fill btn-fill--block" disabled={submitting}>
          {submitting ? 'Placing order…' : `Pay ${formatPrice(total)}`}
        </button>
        <p style={{ fontSize: 11, color: 'var(--color-smoke-charcoal)', marginTop: 12 }}>
          Demo checkout — no real payment is processed.
        </p>
      </form>

      <aside className="cart-summary">
        <h3>Your bag</h3>
        {items.map((i) => (
          <div key={i.key} className="cart-summary__row" style={{ marginBottom: 12 }}>
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="cart-summary__row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>
        <div className="cart-summary__total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </aside>

      <style>{`
        @media (max-width: 720px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
