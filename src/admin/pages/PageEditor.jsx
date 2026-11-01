import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite } from '../../lib/site.jsx';
import { PAGES, COLLECTIONS } from '../schema.js';
import FieldInput from '../fields.jsx';

export default function PageEditor() {
  const { pageId = 'home' } = useParams();
  const { content, api, reload, addToast } = useSite();

  const pageConfig = PAGES.find((p) => p.id === pageId) || PAGES[0];
  const [drafts, setDrafts] = useState({});
  const [dirtyKeys, setDirtyKeys] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    const initial = {};
    pageConfig.sections.forEach((sec) => {
      initial[sec.key] = structuredClone(content?.[sec.key] || {});
    });
    setDrafts(initial);
    setDirtyKeys({});
  }, [pageId, content, pageConfig]);

  const handleFieldChange = (secKey, fieldName, val) => {
    setDrafts((prev) => ({
      ...prev,
      [secKey]: {
        ...(prev[secKey] || {}),
        [fieldName]: val
      }
    }));
    setDirtyKeys((prev) => ({ ...prev, [secKey]: true }));
  };

  const handleDiscard = (secKey) => {
    setDrafts((prev) => ({
      ...prev,
      [secKey]: structuredClone(content?.[secKey] || {})
    }));
    setDirtyKeys((prev) => ({ ...prev, [secKey]: false }));
    addToast('Discarded unsaved section changes.');
  };

  const handleSave = async (secKey) => {
    setSavingKey(secKey);
    try {
      await api.saveContent(secKey, drafts[secKey] || {});
      await reload();
      setDirtyKeys((prev) => ({ ...prev, [secKey]: false }));
      addToast(`Saved "${secKey}" section! Website updated.`);
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{pageConfig.label} Editor</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#636761' }}>Collections on this page:</span>
            {pageConfig.collections.length === 0 && (
              <span className="admin-badge">None</span>
            )}
            {pageConfig.collections.map((colName) => {
              const colMeta = COLLECTIONS.find((c) => c.table === colName);
              return (
                <Link key={colName} to={`/admin/collections/${colName}`} className="admin-btn" style={{ padding: '4px 10px', fontSize: 11.5 }}>
                  🗂 {colMeta?.label || colName} →
                </Link>
              );
            })}
          </div>
        </div>

        <Link to={pageConfig.path} className="admin-btn admin-btn-primary">
          Preview Page ({pageConfig.path}) ↗
        </Link>
      </div>

      {pageConfig.sections.map((sec) => {
        const isDirty = Boolean(dirtyKeys[sec.key]);
        const secData = drafts[sec.key] || {};
        return (
          <div key={sec.key} className="admin-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                paddingBottom: 16,
                marginBottom: 18,
                borderBottom: '1px solid #EAECE7'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700 }}>{sec.title}</h2>
                  {isDirty && <span className="admin-badge unsaved">Unsaved</span>}
                </div>
                <p style={{ fontSize: 12.5, color: '#636761', marginTop: 4 }}>{sec.description}</p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="admin-btn"
                  disabled={!isDirty}
                  onClick={() => handleDiscard(sec.key)}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  disabled={savingKey === sec.key}
                  onClick={() => handleSave(sec.key)}
                >
                  {savingKey === sec.key ? 'Saving…' : 'Save Section'}
                </button>
              </div>
            </div>

            <div className="form-grid-2">
              {sec.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={secData[field.name]}
                  allValues={secData}
                  onChange={(val) => handleFieldChange(sec.key, field.name, val)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
