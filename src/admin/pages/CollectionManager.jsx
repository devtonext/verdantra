import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSite } from '../../lib/site.jsx';
import { COLLECTIONS } from '../schema.js';
import FieldInput from '../fields.jsx';
import Modal from '../../components/Modal.jsx';

export default function CollectionManager() {
  const { table = 'initiatives' } = useParams();
  const { api, reload, addToast } = useSite();

  const colConfig = COLLECTIONS.find((c) => c.table === table) || COLLECTIONS[0];
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchItems = useCallback(async () => {
    const list = await api.list(colConfig.table, { admin: true });
    setItems(list);
  }, [api, colConfig.table]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenNew = () => {
    const blank = { published: true, sort_order: items.length + 1 };
    colConfig.fields.forEach((f) => {
      if (f.type === 'boolean') blank[f.name] = false;
      else if (f.type === 'number') blank[f.name] = 0;
      else if (f.type === 'tags' || f.type === 'list') blank[f.name] = [];
      else blank[f.name] = '';
    });
    setEditingItem({ _isNew: true, ...blank });
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editingItem };
      const isNew = payload._isNew;
      delete payload._isNew;

      if (isNew) {
        await api.insert(colConfig.table, payload);
        addToast(`Added new ${colConfig.singular}!`);
      } else {
        await api.update(colConfig.table, payload.id, payload);
        addToast(`Updated ${colConfig.singular}!`);
      }
      setEditingItem(null);
      await fetchItems();
      await reload();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleTogglePublished = async (item) => {
    await api.update(colConfig.table, item.id, { published: !item.published });
    addToast(`${item.published ? 'Hidden' : 'Published'} item on live website.`);
    await fetchItems();
    await reload();
  };

  const handleDuplicate = async (item) => {
    const copy = { ...item };
    delete copy.id;
    copy[colConfig.primaryField] = `${copy[colConfig.primaryField]} (Copy)`;
    copy.sort_order = items.length + 1;
    await api.insert(colConfig.table, copy);
    addToast('Duplicated item!');
    await fetchItems();
    await reload();
  };

  const handleMove = async (index, dir) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const a = items[index];
    const b = items[targetIdx];
    await Promise.all([
      api.update(colConfig.table, a.id, { sort_order: b.sort_order }),
      api.update(colConfig.table, b.id, { sort_order: a.sort_order })
    ]);
    await fetchItems();
    await reload();
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return;
    await api.remove(colConfig.table, confirmDeleteId);
    setConfirmDeleteId(null);
    addToast('Deleted item.');
    await fetchItems();
    await reload();
  };

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const text = String(item[colConfig.primaryField] || '').toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>
            {colConfig.label} <span className="admin-badge">{items.length} items</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="search"
            className="form-input"
            placeholder={`Search ${colConfig.label.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="admin-btn admin-btn-primary" onClick={handleOpenNew}>
            + Add {colConfig.singular}
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              {colConfig.thumbnailField && <th>Image</th>}
              <th>{colConfig.singular}</th>
              <th>Visibility</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" className="admin-btn" style={{ padding: '3px 7px' }} onClick={() => handleMove(idx, -1)}>
                      ↑
                    </button>
                    <button type="button" className="admin-btn" style={{ padding: '3px 7px' }} onClick={() => handleMove(idx, 1)}>
                      ↓
                    </button>
                  </div>
                </td>
                {colConfig.thumbnailField && (
                  <td>
                    {item[colConfig.thumbnailField] && (
                      <img
                        src={item[colConfig.thumbnailField]}
                        alt=""
                        style={{ width: 46, height: 36, objectFit: 'cover', borderRadius: 6 }}
                      />
                    )}
                  </td>
                )}
                <td>
                  <div style={{ fontWeight: 600 }}>
                    {String(item[colConfig.primaryField] || '').replace(/\\n|\n/g, ' ')}
                    {item.featured && (
                      <span className="admin-badge live" style={{ marginLeft: 8 }}>
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className={`admin-badge ${item.published !== false ? 'live' : ''}`}
                    onClick={() => handleTogglePublished(item)}
                  >
                    {item.published !== false ? '● Live' : '○ Hidden'}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button type="button" className="admin-btn" onClick={() => setEditingItem({ ...item })}>
                      Edit
                    </button>
                    <button type="button" className="admin-btn" onClick={() => handleDuplicate(item)}>
                      Duplicate
                    </button>
                    <button type="button" className="admin-btn admin-btn-danger" onClick={() => setConfirmDeleteId(item.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Item Modal */}
      <Modal
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title={editingItem?._isNew ? `Add ${colConfig.singular}` : `Edit ${colConfig.singular}`}
      >
        {editingItem && (
          <form onSubmit={handleSaveItem}>
            {colConfig.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={editingItem[field.name]}
                allValues={editingItem}
                onChange={(val) => setEditingItem((prev) => ({ ...prev, [field.name]: val }))}
              />
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button type="button" className="admin-btn" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary">
                Save {colConfig.singular}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
      >
        <p style={{ fontSize: 14, color: '#636761', marginBottom: 20 }}>
          Are you sure you want to permanently delete this item?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="admin-btn" onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </button>
          <button type="button" className="admin-btn admin-btn-danger" onClick={handleDeleteConfirmed}>
            Delete Permanently
          </button>
        </div>
      </Modal>
    </div>
  );
}
