const config = require("../config");

async function predict(text) {
  const response = await fetch(`${config.fastapiUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.detail || `FastAPI error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

module.exports = { predict };