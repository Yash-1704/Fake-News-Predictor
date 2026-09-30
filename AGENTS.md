# AGENTS.md: rules for AI coding agents

> **Path note**: Planning documents are inside `Documents/` (e.g. `Documents/docs/PROGRESS.md`, `Documents/docs/phases/phase-00-setup.md`). All code paths (`ml/`, `backend/`, `frontend/`, `tests/`) are relative to the project root.

You are helping build a Fake News Detection app (React + FastAPI + scikit-learn). The human is a student learning while building. Optimise for **working, verifiable, understandable** code.

## Read order (every new session)
1. This file
2. `Documents/docs/ARCHITECTURE.md` (contracts you must not break)
3. `Documents/docs/PROGRESS.md` (find the current phase)
4. The current phase file in `Documents/docs/phases/`
Read `Documents/docs/SRS.md` only if a requirement is unclear.

## Working rules
- **One phase at a time.** Do not start, stub, or "prepare" future phases. Do not refactor finished phases unless the current phase says so.
- Stay inside the files listed under the phase's "Files" section. If you need another file, say why first.
- Follow the phase's **Definition of Done**. Run the listed verification commands and show their real output. Never claim success without running them.
- **Never invent metrics.** All numbers in reports and docs must come from code you ran. If something can't be run, say so.
- Run Python from the repo root. Use module form: `python -m ml.src.train`.
- Add a dependency only if needed; add it to `requirements.txt` with a one-line reason in `Documents/docs/DECISIONS.md`.
- Do not commit datasets, `.venv`, `node_modules`, or `.env`. Model artifacts are gitignored; `model_card.json` and `ml/reports/` are committed.
- Fixed `random_state=42` everywhere. Fit anything (vectorizer, scalers) on **training data only**.
- Keep code small, typed where cheap, with short docstrings. No clever abstractions.
- If the phase file conflicts with reality (dataset differs, library API changed), stop and ask the human, then record the decision in `Documents/docs/DECISIONS.md`.

## Teaching rule (the human is learning)
At the end of each phase, append 5 to 10 lines to `Documents/docs/LEARNING_LOG.md`: which concepts appeared in the code, each explained in one or two plain sentences, plus one question the human should be able to answer in a viva.
When you write non-obvious code (TF-IDF settings, pipeline, CORS), add a comment saying *why*.

## Contracts (never change without a `DECISIONS.md` entry)
- Label encoding: `FAKE = 1`, `REAL = 0` (defined once in `ml/src/config.py`).
- Model artifact: a single sklearn `Pipeline` saved to `ml/models/pipeline.joblib`.
- API: `POST /predict` request/response defined in `Documents/docs/ARCHITECTURE.md`.

## End-of-phase checklist
- [ ] Definition of Done items all verified
- [ ] `Documents/docs/PROGRESS.md` ticked
- [ ] `Documents/docs/LEARNING_LOG.md` updated
- [ ] Any decisions logged in `Documents/docs/DECISIONS.md`
- [ ] Suggested commit message given to the human

## Agent-human protocol
After every step or group of steps, reply in exactly this format:
- DONE: what you did (files created/changed, commands run, real results), short bullets.
- YOUR TURN: only if I must act. Numbered steps, each with
  (a) where: which terminal/folder or app,
  (b) the exact command or click path,
  (c) what I should see if it worked,
  (d) what to do if it doesn't.
  If nothing is needed, write "Nothing needed from you."
- NEXT: what you'll do after I confirm.
Rules:
- Never claim I did something you haven't seen me confirm.
- Stop and wait whenever something needs me (installing software, creating or activating the venv, pip install, git commits, downloading datasets, logins). Give me the exact commands and I'll run them and paste back the output.
- When an ML concept first appears in code, explain it in 2 to 3 plain sentences and name the Learning.md section (e.g. "Learning.md 4.3") instead of pasting documentation.
- Ask a question only when you are blocked.
- At the end of each phase: tick docs/PROGRESS.md, add a 3 to 5 line handoff note under "Notes / blockers" (what's done, what's next, anything odd), and prompt me to write my own entry in docs/LEARNING_LOG.md (don't write it for me).
## Extension phases (10–15)
See docs/TWO_DAY_PLAN.md and docs/ARCHITECTURE_EXT.md. Read order for these
phases: TWO_DAY_PLAN.md → ARCHITECTURE_EXT.md → the current phase file.
Do not read the Phase 0–9 ML phase files unless a task touches ml/ or backend/.


