import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultContent, defaultCollections } from './defaults.js';
import { loadSite, api } from './api.js';

const SiteContext = createContext(null);

export function applyThemeAndSeo(content) {
  if (typeof document === 'undefined') return;
  const general = content?.general || defaultContent.general;
  const seo = content?.seo || defaultContent.seo;

  const root = document.documentElement;
  if (general.primary_color) {
    root.style.setProperty('--primary', general.primary_color);
  }
  if (general.accent_color) {
    root.style.setProperty('--accent', general.accent_color);
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta && general.primary_color) {
    themeMeta.setAttribute('content', general.primary_color);
  }

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && seo.meta_description) {
    descMeta.setAttribute('content', seo.meta_description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && seo.meta_title) {
    ogTitle.setAttribute('content', seo.meta_title);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && seo.meta_description) {
    ogDesc.setAttribute('content', seo.meta_description);
  }
}

export function SiteProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [collections, setCollections] = useState(defaultCollections);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reload = useCallback(async () => {
    try {
      const data = await loadSite({ admin: false });
      setContent(data.content);
      setCollections(data.collections);
      applyThemeAndSeo(data.content);
      return data;
    } catch (err) {
      console.error('Failed to load site data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    applyThemeAndSeo(defaultContent);
    reload();
  }, [reload]);

  return (
    <SiteContext.Provider
      value={{
        content,
        collections,
        loading,
        reload,
        api,
        toasts,
        addToast,
        dismissToast
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside a SiteProvider');
  return ctx;
}

export function usePageTitle(pageTitle) {
  const { content } = useSite();
  useEffect(() => {
    const brand = content?.general?.brand_name || 'Verdantra';
    const baseTitle = content?.seo?.meta_title || `${brand} — Saving Nature & Fighting Climate Change Together`;
    document.title = pageTitle ? `${pageTitle} | ${brand}` : baseTitle;
  }, [pageTitle, content]);
}
