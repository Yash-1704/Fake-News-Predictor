#!/usr/bin/env bash
# Helper script to start backend and frontend dev servers concurrently

trap 'kill 0' EXIT

echo "Starting FastAPI backend on http://localhost:8000..."
.venv/bin/uvicorn backend.main:app --port 8000 &

echo "Starting Vite React frontend on http://localhost:5173..."
(cd frontend && npm run dev) &

wait
