import React from 'react';
import { useSite } from '../../lib/site.jsx';

export default function Setup() {
  const { api, reload, addToast } = useSite();

  const envBlock = `VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SUPABASE_BUCKET=media`;

  const handleResetDemo = async () => {
    await api.resetDemo();
    await reload();
    addToast('Demo data reset to factory defaults!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Supabase Setup & System Status</h1>
          <p style={{ fontSize: 13.5, color: '#636761' }}>
            Current Driver: <strong>{api.isDemo ? 'Demo Mode (localStorage)' : 'Connected to Live Supabase'}</strong>
          </p>
        </div>

        {api.isDemo && (
          <button type="button" className="admin-btn admin-btn-danger" onClick={handleResetDemo}>
            ↺ Reset Demo Data to Defaults
          </button>
        )}
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Go Live With Supabase in 5 Steps</h2>
        <ol style={{ paddingLeft: 20, fontSize: 13.5, lineHeight: 1.8, color: '#121412' }}>
          <li>Create a new project at <strong>database.new</strong> (Supabase).</li>
          <li>Open the Supabase <strong>SQL Editor</strong>, paste the entire contents of <code>supabase/setup.sql</code>, and click <strong>Run</strong>.</li>
          <li>Copy your Project URL and <code>anon</code> public key into a <code>.env</code> file (see block below). Never use the <code>service_role</code> key.</li>
          <li>Visit <code>/admin/login</code> to create the first account—our database trigger automatically promotes the first user to Admin.</li>
          <li>In Supabase Authentication settings, turn off <em>"Allow new users to sign up"</em> to lock down registration.</li>
        </ol>

        <pre
          style={{
            background: '#121412',
            color: 'var(--primary)',
            padding: 16,
            borderRadius: 12,
            fontSize: 12.5,
            marginTop: 14,
            overflowX: 'auto'
          }}
        >
          {envBlock}
        </pre>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Database Tables & Row-Level Security (RLS)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Purpose</th>
              <th>Public (Anon) Access</th>
              <th>Admin Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>site_content</code></td>
              <td>Page sections & theme settings</td>
              <td>SELECT all rows</td>
              <td>Full CRUD</td>
            </tr>
            <tr>
              <td><code>initiatives, problems, projects, tiers, stats, team, testimonials, faqs, partners</code></td>
              <td>Repeating site collections</td>
              <td>SELECT where <code>published = true</code></td>
              <td>Full CRUD</td>
            </tr>
            <tr>
              <td><code>messages, donations, volunteers, subscribers</code></td>
              <td>Public form submissions</td>
              <td>INSERT only (default status enforced)</td>
              <td>Full CRUD & CSV Export</td>
            </tr>
            <tr>
              <td><code>admin_users</code></td>
              <td>Authorized CMS administrators</td>
              <td>None (Security Definer RPC check)</td>
              <td>Full CRUD</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
