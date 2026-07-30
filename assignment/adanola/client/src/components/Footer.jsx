import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <div className="site-footer__brand">BHOTIKA</div>
          <p className="site-footer__text">
            Handcrafted in Nepal. Hemp clothing, handmade accessories, bags, and
            jewellery — bringing Himalayan craftsmanship to the world.
          </p>
        </div>
        <div className="site-footer__col">
          <h4>Shop</h4>
          <Link to="/shop">All</Link>
          <Link to="/shop?category=hemp">Hemp Clothing</Link>
          <Link to="/shop?category=handmade">Handmade</Link>
          <Link to="/shop?category=new">New Arrivals</Link>
        </div>
        <div className="site-footer__col">
          <h4>Help</h4>
          <Link to="/account">Account</Link>
          <Link to="/cart">Bag</Link>
          <Link to="/wishlist">Wishlist</Link>
          <a href="mailto:hello@bhotika.com">Contact</a>
        </div>
        <div className="site-footer__col">
          <h4>Info</h4>
          <span style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)' }}>
            FREE delivery on orders over $100
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)', display: 'block', marginTop: 8 }}>
            Made in Nepal 🇳🇵 with love.
          </span>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Bhotika (भोटिका). Sustainable fashion from Nepal.</span>
        <span>Made with ♥ in Kathmandu</span>
      </div>
    </footer>
  );
}
