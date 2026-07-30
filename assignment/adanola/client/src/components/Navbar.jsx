import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconUser } from './Icons';

const LINKS = [
  { to: '/shop', label: 'SHOP' },
  { to: '/shop?category=active', label: 'ACTIVE' },
  { to: '/shop?category=sweats', label: 'SWEATS' },
  { to: '/shop?category=spring-summer', label: 'SPRING SUMMER' },
];

export default function Navbar({ onOpenSearch }) {
  const { count } = useCart();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <button
          type="button"
          className="nav__menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>

        <div className={`nav__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive && l.to === '/shop' ? 'is-active' : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
          ADANOLA
        </Link>

        <div className="nav__icons">
          <button
            type="button"
            className="nav__icon-btn"
            aria-label="Wishlist"
            onClick={() => navigate('/wishlist')}
          >
            <IconHeart />
          </button>
          <button
            type="button"
            className="nav__icon-btn"
            aria-label="Search"
            onClick={onOpenSearch}
          >
            <IconSearch />
          </button>
          <button
            type="button"
            className="nav__icon-btn"
            aria-label={isAuthenticated ? 'Account' : 'Sign in'}
            onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
          >
            <IconUser />
          </button>
          <button
            type="button"
            className="nav__icon-btn"
            aria-label="Bag"
            onClick={() => navigate('/cart')}
          >
            <IconBag />
            {count > 0 && <span className="nav__badge">{count}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}
