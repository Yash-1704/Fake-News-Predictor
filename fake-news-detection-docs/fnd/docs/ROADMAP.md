# Roadmap

Build outside-in: get a working baseline early, then learn each concept when the code demands it. Each phase ends with something runnable and verifiable.

| # | Phase | Output you can see | Est. time | Depends on |
|---|---|---|---|---|
| 0 | Setup and skeleton | Repo, venv, imports work | 0.5 day | none |
| 1 | Data | Clean dataset + EDA report | 1 to 2 days | 0 |
| 2 | Baseline model | First metrics vs majority baseline | 1 day | 1 |
| 3 | Leakage and generalization check | Top features, cleaned text, cross-dataset score | 1 to 2 days | 2 |
| 4 | Experiments | Comparison table, CV, error analysis | 2 to 3 days | 3 |
| 5 | Final model and prediction module | `pipeline.joblib`, `Predictor` | 1 day | 4 |
| 6 | Backend API | Working `/predict` + tests | 1 to 2 days | 5 |
| 7 | Frontend | Working UI | 2 days | 6 |
| 8 | Integration and hardening | Full run from README, tests | 1 day | 7 |
| 9 | Docs, results, viva | README, figures, PPT outline | 2 days | 8 |

About 12 to 16 working days total. Compress by shrinking Phase 4; do not skip Phase 3.

## Milestones
- **M1 (end of Phase 2):** first AI result exists.
- **M2 (end of Phase 3):** the result is credible.
- **M3 (end of Phase 5):** the model is a reusable artifact.
- **M4 (end of Phase 7):** the demo works end to end.
- **M5 (end of Phase 9):** submission-ready.

## Working with agents
- One phase per agent session. Paste the "Kickoff prompt" from the phase file.
- Review the agent's diff and run the verification commands yourself. Never merge unverified.
- Commit after each phase: `phase-N: short description`.
- When an agent drifts, stop it and restate: "Only do what phase-0N says."
- Do these yourself (important for the viva): read every metric printout, write your own answers in `LEARNING_LOG.md`, and read the Phase 3 top-features output.

## Scope guard
Out of scope until Phase 9 is done: BERT/transformers, fact-check APIs, databases, auth, deployment, scraping, multilingual.
