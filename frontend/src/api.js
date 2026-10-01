const BASE = import.meta.env.VITE_API_URL ?? '/api';
const ML_BASE = (import.meta.env.VITE_ML_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

async function request(path, options = {}, { allowFailure = false } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok && !allowFailure) {
    const message =
      typeof data === 'string'
        ? data
        : data?.detail || data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function predict(text) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function factCheck(text) {
  return request('/factcheck', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function webSearchFactCheck(text) {
  return request('/factcheck/websearch', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function getNews(topic = '', options = {}) {
  const query = new URLSearchParams();
  if (topic.trim()) query.set('topic', topic.trim());
  const suffix = query.size ? `?${query.toString()}` : '';
  return request(`/news${suffix}`, { method: 'GET', signal: options.signal });
}

export async function getCurrentUser() {
  const data = await request('/auth/me', { method: 'GET' }, { allowFailure: true });
  if (!data || data.user === null) return null;
  return data.email ? {
    email: data.email,
    displayName: data.displayName || '',
    profileImageUrl: data.profileImageUrl || '',
    emailOptIn: data.emailOptIn ?? true,
    isPremiumMember: data.isPremiumMember ?? false,
    webSearchUsageCount: data.webSearchUsageCount ?? 0,
    webSearchFreeLimit: data.webSearchFreeLimit ?? 5,
  } : null;
}

export async function updateEmailOptIn(emailOptIn) {
  const data = await request('/auth/email-opt-in', {
    method: 'POST',
    body: JSON.stringify({ emailOptIn }),
  });

  return {
    email: data.email,
    emailOptIn: data.emailOptIn ?? true,
  };
}

export async function updateProfile(profile) {
  return request('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  });
}

export async function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password, profile = {}) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...profile }),
  });
}

export async function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

export async function fetchModelInfo({ signal } = {}) {
  // Express has no model-info proxy route; this metadata endpoint belongs to FastAPI.
  const response = await fetch(`${ML_BASE}/model-info`, { signal });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || `Could not fetch model info (${response.status})`);
  }

  return data;
}
