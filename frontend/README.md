# Frontend (React + Vite)

Single-page web application for the Fake News Detector.

## Development

Run from the **project root** first to start the backend:

```bash
# Terminal 1 — backend
source .venv/bin/activate
uvicorn backend.main:app --reload --port 8000
```

Then in a second terminal:

```bash
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite dev proxy forwards all `/api` requests to the backend on port 8000, so no CORS issues occur in development.

## Production build

```bash
cd frontend
npm run build
```

The compiled files will be in `frontend/dist/`.
