# Phase 7: Frontend (React + Vite + Tailwind)

**Goal:** a clean single-page UI that completes UC-1 with loading, error, and disclaimer states.
**Prerequisites:** Phase 6 done and the backend runs.

## Tasks
1. Scaffold: `npm create vite@latest frontend -- --template react` (JavaScript is fine; TypeScript optional). Install Tailwind CSS following its current official Vite instructions.
2. Dev proxy in `vite.config.js`: forward `/api` to `http://localhost:8000` and strip the `/api` prefix, so the browser never hits CORS in dev.
3. `frontend/src/api.js`:
   ```js
   const BASE = import.meta.env.VITE_API_URL ?? "/api";

   export async function predict(text) {
     const res = await fetch(`${BASE}/predict`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ text }),
     });
     if (!res.ok) {
       const body = await res.json().catch(() => ({}));
       const detail = Array.isArray(body.detail) ? body.detail[0]?.msg : body.detail;
       throw new Error(detail || `Request failed (${res.status})`);
     }
     return res.json();
   }
   ```
4. Components in `frontend/src/components/`:
   | Component | Behaviour |
   |---|---|
   | `NewsForm` | textarea, character counter (max 20,000), Analyze button (disabled while loading or <20 chars), Clear button, "Try a sample" buttons (2 to 3 samples you write yourself; clearly mark them as samples) |
   | `ResultCard` | big FAKE/REAL badge, "Model score" as a percentage with a small bar, the disclaimer text, model version in small print |
   | `ErrorBanner` | shows API/network errors; friendly message when the backend is unreachable |
   | `About` | short section: what the model is, dataset, its metrics from `/model-info`, limitations ("cannot verify facts; trained on specific sources; may be wrong on other kinds of news") |
5. `App.jsx` holds state: `text`, `status` (`idle | loading | success | error`), `result`, `error`. Guard against double submit and stale responses.
6. Presentation: responsive, keyboard accessible (label on textarea, focus styles), readable contrast, do not use red/green alone to convey meaning (also show the word FAKE/REAL).
7. `frontend/README.md` with `npm install` and `npm run dev`.

## Files
`frontend/**` (excluding `node_modules`).

## Definition of Done
- [ ] `npm run dev` shows the UI; a pasted article returns a result card
- [ ] Empty/short input cannot be submitted; backend errors display a readable message
- [ ] Stopping the backend shows the "service unavailable" style message, not a blank screen
- [ ] Disclaimer is visible on every result
- [ ] `npm run build` succeeds

## Pitfalls
- Do not call `localhost:8000` directly from components; go through `api.js`.
- Do not hide the score's meaning: label it "Model score", never "probability it is fake" or "confidence it is true".
- Do not add routing, auth, or state libraries.

## Concepts to meet
Fetch to JSON API, async state handling, proxy vs CORS, controlled inputs.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-07-frontend.md. Do only Phase 7. The backend is running on port 8000 and follows docs/ARCHITECTURE.md. Do not change backend code.
