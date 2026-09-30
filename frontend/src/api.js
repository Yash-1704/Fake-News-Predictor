const BASE = import.meta.env.VITE_API_URL ?? '/api';

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
    throw new Error(message);
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

export async function getCurrentUser() {
  const data = await request('/auth/me', { method: 'GET' }, { allowFailure: true });
  if (!data || data.user === null) return null;
  return data.email ? { email: data.email, emailOptIn: data.emailOptIn ?? true } : null;
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

export async function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

export async function fetchModelInfo() {
  const data = await request('/model-info', { method: 'GET' }, { allowFailure: true });
  if (!data) throw new Error('Could not fetch model info');
  return data;
}
