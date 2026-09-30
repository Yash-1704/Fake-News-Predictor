# Progress tracker

Update after each phase. An agent must find the first unchecked phase here.

- [x] Phase 0: Setup and skeleton
- [x] Phase 1: Data
- [x] Phase 2: Baseline model
- [x] Phase 3: Leakage and generalization check
- [x] Phase 4: Experiments
- [x] Phase 5: Final model and prediction module
- [x] Phase 6: Backend API

- [x] Phase 7: Frontend
- [x] Phase 8: Integration and hardening
- [x] Phase 9: Docs, results, viva
- [x] Phase 10: Node/Express + MongoDB setup
- [x] Phase 11: Auth
- [x] Phase 12: News feed
- [x] Phase 13: Fact-check (Groq)
- [x] Phase 14: Frontend integration
- [x] Phase 15: Weekly email (optional, cut first if short on time)

## Key numbers (fill from real runs)

| Item                               | Value                                                     |
| ---------------------------------- | --------------------------------------------------------- | ------------- |
| Dataset(s) used                    | ISOT Fake News & Kaggle Fake/Real News                    |
| Rows after cleaning                | ISOT: 39,100                                              | Kaggle: 6,305 |
| Majority-class baseline accuracy   | 54.21%                                                    |
| Baseline in-domain F1              | 98.07%                                                    |
| In-domain F1 after leakage cleanup | 97.62%                                                    |
| Cross-dataset F1                   | 69.13%                                                    |
| Final model                        | P2_LR (clean_text + TF-IDF unigrams + LogisticRegression) |

## Notes / blockers

- Phase 0 complete: Project root configured, virtual environment active, dependencies installed, git initialized.
- Phase 1 complete: Built `ml/src/data.py` (`load_isot()`, `load_second()`, `train_test()`), cleaned and deduplicated ISOT (39,100 rows) & Kaggle Fake/Real (6,305 rows), generated figures and `ml/reports/eda_summary.md` with empirical artifact leakage counts.
- Phase 2 complete: Trained TF-IDF + LogisticRegression baseline model on ISOT. Reached 98.25% accuracy and 98.07% F1 score (vs 54.21% majority baseline accuracy).
- Is this 98.07% score believable? No. The unnaturally high score is driven by publisher-specific text artifacts like `(Reuters)` and `"via"` in ISOT text, which Phase 3 will test and strip.
- Phase 3 complete: Created `clean_text` to strip publisher artifacts (`(Reuters)`, `via`, `featured image`, URLs). Baseline model evaluated on a completely unseen Kaggle dataset dropped from ~98% F1 to ~69% F1, proving the model was relying heavily on spurious correlations and publisher artifacts rather than true language semantics.
- Phase 4 complete: Evaluated 12 preprocessing/classifier combinations on 5-fold CV, held-out test split, and cross-dataset benchmark. `P2_LR` selected as the final model pipeline (Cross-dataset F1: 69.13%, CV F1: 97.70%, Test F1: 97.62%, native `predict_proba`).
- Phase 5 complete: Added `build_final_pipeline()`, implemented `ml/src/train.py`, serialized `ml/models/pipeline.joblib` and `ml/models/model_card.json`, built `Predictor` class in `ml/src/predict.py`, verified with unit and subprocess tests in `tests/test_predict.py` (5/5 passed).
- Phase 6 complete: Implemented FastAPI backend service (`backend/python/main.py`, `backend/python/schemas.py`, `backend/python/README.md`) with `/health`, `/model-info`, `/predict`, CORS, lifespan model loading, Pydantic validation, and comprehensive tests in `tests/test_api.py` (16/16 total repo tests passed).
- Phase 7 complete: Scaffolded React + Vite frontend (`frontend/`), added `/api` proxy to Vite config, implemented `api.js`, `NewsForm`, `ResultCard`, `ErrorBanner`, and `About` components. Premium dark-theme CSS. `npm run build` passes (227 kB JS, 6.7 kB CSS). API proxy verified via curl.
- Next: Phase 8 (Integration and hardening).
- Phase 8 dependency snapshot regenerated with `.venv/bin/pip freeze`; required FastAPI, Uvicorn, scikit-learn, pandas, Pydantic, pytest, and httpx pins are present.
- Phase 8 README now documents the venv setup, both Kaggle dataset links, exact gitignored CSV paths, recorded license wording, fresh-clone training, `npm install`, and `bash scripts/dev.sh`.
- Phase 8 consistency check is present for five fixed texts and compares Predictor/API labels and scores; covered by the passing test suite.
- Phase 8 request middleware logs path, method, status, and latency without formatting or logging request/article text.
- Phase 8 manual matrix in `Documents/TESTING.md` records the clean-room run and the requested cases; the browser limit case was hardened and all cases passed.
- Phase 8 Python verification after dependency regeneration: `.venv/bin/python -m pytest -q` passed (17 tests; one Starlette/httpx deprecation warning).
- Phase 8 clean-room rerun passed using user-approved copies of the three raw CSVs at the README paths; venv dependencies, frontend install/build, training, and both-server startup succeeded.
- Phase 8 clean-room model-card metric dictionaries exactly match the working tree: in-domain and cross-dataset accuracy, precision, recall, and F1 are identical.
- Phase 8 over-limit form hardening removes silent truncation; 20,001 characters now show a red counter and maximum-length hint and disable Analyse. API rejects 20,001 characters with HTTP 422.
- Phase 8 clean-room suite: `.venv/bin/python -m pytest -q` passed (17 tests; one Starlette/httpx deprecation warning); frontend builds passed in both worktrees.
- Phase 8 clean-room missing-model check passed on 2026-09-28: `/health` reported `model_loaded: false`, `/predict` returned 503, and the UI showed its model-unavailable message; servers were stopped afterward.
- Phase 8 clean-room backend-stopped check passed: Vite remained available and the UI displayed the friendly backend connection error.
- Phase 8 temporary clone, including copied datasets and generated model, was removed after verification; no datasets or model files were added to the worktree.

