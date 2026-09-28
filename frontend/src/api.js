const BASE = import.meta.env.VITE_API_URL ?? '/api';

export async function predict(text) {
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = Array.isArray(body.detail) ? body.detail[0]?.msg : body.detail;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchModelInfo() {
  const res = await fetch(`${BASE}/model-info`);
  if (!res.ok) throw new Error('Could not fetch model info');
  return res.json();
}
