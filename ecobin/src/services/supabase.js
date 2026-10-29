/**
 * EcoBin Supabase Client Integration Layer
 * Connects to live Supabase project when credentials exist,
 * with seamless fallback to persistent LocalStorage/IndexedDB store.
 */

// User can set these or specify via environment / runtime settings
export const SUPABASE_CONFIG = {
  url: window.__ECOBIN_SUPABASE_URL__ || localStorage.getItem('ecobin_supabase_url') || '',
  anonKey: window.__ECOBIN_SUPABASE_KEY__ || localStorage.getItem('ecobin_supabase_key') || '',
  isConfigured() {
    return Boolean(this.url && this.anonKey && this.url.startsWith('https://'));
  }
};

/**
 * Configure live Supabase credentials at runtime
 */
export function configureSupabase(url, anonKey) {
  SUPABASE_CONFIG.url = url;
  SUPABASE_CONFIG.anonKey = anonKey;
  localStorage.setItem('ecobin_supabase_url', url);
  localStorage.setItem('ecobin_supabase_key', anonKey);
}

/**
 * Supabase Auth API bridge
 */
export const supabaseAuth = {
  async signUp({ email, password, metadata }) {
    if (SUPABASE_CONFIG.isConfigured()) {
      try {
        const res = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_CONFIG.anonKey
          },
          body: JSON.stringify({ email, password, data: metadata })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error_description || 'Signup failed');
        return { user: data.user, session: data.session, error: null };
      } catch (err) {
        return { user: null, session: null, error: err.message };
      }
    }
    // Fallback handled by local auth service
    return { user: null, session: null, error: 'SUPABASE_NOT_CONFIGURED' };
  },

  async signInWithPassword({ email, password }) {
    if (SUPABASE_CONFIG.isConfigured()) {
      try {
        const res = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_CONFIG.anonKey
          },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error_description || data.message || 'Login failed');
        return { user: data.user, session: data, error: null };
      } catch (err) {
        return { user: null, session: null, error: err.message };
      }
    }
    return { user: null, session: null, error: 'SUPABASE_NOT_CONFIGURED' };
  }
};
