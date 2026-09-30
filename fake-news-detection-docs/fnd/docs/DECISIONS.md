# Decision log
Format: date | decision | reason | alternatives.

| Date | Decision | Reason | Alternatives |
|---|---|---|---|
| start | Single Python (FastAPI) backend, no Express | Avoid running two servers; simpler demo and viva | Express + Python inference service |
| start | TF-IDF + linear models first | Fast, interpretable, no GPU | BERT (later extension) |
| start | One sklearn Pipeline saved as one file | Prevents train/serve mismatch and test leakage | Separate vectorizer.joblib and model.joblib |
| start | FAKE=1, REAL=0 | Fake is the class of interest | none |
| start | Expose `fake_score`, not "confidence" | Output is an uncalibrated model score | Calibration (extension) |
