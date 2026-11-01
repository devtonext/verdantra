// ============================================================================
// SINGLE DATA API: SUPABASE DRIVER + ZERO-SETUP DEMO (LOCALSTORAGE) DRIVER
// Dynamically imports @supabase/supabase-js only when VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY are configured, keeping the demo bundle lightweight.
// ============================================================================

import { defaultContent, defaultCollections, defaultSubmissions, defaultMedia } from './defaults.js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_BUCKET = import.meta.env?.VITE_SUPABASE_BUCKET || 'media';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const STORAGE_KEYS = {
  CONTENT: 'verdantra_cms_content_v1',
  COLLECTIONS: 'verdantra_cms_collections_v1',
  SUBMISSIONS: 'verdantra_cms_submissions_v1',
  MEDIA: 'verdantra_cms_media_v1',
  SESSION: 'verdantra_cms_session_v1',
  ADMIN_EXISTS: 'verdantra_cms_admin_exists_v1'
};

let supabaseClientPromise = null;
async function getSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!supabaseClientPromise) {
    supabaseClientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    );
  }
  return supabaseClientPromise;
}

function safeReadStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

function safeWriteStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage write warning:', err);
  }
}

const authSubscribers = new Set();
function notifyAuthSubscribers(session) {
  authSubscribers.forEach((cb) => {
    try {
      cb(session);
    } catch (e) {
      console.error(e);
    }
  });
}

