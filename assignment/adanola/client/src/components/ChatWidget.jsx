import { useState } from 'react';
import { IconChat, IconClose } from './Icons';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 84,
            width: 300,
            maxWidth: 'calc(100vw - 32px)',
            background: 'var(--color-paper-white)',
            border: '1px solid var(--color-carbon-ink)',
            zIndex: 61,
            padding: 16,
          }}
          role="dialog"
          aria-label="Support"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 12, textTransform: 'uppercase' }}>Support</strong>
            <button type="button" className="nav__icon-btn" aria-label="Close" onClick={() => setOpen(false)} style={{ minWidth: 32, minHeight: 32, padding: 4 }}>
              <IconClose size={14} />
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-smoke-charcoal)', lineHeight: 1.5, marginBottom: 12 }}>
            Questions about fit, fabric, or delivery? We typically reply within a day.
          </p>
          <a className="btn-fill btn-fill--block" href="mailto:hello@adanola.example">
            Email us
          </a>
        </div>
      )}
      <button
        type="button"
        className="chat-widget"
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <IconClose size={18} /> : <IconChat />}
      </button>
    </>
  );
}
