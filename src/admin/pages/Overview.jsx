import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../lib/site.jsx';
import { PAGES } from '../schema.js';

export default function Overview() {
  const { api, collections } = useSite();
  const [counts, setCounts] = useState({ messages: 0, donations: 0, volunteers: 0, subscribers: 0 });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    Promise.all([
      api.list('messages', { admin: true }),
      api.list('donations', { admin: true }),
      api.list('volunteers', { admin: true }),
      api.list('subscribers', { admin: true })
    ]).then(([msgs, dons, vols, subs]) => {
      setCounts({
        messages: msgs.filter((m) => m.status === 'unread').length,
        donations: dons.filter((d) => d.status === 'pending').length,
        volunteers: vols.filter((v) => v.status === 'new').length,
        subscribers: subs.length
      });
      setRecentMessages(msgs.slice(0, 4));
    });
  }, [api]);

  const publishedProjects = (collections?.projects || []).length;

  return (
    <div>
      {api.isDemo && (
        <div
          style={{
            background: 'var(--primary)',
            padding: '14px 20px',
            borderRadius: 14,
            marginBottom: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>
            ⚡ Running in Interactive Demo Mode — Edits save immediately to your browser localStorage and update the live site.
          </div>
          <Link to="/admin/setup" className="admin-btn">
            Connect Supabase →
          </Link>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Conservation CMS Overview</h1>
        <p style={{ fontSize: 13.5, color: '#636761' }}>
          Manage every page section, ecological dataset, field dispatch, and public form submission.
        </p>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-box">
          <div style={{ fontSize: 12, color: '#636761', fontWeight: 600 }}>PENDING PLEDGES & VOLUNTEERS</div>
          <div className="admin-stat-num">{counts.donations + counts.volunteers}</div>
        </div>
        <div className="admin-stat-box">
          <div style={{ fontSize: 12, color: '#636761', fontWeight: 600 }}>UNREAD MESSAGES</div>
          <div className="admin-stat-num">{counts.messages}</div>
        </div>
        <div className="admin-stat-box">
          <div style={{ fontSize: 12, color: '#636761', fontWeight: 600 }}>NEWSLETTER SUBSCRIBERS</div>
          <div className="admin-stat-num">{counts.subscribers}</div>
        </div>
        <div className="admin-stat-box">
          <div style={{ fontSize: 12, color: '#636761', fontWeight: 600 }}>PUBLISHED PROJECTS</div>
          <div className="admin-stat-num">{publishedProjects}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Latest Inbox Messages</h2>
            <Link to="/admin/inbox/messages" className="admin-btn">
              Open Inbox →
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11.5, color: '#636761' }}>{m.email}</div>
                  </td>
                  <td>{m.subject}</td>
                  <td>
                    <span className={`admin-badge ${m.status === 'unread' ? 'unsaved' : 'live'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Quick Page Editors</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PAGES.map((p) => (
              <Link
                key={p.id}
                to={`/admin/pages/${p.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '11px 14px',
                  borderRadius: 12,
                  border: '1px solid #E4E6E1',
                  fontSize: 13.5,
                  fontWeight: 600
                }}
              >
                <span>{p.label}</span>
                <span style={{ color: '#636761', fontSize: 12 }}>{p.sections.length} sections →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
