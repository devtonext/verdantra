import React, { useState } from 'react';
import { slugify } from '../utils.js';
import { useSite } from '../lib/site.jsx';
import Modal from '../components/Modal.jsx';

export default function FieldInput({ field, value, onChange, allValues = {} }) {
  const { api, addToast } = useSite();
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [uploading, setUploading] = useState(false);

  const openMediaPicker = async () => {
    setMediaModalOpen(true);
    try {
      const list = await api.listMedia();
      setMediaItems(list);
    } catch (err) {
      addToast(err.message || 'Could not load media library', 'error');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await api.uploadMedia(file);
      onChange(uploaded.url);
      addToast('Image uploaded and selected!');
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const val = value ?? '';

  if (field.type === 'boolean') {
    return (
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', margin: '8px 0' }}>
        <input
          type="checkbox"
          checked={Boolean(val)}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#121412' }}
        />
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{field.label}</span>
      </label>
    );
  }

  return (
    <div className="form-field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>{field.label}</label>
        {field.type === 'slug' && field.from && (
          <button
            type="button"
            className="admin-btn"
            style={{ padding: '2px 8px', fontSize: 11 }}
            onClick={() => onChange(slugify(allValues[field.from] || ''))}
          >
            Generate from {field.from}
          </button>
        )}
      </div>
      {field.hint && <div className="admin-field-hint">{field.hint}</div>}

      {field.type === 'text' || field.type === 'url' || field.type === 'slug' || field.type === 'date' ? (
        <input
          type={field.type === 'date' ? 'date' : 'text'}
          className="form-input"
          value={val}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === 'number' ? (
        <input
          type="number"
          className="form-input"
          value={val}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : field.type === 'select' ? (
        <select className="form-select" value={val} onChange={(e) => onChange(e.target.value)}>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === 'color' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="color"
            value={val || '#E2F652'}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: 44, height: 40, border: '1px solid #D5D8D0', borderRadius: 8, cursor: 'pointer' }}
          />
          <input
            type="text"
            className="form-input"
            value={val || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ maxWidth: 160 }}
          />
        </div>
      ) : field.type === 'tags' ? (
        <input
          type="text"
          className="form-input"
          placeholder="tag 1, tag 2"
          value={Array.isArray(val) ? val.join(', ') : val}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      ) : field.type === 'list' ? (
        <textarea
          rows="4"
          className="form-textarea"
          placeholder="One item per line"
          value={Array.isArray(val) ? val.join('\n') : val}
          onChange={(e) =>
            onChange(
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      ) : field.type === 'image' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {val && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={val}
                alt="Preview"
                style={{ width: 84, height: 64, objectFit: 'cover', borderRadius: 10, border: '1px solid #E4E6E1' }}
              />
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => onChange('')}>
                Remove Image
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Paste image URL or choose from Media Library…"
              value={val}
              onChange={(e) => onChange(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <label className="admin-btn" style={{ cursor: 'pointer' }}>
              <span>{uploading ? 'Uploading…' : 'Upload File'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </label>
            <button type="button" className="admin-btn" onClick={openMediaPicker}>
              Media Library
            </button>
          </div>

          <Modal open={mediaModalOpen} onClose={() => setMediaModalOpen(false)} title="Select from Media Library">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {mediaItems.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.url);
                    setMediaModalOpen(false);
                  }}
                  style={{
                    border: '1px solid #E4E6E1',
                    borderRadius: 12,
                    padding: 8,
                    textAlign: 'left',
                    background: '#fff'
                  }}
                >
                  <img
                    src={m.url}
                    alt={m.name}
                    style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }}
                  />
                  <div style={{ fontSize: 11.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.name}
                  </div>
                </button>
              ))}
            </div>
          </Modal>
        </div>
      ) : (
        <textarea
          rows={field.type === 'markdown' ? 5 : 3}
          className="form-textarea"
          value={String(val).replace(/\\n/g, '\n')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