export const api = {
  isDemo: !isSupabaseConfigured,

  // --------------------------------------------------------------------------
  // PAGE SECTIONS CONTENT
  // --------------------------------------------------------------------------
  async getContent() {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.from('site_content').select('key, data');
      if (error) throw error;
      const merged = structuredClone(defaultContent);
      (data || []).forEach((row) => {
        merged[row.key] = { ...(merged[row.key] || {}), ...(row.data || {}) };
      });
      return merged;
    }

    const stored = safeReadStorage(STORAGE_KEYS.CONTENT, {});
    const merged = structuredClone(defaultContent);
    Object.keys(stored).forEach((k) => {
      merged[k] = { ...(merged[k] || {}), ...stored[k] };
    });
    return merged;
  },

  async saveContent(sectionKey, dataObj) {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { error } = await sb
        .from('site_content')
        .upsert({ key: sectionKey, data: dataObj, updated_at: new Date().toISOString() });
      if (error) throw error;
      return dataObj;
    }

    const stored = safeReadStorage(STORAGE_KEYS.CONTENT, {});
    stored[sectionKey] = { ...(defaultContent[sectionKey] || {}), ...(stored[sectionKey] || {}), ...dataObj };
    safeWriteStorage(STORAGE_KEYS.CONTENT, stored);
    return stored[sectionKey];
  },

  // --------------------------------------------------------------------------
  // COLLECTIONS & SUBMISSIONS LISTS
  // --------------------------------------------------------------------------
  async list(table, { admin = false } = {}) {
    const isSubmissionTable = Object.prototype.hasOwnProperty.call(defaultSubmissions, table);

    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      let q = sb.from(table).select('*');
      if (isSubmissionTable) {
        q = q.order('created_at', { ascending: false });
      } else {
        if (!admin) q = q.eq('published', true);
        q = q.order('sort_order', { ascending: true });
      }
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    }

    if (isSubmissionTable) {
      const allSubs = safeReadStorage(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
      const rows = Array.isArray(allSubs[table]) ? [...allSubs[table]] : [];
      return rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    const allCols = safeReadStorage(STORAGE_KEYS.COLLECTIONS, defaultCollections);
    let rows = Array.isArray(allCols[table]) ? [...allCols[table]] : [];
    if (!admin) {
      rows = rows.filter((r) => r.published !== false);
    }
    return rows.sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
  },

  async insert(table, payload) {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.from(table).insert(payload).select().single();
      if (error) throw error;
      return data;
    }

    const allCols = safeReadStorage(STORAGE_KEYS.COLLECTIONS, defaultCollections);
    const list = Array.isArray(allCols[table]) ? [...allCols[table]] : [];
    const newItem = {
      id: payload.id || `${table}-${Date.now()}`,
      sort_order: payload.sort_order ?? list.length + 1,
      published: payload.published ?? true,
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    list.push(newItem);
    allCols[table] = list;
    safeWriteStorage(STORAGE_KEYS.COLLECTIONS, allCols);
    return newItem;
  },

  async update(table, id, patch) {
    const isSubmissionTable = Object.prototype.hasOwnProperty.call(defaultSubmissions, table);

    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb
        .from(table)
        .update({ ...patch, ...(isSubmissionTable ? {} : { updated_at: new Date().toISOString() }) })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    if (isSubmissionTable) {
      const allSubs = safeReadStorage(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
      const list = Array.isArray(allSubs[table]) ? [...allSubs[table]] : [];
      const idx = list.findIndex((r) => r.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...patch };
        allSubs[table] = list;
        safeWriteStorage(STORAGE_KEYS.SUBMISSIONS, allSubs);
        return list[idx];
      }
      throw new Error('Submission not found');
    }

    const allCols = safeReadStorage(STORAGE_KEYS.COLLECTIONS, defaultCollections);
    const list = Array.isArray(allCols[table]) ? [...allCols[table]] : [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Item not found');
    list[idx] = { ...list[idx], ...patch, updated_at: new Date().toISOString() };
    allCols[table] = list;
    safeWriteStorage(STORAGE_KEYS.COLLECTIONS, allCols);
    return list[idx];
  },

  async remove(table, id) {
    const isSubmissionTable = Object.prototype.hasOwnProperty.call(defaultSubmissions, table);

    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { error } = await sb.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    if (isSubmissionTable) {
      const allSubs = safeReadStorage(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
      allSubs[table] = (allSubs[table] || []).filter((r) => r.id !== id);
      safeWriteStorage(STORAGE_KEYS.SUBMISSIONS, allSubs);
      return true;
    }

    const allCols = safeReadStorage(STORAGE_KEYS.COLLECTIONS, defaultCollections);
    allCols[table] = (allCols[table] || []).filter((r) => r.id !== id);
    safeWriteStorage(STORAGE_KEYS.COLLECTIONS, allCols);
    return true;
  },

  // --------------------------------------------------------------------------
  // PUBLIC FORM SUBMISSIONS
  // --------------------------------------------------------------------------
  async submit(table, payload) {
    const defaultStatusMap = {
      messages: 'unread',
      donations: 'pending',
      volunteers: 'new',
      subscribers: 'active'
    };
    const status = defaultStatusMap[table] || 'new';

    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { error } = await sb.from(table).insert({ ...payload, status });
      if (error) throw error;
      return { ok: true };
    }

    const allSubs = safeReadStorage(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
    const list = Array.isArray(allSubs[table]) ? [...allSubs[table]] : [];
    if (table === 'subscribers' && payload.email) {
      const exists = list.some((s) => s.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) {
        return { ok: true, duplicate: true };
      }
    }
    const entry = {
      id: `${table.slice(0, 3)}-${Date.now()}`,
      ...payload,
      status,
      created_at: new Date().toISOString()
    };
    list.unshift(entry);
    allSubs[table] = list;
    safeWriteStorage(STORAGE_KEYS.SUBMISSIONS, allSubs);
    return { ok: true, entry };
  },

  // --------------------------------------------------------------------------
  // AUTHENTICATION & ADMIN PERMISSIONS
  // --------------------------------------------------------------------------
  async getSession() {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data } = await sb.auth.getSession();
      return data?.session || null;
    }
    return safeReadStorage(STORAGE_KEYS.SESSION, null);
  },

  async signIn(email, password) {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.session;
    }

    if (email.trim().toLowerCase() === 'admin@demo.com' && password === 'demo1234') {
      const session = {
        user: { id: 'demo-admin-uid', email: 'admin@demo.com', role: 'admin' },
        access_token: 'demo-token'
      };
      safeWriteStorage(STORAGE_KEYS.SESSION, session);
      notifyAuthSubscribers(session);
      return session;
    }
    if (password === 'nonadmin') {
      const session = {
        user: { id: 'demo-guest-uid', email, role: 'guest' },
        access_token: 'guest-token'
      };
      safeWriteStorage(STORAGE_KEYS.SESSION, session);
      notifyAuthSubscribers(session);
      return session;
    }
    throw new Error('Invalid demo credentials. Use admin@demo.com / demo1234');
  },

  async signUp(email, password) {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      return data.session;
    }

    const session = {
      user: { id: 'demo-admin-uid', email, role: 'admin' },
      access_token: 'demo-token'
    };
    safeWriteStorage(STORAGE_KEYS.ADMIN_EXISTS, true);
    safeWriteStorage(STORAGE_KEYS.SESSION, session);
    notifyAuthSubscribers(session);
    return session;
  },

  async signOut() {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      await sb.auth.signOut();
      return;
    }
    try {
      window.localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {}
    notifyAuthSubscribers(null);
  },

  onAuthChange(callback) {
    if (isSupabaseConfigured) {
      let subscription = null;
      getSupabase().then((sb) => {
        const { data } = sb.auth.onAuthStateChange((_event, session) => {
          callback(session);
        });
        subscription = data?.subscription;
      });
      return () => subscription?.unsubscribe?.();
    }

    authSubscribers.add(callback);
    return () => authSubscribers.delete(callback);
  },

  async isAdmin() {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.rpc('is_admin');
      if (error) return false;
      return Boolean(data);
    }
    const session = safeReadStorage(STORAGE_KEYS.SESSION, null);
    return Boolean(session && session.user && session.user.role === 'admin');
  },

  async adminExists() {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.rpc('admin_exists');
      if (error) return true;
      return Boolean(data);
    }
    return safeReadStorage(STORAGE_KEYS.ADMIN_EXISTS, true);
  },

  // --------------------------------------------------------------------------
  // MEDIA LIBRARY (1.5 MB LIMIT IN DEMO MODE)
  // --------------------------------------------------------------------------
  async listMedia() {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { data, error } = await sb.storage.from(SUPABASE_BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) throw error;
      return (data || [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const { data: pub } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(f.name);
          return {
            id: f.id || f.name,
            name: f.name,
            url: pub.publicUrl,
            size: f.metadata?.size || 0,
            created_at: f.created_at
          };
        });
    }

    return safeReadStorage(STORAGE_KEYS.MEDIA, defaultMedia);
  },

  async uploadMedia(file) {
    if (!file) throw new Error('No file provided');
    const maxBytes = 1.5 * 1024 * 1024;
    if (!isSupabaseConfigured && file.size > maxBytes) {
      throw new Error('Demo mode limits image uploads to 1.5 MB. Connect Supabase Storage for larger files.');
    }

    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const ext = file.name.split('.').pop();
      const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const { error } = await sb.storage.from(SUPABASE_BUCKET).upload(cleanName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || `image/${ext}`
      });
      if (error) throw error;
      const { data: pub } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(cleanName);
      return {
        id: cleanName,
        name: cleanName,
        url: pub.publicUrl,
        size: file.size,
        created_at: new Date().toISOString()
      };
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    const mediaList = safeReadStorage(STORAGE_KEYS.MEDIA, defaultMedia);
    const newEntry = {
      id: `media-${Date.now()}`,
      name: file.name,
      url: dataUrl,
      size: file.size,
      created_at: new Date().toISOString()
    };
    mediaList.unshift(newEntry);
    safeWriteStorage(STORAGE_KEYS.MEDIA, mediaList);
    return newEntry;
  },

  async deleteMedia(idOrName) {
    if (isSupabaseConfigured) {
      const sb = await getSupabase();
      const { error } = await sb.storage.from(SUPABASE_BUCKET).remove([idOrName]);
      if (error) throw error;
      return true;
    }

    const mediaList = safeReadStorage(STORAGE_KEYS.MEDIA, defaultMedia);
    const filtered = mediaList.filter((m) => m.id !== idOrName && m.name !== idOrName);
    safeWriteStorage(STORAGE_KEYS.MEDIA, filtered);
    return true;
  },

  // --------------------------------------------------------------------------
  // RESET DEMO DATA
  // --------------------------------------------------------------------------
  async resetDemo() {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.CONTENT);
      window.localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      window.localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
      window.localStorage.removeItem(STORAGE_KEYS.MEDIA);
      window.localStorage.setItem(STORAGE_KEYS.ADMIN_EXISTS, 'true');
    } catch {}
    return true;
  }
};

export async function loadSite({ admin = false } = {}) {
  const collectionNames = Object.keys(defaultCollections);
  const [content, ...collectionLists] = await Promise.all([
    api.getContent(),
    ...collectionNames.map((name) => api.list(name, { admin }))
  ]);
  const collections = {};
  collectionNames.forEach((name, idx) => {
    collections[name] = collectionLists[idx];
  });
  return { content, collections };
}
