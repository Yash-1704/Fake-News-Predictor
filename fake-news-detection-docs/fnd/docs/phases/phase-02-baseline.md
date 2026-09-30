# Phase 2: Baseline model

**Goal:** the dumbest possible working model and honest metrics. This is your first AI result (Milestone M1).
**Prerequisites:** Phase 1 done.

## Tasks
1. Create `ml/src/pipeline.py`:
   ```python
   from sklearn.pipeline import Pipeline
   from sklearn.feature_extraction.text import TfidfVectorizer
   from sklearn.linear_model import LogisticRegression
   from ml.src import config

   def build_baseline() -> Pipeline:
       return Pipeline([
           ("tfidf", TfidfVectorizer(lowercase=True, max_features=50_000)),
           ("clf", LogisticRegression(max_iter=1000, random_state=config.RANDOM_STATE)),
       ])
   ```
2. Create `ml/src/evaluate.py` with `evaluate(y_true, y_pred) -> dict` returning accuracy, precision, recall, F1 (positive class = FAKE) and the confusion matrix as a nested list. Add `save_confusion_matrix_png(cm, path)`.
3. Create `ml/src/train_baseline.py`:
   - load ISOT via `data.py`, stratified split (`test_size=0.2`, `random_state=42`)
   - **majority-class baseline** with `DummyClassifier(strategy="most_frequent")`, report its metrics
   - fit the baseline pipeline on **train only**, evaluate on test
   - print a small table and write `ml/reports/baseline_metrics.json` and `baseline_confusion_matrix.png`
4. Run: `python -m ml.src.train_baseline`.
5. Look at the numbers. Expect a very high score (often above 98%). Write a two-line note in `PROGRESS.md`: "Is this score believable? Why or why not?" The answer is what Phase 3 investigates.

## Files
`ml/src/pipeline.py`, `ml/src/evaluate.py`, `ml/src/train_baseline.py`, `ml/reports/baseline_metrics.json`, `ml/reports/baseline_confusion_matrix.png`.

## Definition of Done
- [ ] `python -m ml.src.train_baseline` runs end to end in a few minutes on a laptop
- [ ] Output shows majority baseline and model metrics side by side
- [ ] Vectorizer is fit only inside `Pipeline.fit(X_train, y_train)`
- [ ] Metrics JSON and confusion matrix image exist

## Pitfalls
- Do not call `fit_transform` on the full dataset before splitting.
- Use `precision_score(..., pos_label=config.FAKE)`; do not rely on defaults blindly.
- Do not celebrate the score. Do not tune anything yet.

## Concepts to meet
`train_test_split`, TF-IDF, logistic regression, accuracy vs precision/recall/F1, confusion matrix, majority-class baseline.
Learn these now with the code open, then write them in `LEARNING_LOG.md` in your own words.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-02-baseline.md. Do only Phase 2. Show me the printed metrics and explain in 5 lines what TF-IDF and LogisticRegression did here.