### Phase 8 handoff

- Phase 8 integration and hardening is complete; clean-room startup was verified using the approved local CSV copy procedure.
- All five requested manual cases passed; the clean-room model-card metrics match the working model card exactly.
- The temporary clean-room folder and its generated artifacts were removed; next phase is Phase 9.
- Human: add your own Phase 8 entry to `Documents/LEARNING_LOG.md`.

- Phase 9 completion confirmed by the human: viva answers and two independent demo runs are complete.

### Phase 10 handoff

- Phase 10 complete: added the Express server, FastAPI prediction proxy, MongoDB Check upsert, and server environment configuration.
- `npm run dev` connected to MongoDB; the prediction route returned the FastAPI response with HTTP 200 and persisted a Check document.
- Repeating the same article incremented `checkCount` from 1 to 2; with FastAPI stopped, the route returned a JSON error with HTTP 502.
- Next: Phase 11 (auth).
- Human: add your own Phase 10 entry to `Documents/LEARNING_LOG.md`.

### Phase 11 handoff

- Phase 11 complete: implemented JWT cookie auth with `register`, `login`, `logout`, and `/me` routes plus global `attachUserIfPresent` middleware.
- Verified via curl: registration returned 201, duplicate registration returned 409, wrong password returned 401 with the same message as a bad login, `/me` returned the user with a valid cookie and `{user:null}` without one, and guest `/api/predict` still returned HTTP 200.
- Passwords are stored as bcrypt hashes and the cookie is cleared by logout; no plaintext credentials were logged.
- Next: Phase 12 (news feed).

### Phase 12 handoff

- Phase 12 complete: added a cached news feed backed by MongoDB, a GNews refresh job, and a React page that renders live headlines.
- Verified with curl: `/api/news` returned a real JSON list with `items`, and `/api/news?topic=elections` returned topic-specific cached results with HTTP 200.
- The server refresh job runs on startup and every 2 hours, and the route caches topic misses instead of calling GNews on every request.
- Next: Phase 13 (fact-check).

### Phase 13 handoff

- Phase 13 complete: added a cached, protected fact-check route backed by Groq and MongoDB, with a stable SHA-256 dedupe key and graceful unavailable fallback.
- Verified with live API checks: unauthenticated POST returned HTTP 401, a valid cookie returned a verdict/explanation, and a second identical submission returned `cached: true` without rerunning Groq.
- The parser tolerates malformed model output and falls back to an `unverifiable` verdict instead of crashing, and the forced-error path returned the required `{verdict:"unavailable", ...}` payload.
- Real Groq output was confirmed with a working model (`qwen/qwen3.8-27b`); the previous default model name was invalid for this account.
- Next: Phase 14 (frontend integration).

### Phase 14 handoff

- Phase 14 complete: the React app now talks to Express instead of FastAPI, keeps the user session via cookie-backed auth state, and gates fact-checking behind login while keeping guest NLP predictions available.
- Verified by build: `npm run build` in `frontend/` succeeded; the new login/register views and fact-check panel compiled without JSX or import errors.
- Logged-out users now see the fact-check action disabled with a prompt to log in, and logged-in users get a verdict panel with explanation and source list plus the required disclaimer.
- Next: Phase 15 (optional weekly email).

### Phase 15 handoff

- Phase 15 complete: added the weekly digest job, SMTP mailer, admin trigger route, and a cookie-backed email opt-in toggle in the user nav.
- Verified with live backend checks: a registered user could hit `/api/admin/run-digest` successfully and the server returned `{"sent":0,"skipped":0,"reason":"SMTP credentials missing"}` instead of crashing when Gmail credentials were absent.
- The digest flow is implemented and verified with SMTP; `SMTP_USER` and `SMTP_APP_PASSWORD` are configured in the ignored root `.env`, and opted-out users are skipped.
- Live SMTP send verified after credentials were added: `/api/admin/run-digest` returned HTTP 200 with `{"sent":4,"skipped":0}`.
- Human: add your own Phase 15 entry to `Documents/LEARNING_LOG.md`.
