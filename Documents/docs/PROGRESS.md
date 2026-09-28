# Progress tracker
Update after each phase. An agent must find the first unchecked phase here.

- [x] Phase 0: Setup and skeleton
- [x] Phase 1: Data
- [x] Phase 2: Baseline model
- [ ] Phase 3: Leakage and generalization check
- [ ] Phase 4: Experiments
- [ ] Phase 5: Final model and prediction module
- [ ] Phase 6: Backend API
- [ ] Phase 7: Frontend
- [ ] Phase 8: Integration and hardening
- [ ] Phase 9: Docs, results, viva

## Key numbers (fill from real runs)
| Item | Value |
|---|---|
| Dataset(s) used | ISOT Fake News & Kaggle Fake/Real News |
| Rows after cleaning | ISOT: 39,100 | Kaggle: 6,305 |
| Majority-class baseline accuracy | 54.21% |
| Baseline in-domain F1 | 98.07% |
| In-domain F1 after leakage cleanup | |
| Cross-dataset F1 | |
| Final model | |

## Notes / blockers
- Phase 0 complete: Project root configured, virtual environment active, dependencies installed, git initialized.
- Phase 1 complete: Built `ml/src/data.py` (`load_isot()`, `load_second()`, `train_test()`), cleaned and deduplicated ISOT (39,100 rows) & Kaggle Fake/Real (6,305 rows), generated figures and `ml/reports/eda_summary.md` with empirical artifact leakage counts.
- Phase 2 complete: Trained TF-IDF + LogisticRegression baseline model on ISOT. Reached 98.25% accuracy and 98.07% F1 score (vs 54.21% majority baseline accuracy).
- Is this 98.07% score believable? No. The unnaturally high score is driven by publisher-specific text artifacts like `(Reuters)` and `"via"` in ISOT text, which Phase 3 will test and strip.
- Next: Phase 3 (Leakage cleanup and cross-dataset generalization check).


