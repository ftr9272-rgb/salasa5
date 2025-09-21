export function getToken() {
  // Prefer Authorization Bearer token stored in localStorage by login flow
  try {
    return localStorage.getItem('token') || null;
  } catch { 
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch (e) { void e; /* ignore storage errors */ }
}

export function clearToken() {
  try { localStorage.removeItem('token'); } catch (e) { void e; /* ignore */ }
}

export async function apiFetch(path, options = {}) {
  // Determine API base URL:
  // - If `import.meta.env.VITE_API_BASE` is set use it (explicit override)
  // - If running under Vite dev (`import.meta.env.DEV`) use the local backend default
  // - Otherwise (built app served from backend) use the same origin so requests go to the host serving the UI
  let API_BASE;
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
      API_BASE = import.meta.env.VITE_API_BASE;
    } else if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      API_BASE = 'http://127.0.0.1:5000';
    } else if (typeof window !== 'undefined' && window.location) {
      API_BASE = window.location.origin;
    } else {
      API_BASE = 'http://127.0.0.1:5000';
    }
  } catch (_e) {
    API_BASE = 'http://127.0.0.1:5000';
  }
  const resolvedPath = (typeof path === 'string' && path.startsWith('/api')) ? API_BASE + path : path;
  const token = getToken();
  const headers = options.headers || {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Debug logging in development to help diagnose 401s and header issues
  try {
    // Vite exposes `import.meta.env.DEV` in dev mode
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.debug('[apiFetch] request', { path, token: token ? '<<present>>' : null, headers });
    }
  } catch (_ignore) {
    void _ignore;
    // ignore when import.meta not available in some environments
  }
  // If the caller passed a plain object as body (not FormData/Blob/URLSearchParams),
  // send it as JSON and set Content-Type accordingly. If body is already a string
  // or FormData (used for file uploads) or URLSearchParams, leave it alone.
  let body = options.body;
  const isPlainObject = body && typeof body === 'object'
    && !(body instanceof FormData)
    && !(body instanceof Blob)
    && !(body instanceof URLSearchParams)
    && !(body instanceof ArrayBuffer)
    && !(ArrayBuffer.isView && ArrayBuffer.isView(body));

  if (isPlainObject && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
    try {
      body = JSON.stringify(body);
    } catch (err) {
      // If stringify fails, let fetch handle it and surface a readable error
      console.error('Failed to stringify request body for', path, err);
    }
  }

  // perform request with a single retry on 401 after attempting refresh
  let res = await fetch(resolvedPath, { ...options, headers, body });
  if (res.status === 401) {
    // try refresh token if endpoint exists
    try {
      const refreshResp = await fetch(API_BASE + '/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (refreshResp.ok) {
        const refreshData = await refreshResp.json();
        if (refreshData && refreshData.token) {
          setToken(refreshData.token);
          headers['Authorization'] = `Bearer ${refreshData.token}`;
          res = await fetch(resolvedPath, { ...options, headers, body });
        }
      }
    } catch (err) {
      void err; // ignore refresh failures; we'll handle below
    }
  }

  if (!res.ok) {
    const txt = await res.text();
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.debug('[apiFetch] response error', { path, status: res.status, body: txt });
      }
    } catch (_ignore) { void _ignore; /* ignore */ }
    // if 401, clear token and redirect to login page (best-effort)
    if (res.status === 401) {
      clearToken();
      try { window.location.href = '/auth'; } catch (e) { void e; /* ignore when not in browser */ }
    }
    throw new Error(`${res.status} ${txt}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}
