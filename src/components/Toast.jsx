import React from 'react';
import { useSite } from '../lib/site.jsx';

export default function ToastContainer() {
  const { toasts, dismissToast } = useSite();
  if (!toasts?.length) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item" onClick={() => dismissToast(t.id)}>
          <span className="dot" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
