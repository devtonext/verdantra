import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/site.jsx';

export default function NotFound() {
  usePageTitle('404 — Page Not Found');
  return (
    <div style={{ textAlign: 'center', padding: '96px 20px' }}>
      <span className="page-eyebrow-pill">404 Telemetry Lost</span>
      <h1 style={{ fontSize: 42, fontWeight: 600, margin: '16px 0 12px' }}>
        Uncharted Coordinates
      </h1>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 28px' }}>
        The conservation dispatch or biosphere route you are looking for has moved or does not exist.
      </p>
      <Link to="/" className="btn-primary-lime">
        Return to Base Camp (Home) →
      </Link>
    </div>
  );
}
