import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite } from '../../lib/site.jsx';
import { INBOX_TABLES } from '../schema.js';
import { exportToCsv } from '../../utils.js';
import Modal from '../../components/Modal.jsx';

export default function Inbox() {
  const { table = 'messages' } = useParams();
  const { api, addToast } = useSite();

  const inboxConfig = INBOX_TABLES.find((t) => t.table === table) || INBOX_TABLES[0];
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const loadRows = useCallback(async () => {
    const data = await api.list(inboxConfig.table, { admin: true });
    setRows(data);
  }, [api, inboxConfig.table]);

  useEffect(() => {
    setStatusFilter('all');
    loadRows();
  }, [loadRows]);

  const handleStatusChange = async (id, newStatus) => {
    await api.update(inboxConfig.table, id, { status: newStatus });
    addToast(`Status updated to ${newStatus}`);
    loadRows();
  };

  const handleInspect = async (row) => {
    setSelectedRow(row);
    if (inboxConfig.table === 'messages' && row.status === 'unread') {
      await api.update('messages', row.id, { status: 'read' });
      loadRows();
    }
  };

  const handleDelete = async (id) => {
    await api.remove(inboxConfig.table, id);
    setSelectedRow(null);
    addToast('Submission deleted');
    loadRows();
  };

  const filtered = rows.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || JSON.stringify(r).toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Inbox Table Switcher Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {INBOX_TABLES.map((t) => (
          <Link
            key={t.table}
            to={`/admin/inbox/${t.table}`}
            className={`admin-btn ${t.table === inboxConfig.table ? 'admin-btn-primary' : ''}`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`admin-btn ${statusFilter === 'all' ? 'admin-btn-primary' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({rows.length})
          </button>
          {inboxConfig.statuses.map((st) => {
            const count = rows.filter((r) => r.status === st).length;
            return (
              <button
                key={st}
                type="button"
                className={`admin-btn ${statusFilter === st ? 'admin-btn-primary' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="search"
            className="form-input"
            placeholder="Search submissions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="admin-btn"
            onClick={() => exportToCsv(`${inboxConfig.table}-export.csv`, filtered)}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Primary</th>
              <th>Details</th>
              <th>Status</th>
              <th>Submitted</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r[inboxConfig.primaryField]}</div>
                  {r.email && <div style={{ fontSize: 11.5, color: '#636761' }}>{r.email}</div>}
                </td>
                <td>
                  <div>{r[inboxConfig.secondaryField]}</div>
                  {r.amount && <div style={{ fontWeight: 700 }}>${r.amount} ({r.frequency})</div>}
                </td>
                <td>
                  <select
                    className="form-select"
                    style={{ padding: '5px 10px', fontSize: 12 }}
                    value={r.status}
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  >
                    {inboxConfig.statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ fontSize: 12, color: '#636761' }}>
                  {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button type="button" className="admin-btn" onClick={() => handleInspect(r)}>
                      Inspect
                    </button>
                    <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        title="Submission Details"
      >
        {selectedRow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
            {Object.entries(selectedRow).map(([k, v]) => (
              <div key={k} style={{ borderBottom: '1px solid #EAECE7', paddingBottom: 8 }}>
                <strong style={{ textTransform: 'uppercase', fontSize: 11, color: '#636761', display: 'block' }}>
                  {k}
                </strong>
                <span>{String(v)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {selectedRow.email && (
                <a href={`mailto:${selectedRow.email}`} className="admin-btn admin-btn-primary">
                  ✉ Reply via Email
                </a>
              )}
              {selectedRow.phone && (
                <a href={`tel:${selectedRow.phone}`} className="admin-btn">
                  📞 Call {selectedRow.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
