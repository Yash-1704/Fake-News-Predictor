# Frontend (React + Vite)

Single-page web application for the Fake News Detector.

## Development

Run from the **project root** first to start the backend:

```bash
# Terminal 1 — all services
source .venv/bin/activate
bash scripts/dev.sh
```

Or run only the frontend separately:

```bash
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Vite forwards `/api` requests to Express on port 4000; Express uses FastAPI on port 8000 for model predictions.

## Production build

```bash
cd frontend
npm run build
```

The compiled files will be in `frontend/dist/`.
