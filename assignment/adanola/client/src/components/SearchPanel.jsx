import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconClose, IconSearch } from './Icons';

export default function SearchPanel({ open, onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  function submit(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    onClose();
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="search-panel" role="search">
      <form className="search-panel__row" onSubmit={submit}>
        <IconSearch size={18} />
        <input
          ref={inputRef}
          className="search-input"
          type="search"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search products"
        />
        <button type="button" className="nav__icon-btn" aria-label="Close search" onClick={onClose}>
          <IconClose />
        </button>
      </form>
    </div>
  );
}
