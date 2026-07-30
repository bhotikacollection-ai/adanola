import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ paddingBlock: 'var(--section-gap)' }}>
      <h1 className="page-title" style={{ marginBottom: 12 }}>Page not found</h1>
      <p style={{ marginBottom: 24 }}>This spread isn’t in the lookbook.</p>
      <Link to="/" className="btn-ghost">
        Back home
      </Link>
    </div>
  );
}
