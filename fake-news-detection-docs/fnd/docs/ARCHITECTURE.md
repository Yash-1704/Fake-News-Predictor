# Architecture and contracts

## Overview
```text
React (Vite, :5173) --HTTP JSON--> FastAPI (:8000) --> ml.src.predict --> pipeline.joblib
                                                         (Pipeline: clean_text -> TF-IDF -> classifier)
```
Training is offline and separate from serving:
```text
raw CSVs -> ml/src/data.py -> train/test split -> Pipeline.fit(train) -> evaluate(test) -> save pipeline.joblib + model_card.json
```

## Module responsibilities
| Path | Responsibility |
|---|---|
| `ml/src/config.py` | Paths, label constants, `RANDOM_STATE`, text limits. Single source of truth. |
| `ml/src/data.py` | Load + harmonize datasets into columns `content` (str) and `label` (int, FAKE=1). |
| `ml/src/preprocess.py` | `clean_text(str) -> str` used **inside** the Pipeline. |
| `ml/src/pipeline.py` | `build_pipeline(...)` returns an unfitted sklearn Pipeline. |
| `ml/src/evaluate.py` | Metrics, confusion matrix, top features helpers. |
| `ml/src/train.py` | Final training entry point; saves artifact + model card. |
| `ml/src/predict.py` | `Predictor` class: load once, `predict(text) -> dict`. Used by the backend. |
| `backend/` | HTTP layer only. No ML logic. Calls `Predictor`. |
| `frontend/` | UI only. Talks to the backend over HTTP. |

## Why a single Pipeline
Cleaning, vectorizer and classifier are saved as one object, so serving is guaranteed to transform text exactly as training did, and the vectorizer can never be fit on test data by accident.

Because `clean_text` is pickled by reference, the backend must import it from the same module path (`ml.src.preprocess`). Run the backend from the repo root: `uvicorn backend.main:app`.

## Label contract
`FAKE = 1`, `REAL = 0`. Positive class is FAKE. Report precision/recall for FAKE explicitly. Defined in `ml/src/config.py`; never hardcode 0/1 elsewhere.

## Dataset schema (after `data.py`)
| Column | Type | Notes |
|---|---|---|
| `content` | str | title + " " + text |
| `label` | int | 1 = FAKE, 0 = REAL |
| `source_dataset` | str | e.g. `isot`, `second` |

## API contract
### `GET /health`
`200 {"status": "ok", "model_loaded": true}`

### `GET /model-info`
`200` returns the contents of `model_card.json`. `503` if no model.

### `POST /predict`
Request:
```json
{ "text": "Article headline and body..." }
```
Response `200`:
```json
{
  "label": "FAKE",
  "fake_score": 0.87,
  "model_version": "2026-10-01-lr-v1",
  "disclaimer": "Automated model prediction based on writing patterns; not a fact-check."
}
```
- `fake_score` is the classifier's output probability for class FAKE. It is an **uncalibrated model score**, not a real-world probability. The UI labels it "Model score".
- `label` is `FAKE` if `fake_score >= 0.5` else `REAL`.

Errors (all `{"detail": "..."}`):
| Status | When |
|---|---|
| 422 | Validation failed (empty, <20 chars trimmed, >20,000 chars, wrong type) |
| 503 | Model file missing or failed to load |
| 500 | Unexpected prediction error (logged server-side, generic message to client) |

## Model card (`ml/models/model_card.json`)
```json
{
  "model_version": "...",
  "trained_at": "ISO date",
  "dataset": "isot (+ names of others)",
  "n_train": 0, "n_test": 0,
  "classifier": "LogisticRegression",
  "params": {},
  "metrics_in_domain": {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0},
  "metrics_cross_dataset": {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0},
  "sklearn_version": "x.y.z",
  "python_version": "3.x"
}
```

## Ports and environment
- Backend `:8000`, frontend `:5173`.
- Dev: Vite proxies `/api` to `http://localhost:8000` (strip `/api`), and the backend also enables CORS for `http://localhost:5173`.
- Frontend config: `VITE_API_URL` (default `/api`).
