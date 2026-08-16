const SESSION_STORAGE_KEY = 'adama-cctv-session';
const API_BASE = import.meta.env.VITE_API_BASE || '';

function saveActiveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function loadActiveUser() {
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    return session?.user || null;
  } catch {
    return null;
  }
}

function loadToken() {
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    return session?.token || null;
  } catch {
    return null;
  }
}

async function request(path, payload, method = 'POST') {
  const token = loadToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (payload && method !== 'GET') {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

export async function login({ identifier = '', password = '' }) {
  const data = await request('/api/users/login', { identifier, password });
  const sessionUser = {
    id: data.user.id,
    first_name: data.user.first_name,
    last_name: data.user.last_name,
    email: data.user.email,
    phone: data.user.phone,
    address: data.user.address,
    gender: data.user.gender,
    role_id: data.user.role_id,
    role: data.user.role,
  };

  saveActiveSession({ user: sessionUser, token: data.token });
  return sessionUser;
}

export async function register(payload) {
  const data = await request('/api/users/register', {
    first_name: payload.first_name,
    last_name: payload.last_name,
    gender: payload.gender,
    phone: payload.phone,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    address: payload.address,
    role_id: payload.role_id || 1,
  });

  return data.user || data;
}

export async function forgotPassword({ email = '' }) {
  const data = await request('/api/users/forgot-password', { email });
  return data;
}

export async function getCurrentUser() {
  const data = await request('/api/users/me', null, 'GET');
  return data.user;
}

export function signOut() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
