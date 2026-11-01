import React, { useState, useEffect, useCallback } from 'react';
import { useSite } from '../../lib/site.jsx';

export default function Media() {
  const { api, addToast } = useSite();
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadMedia = useCallback(async () => {
    const list = await api.listMedia();
    setItems(list);
  }, [api]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleFiles = async (fileList) => {
    if (!fileList?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await api.uploadMedia(file);
      }
      addToast('Uploaded media files!');
      await loadMedia();
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url) => {
    try {
      navigator.clipboard?.writeText(url);
    } catch {}
    addToast('Copied image URL to clipboard!');
  };

  const handleDelete = async (id) => {
    await api.deleteMedia(id);
    addToast('Removed image from Media Library');
    loadMedia();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Media Library ({items.length})</h1>
        <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
          <span>{uploading ? 'Uploading…' : '+ Upload Images'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: '2px dashed #C5C9C0',
          borderRadius: 18,
          padding: 28,
          textAlign: 'center',
          background: '#ffffff',
          marginBottom: 24,
          fontSize: 13.5,
          color: '#636761'
        }}
      >
        Drag and drop conservation photos here, or click <strong>+ Upload Images</strong> above (1.5 MB max in Demo Mode).
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items.map((m) => (
          <div key={m.id} className="admin-card" style={{ padding: 12, marginBottom: 0 }}>
            <img
              src={m.url}
              alt={m.name}
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {m.name}
            </div>
            <div style={{ fontSize: 11.5, color: '#636761', marginBottom: 10 }}>
              {Math.round((m.size || 32000) / 1024)} KB
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="admin-btn" style={{ flex: 1 }} onClick={() => copyUrl(m.url)}>
                Copy URL
              </button>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(m.id)}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
