import { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 1800 }) {
  useEffect(() => {
    if (!message) return undefined;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 88,
        transform: 'translateX(-50%)',
        background: 'var(--color-carbon-ink)',
        color: 'var(--color-paper-white)',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.025em',
        padding: '10px 20px',
        zIndex: 70,
        borderRadius: 0,
        maxWidth: 'calc(100vw - 32px)',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
}
