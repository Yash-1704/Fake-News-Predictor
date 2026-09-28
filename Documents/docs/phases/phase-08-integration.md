# Phase 8: Integration and hardening

**Goal:** the whole system runs from a clean checkout using only the README, and behaves well on bad input (Milestone M4).
**Prerequisites:** Phase 7 done.

## Tasks
1. **Clean-room test:** clone the repo into a new folder (or delete `.venv` and `node_modules`), then follow the README exactly. Fix every step that fails. Record the exact commands.
2. Add convenience scripts (pick what suits your OS): a `Makefile` or `scripts/dev.sh` / `scripts/dev.ps1` that starts backend and frontend. Keep simple.
3. **Consistency check:** create `tests/test_consistency.py` that predicts 5 fixed sample texts via `Predictor` directly and via the API (`TestClient`), asserting the same label and score.
4. **Manual test matrix**, recorded in `docs/TESTING.md` with pass/fail and date:
   | Case | Expected |
   |---|---|
   | normal article paste | result card |
   | headline only (short but >=20 chars) | result, with the UI hinting that short text is less reliable |
   | <20 chars | disabled/validation message |
   | 20,001 chars | blocked message |
   | non-English text | works without crashing (quality not guaranteed; note it in About) |
   | HTML/emoji/newlines/quotes | no crash |
   | backend stopped | friendly error |
   | model file missing | `/health` shows `model_loaded:false`, `/predict` returns 503 and UI message is clear |
5. Add basic server logging (request path, status, latency; **do not log article text**).
6. Pin key versions in `requirements.txt` (`pip freeze` for scikit-learn, pandas, numpy, fastapi, uvicorn, pydantic).
7. Optional if time remains: a `Dockerfile` or Streamlit fallback. Skip if behind schedule.

## Files
`README.md` (quick start finalized), `scripts/*`, `tests/test_consistency.py`, `docs/TESTING.md`, `requirements.txt`.

## Definition of Done
- [ ] Clean-room setup works following README only
- [ ] `pytest` all green
- [ ] Every row of the test matrix has a result in `TESTING.md`
- [ ] No article text appears in logs

## Concepts to meet
End-to-end testing, reproducibility, dependency pinning, logging and privacy.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-08-integration.md. Do only Phase 8. Start with the clean-room test and report every failing step before fixing.
