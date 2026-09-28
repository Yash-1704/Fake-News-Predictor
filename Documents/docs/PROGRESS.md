# Progress tracker
Update after each phase. An agent must find the first unchecked phase here.

- [x] Phase 0: Setup and skeleton
- [x] Phase 1: Data
- [x] Phase 2: Baseline model
- [x] Phase 3: Leakage and generalization check
- [x] Phase 4: Experiments
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
| In-domain F1 after leakage cleanup | 97.62% |
| Cross-dataset F1 | 69.13% |
| Final model | P2_LR (clean_text + TF-IDF unigrams + LogisticRegression) |

## Notes / blockers
- Phase 0 complete: Project root configured, virtual environment active, dependencies installed, git initialized.
- Phase 1 complete: Built `ml/src/data.py` (`load_isot()`, `load_second()`, `train_test()`), cleaned and deduplicated ISOT (39,100 rows) & Kaggle Fake/Real (6,305 rows), generated figures and `ml/reports/eda_summary.md` with empirical artifact leakage counts.
- Phase 2 complete: Trained TF-IDF + LogisticRegression baseline model on ISOT. Reached 98.25% accuracy and 98.07% F1 score (vs 54.21% majority baseline accuracy).
- Is this 98.07% score believable? No. The unnaturally high score is driven by publisher-specific text artifacts like `(Reuters)` and `"via"` in ISOT text, which Phase 3 will test and strip.
- Phase 3 complete: Created `clean_text` to strip publisher artifacts (`(Reuters)`, `via`, `featured image`, URLs). Baseline model evaluated on a completely unseen Kaggle dataset dropped from ~98% F1 to ~69% F1, proving the model was relying heavily on spurious correlations and publisher artifacts rather than true language semantics.
- Phase 4 complete: Evaluated 12 preprocessing/classifier combinations on 5-fold CV, held-out test split, and cross-dataset benchmark. `P2_LR` selected as the final model pipeline (Cross-dataset F1: 69.13%, CV F1: 97.70%, Test F1: 97.62%, native `predict_proba`).
- Next: Phase 5 (Final model training, serialization to `pipeline.joblib`, model card generation, and prediction module).



