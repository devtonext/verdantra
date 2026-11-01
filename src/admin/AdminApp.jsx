import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import { useSite } from '../lib/site.jsx';
import { PAGES, COLLECTIONS, INBOX_TABLES } from './schema.js';
import Overview from './pages/Overview.jsx';
import PageEditor from './pages/PageEditor.jsx';
import CollectionManager from './pages/CollectionManager.jsx';
import Inbox from './pages/Inbox.jsx';
import Media from './pages/Media.jsx';
import Setup from './pages/Setup.jsx';
import ToastContainer from '../components/Toast.jsx';
import './admin.css';

export default function AdminApp() {
  const { api, addToast } = useSite();
  const [session, setSession] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function init() {
      const [sess, exists] = await Promise.all([api.getSession(), api.adminExists()]);
      if (!mounted) return;
      setSession(sess);
      setAdminExists(exists);
      if (sess) {
        const adm = await api.isAdmin();
        if (mounted) setIsAdminUser(adm);
      }
      if (mounted) setChecking(false);
    }
    init();

    const unsub = api.onAuthChange(async (newSess) => {
      setSession(newSess);
      if (newSess) {
        const adm = await api.isAdmin();
        setIsAdminUser(adm);
      } else {
        setIsAdminUser(false);
      }
    });
    return () => {
      mounted = false;
      unsub?.();
    };
  }, [api]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (!adminExists) {
        await api.signUp(email, password);
        setAdminExists(true);
        addToast('First admin account created!');
      } else {
        await api.signIn(email, password);
        addToast('Signed in to Verdantra Admin CMS');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  if (checking) {
    return <div style={{ padding: 48, textAlign: 'center' }}>Loading Admin CMS…</div>;
  }

  // Not signed in -> Login / First-Admin Signup Screen
  if (!session) {
    return (
      <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="admin-card" style={{ maxWidth: 430, width: '100%', padding: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <Link to="/" style={{ fontSize: 12.5, color: '#636761', fontWeight: 600 }}>
              ← Back to Website
            </Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            {!adminExists ? 'Create the Admin Account' : 'Verdantra Admin Login'}
          </h1>
          <p style={{ fontSize: 13, color: '#636761', marginBottom: 18 }}>
            {!adminExists
              ? 'No administrator exists yet. The first account to sign up becomes the site administrator.'
              : 'Sign in to edit pages, collections, brand colours, and inbox submissions.'}
          </p>

          {api.isDemo && (
            <div
              style={{
                background: 'var(--primary)',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 600,
                marginBottom: 16
              }}
            >
              Demo Credentials: <code>admin@demo.com</code> / <code>demo1234</code>
            </div>
          )}

          {authError && (
            <div style={{ background: '#FEF3F2', color: '#B42318', padding: 10, borderRadius: 10, fontSize: 12.5, marginBottom: 14 }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            <div className="form-field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary-lime" style={{ width: '100%' }}>
              {!adminExists ? 'Create Admin Account →' : 'Sign In to Dashboard →'}
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Signed in as non-admin
  if (!isAdminUser) {
    return (
      <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="admin-card" style={{ maxWidth: 420, textAlign: 'center', padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No Admin Access</h1>
          <p style={{ fontSize: 13.5, color: '#636761', marginBottom: 20 }}>
            Your account ({session.user?.email}) is signed in, but is not listed in <code>admin_users</code>.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link to="/" className="admin-btn">
              ← Back to Website
            </Link>
            <button type="button" className="admin-btn admin-btn-danger" onClick={() => api.signOut()}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-title">✦ Verdantra CMS</span>
        </div>

        <div>
          <div className="admin-nav-group-title">Overview</div>
          <div className="admin-nav-list">
            <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
              <span>Dashboard Overview</span>
            </NavLink>
          </div>
        </div>

        <div>
          <div className="admin-nav-group-title">Pages</div>
          <div className="admin-nav-list">
            {PAGES.map((p) => (
              <NavLink key={p.id} to={`/admin/pages/${p.id}`} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                <span>{p.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <div className="admin-nav-group-title">Collections</div>
          <div className="admin-nav-list">
            {COLLECTIONS.map((c) => (
              <NavLink key={c.table} to={`/admin/collections/${c.table}`} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                <span>{c.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <div className="admin-nav-group-title">Inbox</div>
          <div className="admin-nav-list">
            {INBOX_TABLES.map((t) => (
              <NavLink key={t.table} to={`/admin/inbox/${t.table}`} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                <span>{t.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <div className="admin-nav-group-title">System</div>
          <div className="admin-nav-list">
            <NavLink to="/admin/media" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
              <span>Media Library</span>
            </NavLink>
            <NavLink to="/admin/setup" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
              <span>Supabase Setup</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="admin-mode-badge">
              ● {api.isDemo ? 'Demo Mode' : 'Connected to Supabase'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" className="admin-btn">
              View Live Website ↗
            </Link>
            <span style={{ fontSize: 12.5, color: '#636761' }}>{session.user?.email}</span>
            <button type="button" className="admin-btn" onClick={() => api.signOut()}>
              Sign Out
            </button>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="pages/:pageId" element={<PageEditor />} />
            <Route path="collections/:table" element={<CollectionManager />} />
            <Route path="inbox/:table" element={<Inbox />} />
            <Route path="media" element={<Media />} />
            <Route path="setup" element={<Setup />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
