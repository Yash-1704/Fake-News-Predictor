# AGENTS.md: rules for AI coding agents

You are helping build a Fake News Detection app (React + FastAPI + scikit-learn). The human is a student learning while building. Optimise for **working, verifiable, understandable** code.

## Read order (every new session)
1. This file
2. `docs/ARCHITECTURE.md` (contracts you must not break)
3. `docs/PROGRESS.md` (find the current phase)
4. The current phase file in `docs/phases/`
5. `docs/WEEK_PLAN.md` (the schedule and cuts; it wins over a phase file where they conflict)
Read `docs/SRS.md` only if a requirement is unclear.

## Working rules
- **One phase at a time.** Do not start, stub, or "prepare" future phases. Do not refactor finished phases unless the current phase says so.
- Stay inside the files listed under the phase's "Files" section. If you need another file, say why first.
- Follow the phase's **Definition of Done**. Run the listed verification commands and show their real output. Never claim success without running them.
- **Never invent metrics.** All numbers in reports and docs must come from code you ran. If something can't be run, say so.
- Run Python from the repo root. Use module form: `python -m ml.src.train`.
- Add a dependency only if needed; add it to `requirements.txt` with a one-line reason in `docs/DECISIONS.md`.
- Do not commit datasets, `.venv`, `node_modules`, or `.env`. Model artifacts are gitignored; `model_card.json` and `ml/reports/` are committed.
- Fixed `random_state=42` everywhere. Fit anything (vectorizer, scalers) on **training data only**.
- Keep code small, typed where cheap, with short docstrings. No clever abstractions.
- If the phase file conflicts with reality (dataset differs, library API changed), stop and ask the human, then record the decision in `docs/DECISIONS.md`.

## Teaching rule (the human is learning)
At the end of each phase, append 5 to 10 lines to `docs/LEARNING_LOG.md`: which concepts appeared in the code, each explained in one or two plain sentences, plus one question the human should be able to answer in a viva.
When you write non-obvious code (TF-IDF settings, pipeline, CORS), add a comment saying *why*.

## Contracts (never change without a `DECISIONS.md` entry)
- Label encoding: `FAKE = 1`, `REAL = 0` (defined once in `ml/src/config.py`).
- Model artifact: a single sklearn `Pipeline` saved to `ml/models/pipeline.joblib`.
- API: `POST /predict` request/response defined in `docs/ARCHITECTURE.md`.

## End-of-phase checklist
- [ ] Definition of Done items all verified
- [ ] `docs/PROGRESS.md` ticked
- [ ] `docs/LEARNING_LOG.md` updated
- [ ] Any decisions logged in `docs/DECISIONS.md`
- [ ] Suggested commit message given to the human
