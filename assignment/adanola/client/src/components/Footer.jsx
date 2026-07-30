import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <div className="site-footer__brand">ADANOLA</div>
          <p className="site-footer__text">
            Editorial activewear on white paper. Photography-first staples for
            movement, rest, and everything between.
          </p>
        </div>
        <div className="site-footer__col">
          <h4>Shop</h4>
          <Link to="/shop">All</Link>
          <Link to="/shop?category=active">Active</Link>
          <Link to="/shop?category=sweats">Sweats</Link>
          <Link to="/shop?category=spring-summer">Spring Summer</Link>
        </div>
        <div className="site-footer__col">
          <h4>Help</h4>
          <Link to="/account">Account</Link>
          <Link to="/cart">Bag</Link>
          <Link to="/wishlist">Wishlist</Link>
          <a href="mailto:hello@adanola.example">Contact</a>
        </div>
        <div className="site-footer__col">
          <h4>Info</h4>
          <span style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)' }}>
            FREE delivery over €125
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)', display: 'block', marginTop: 8 }}>
            Designed as an editorial lookbook.
          </span>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Adanola. Demo store for design systems.</span>
        <span>MERN · Vercel · Cloudinary</span>
      </div>
    </footer>
  );
}
