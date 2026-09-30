# Software Requirements Specification: Fake News Detection Using NLP

## 1. Introduction

### 1.1 Purpose

Defines the requirements for a web application that classifies a news headline/article as FAKE or REAL using NLP and machine learning.

### 1.2 Scope

The system accepts news text, preprocesses it, extracts TF-IDF features, classifies it with a trained model, and shows the result in a web UI. It is a **text classifier**, not a fact-checking engine: it does not verify claims, sources, or authors.

### 1.3 Definitions

| Term                     | Meaning                                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| NLP                      | Natural Language Processing                                                                                       |
| TF-IDF                   | Term Frequency-Inverse Document Frequency, a numeric weighting of words in a document                             |
| Pipeline                 | scikit-learn object chaining cleaning, vectorizer and classifier into one fit/predict unit                        |
| Data leakage             | Information in training data that reveals the label through artifacts (e.g. source names) rather than real signal |
| Cross-dataset evaluation | Training on dataset A, testing on dataset B                                                                       |
| MVP                      | Minimum viable product: the smallest complete working system                                                      |

### 1.4 References

scikit-learn docs, FastAPI docs, React docs, ISOT Fake News Dataset (University of Victoria).

## 2. Overall description

### 2.1 Product perspective

Local web application: React UI, Express application API, FastAPI prediction service, MongoDB, and a saved scikit-learn pipeline. News, fact-check, and digest features also use configured external services.

### 2.2 Product functions

Text input, validation, prediction, model information, registration/login, cached news, protected fact-checking, optional digest email, and reproducible model training/evaluation.

### 2.3 Users

- **End user**: pastes an article and reads the prediction. No technical knowledge assumed.
- **Developer/evaluator**: trains, evaluates and inspects the model.

### 2.4 Operating environment

| Item     | Requirement                                 |
| -------- | ------------------------------------------- |
| OS       | Windows / macOS / Linux                     |
| Python   | 3.11 or newer                               |
| Node.js  | 18 or newer (LTS)                           |
| Browser  | Current Chrome, Firefox, Edge, or Safari    |
| Hardware | Normal laptop, 8 GB RAM recommended, no GPU |

### 2.5 Constraints

- Accuracy depends on the training dataset and may not generalize to other news sources or time periods.
- Application services run locally; news, fact-checking, and email features require configured external providers.
- Credentials are stored in the ignored root `.env`; model training does not require API credentials.

### 2.6 Assumptions and dependencies

- A labeled fake/real news dataset is available (default: ISOT; a second dataset is used for generalization testing).
- Dataset labels are verified manually before use.
- The English language only.

## 3. Specific requirements

### 3.1 Functional requirements

| ID    | Requirement                                                                                                                       | Phase  |
| ----- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-01 | The user can enter or paste news text in a text area.                                                                             | 7      |
| FR-02 | The system rejects empty, too-short (<20 characters after trimming), or too-long (>20,000 characters) input with a clear message. | 6, 7   |
| FR-03 | The backend applies the same cleaning and vectorization used in training (single saved Pipeline).                                 | 5, 6   |
| FR-04 | The system returns a label (FAKE/REAL) and a model score for the input.                                                           | 6      |
| FR-05 | The UI displays the label, the score, and a disclaimer that this is a model prediction, not a fact-check.                         | 7      |
| FR-06 | The project provides a reproducible script that trains and saves the model.                                                       | 5      |
| FR-07 | The project reports accuracy, precision, recall, F1 and a confusion matrix on a held-out test set.                                | 2, 4   |
| FR-08 | The project compares at least three classifiers and at least three preprocessing variants using cross-validation.                 | 4      |
| FR-09 | The project evaluates the model on a second dataset and reports the performance drop.                                             | 3      |
| FR-10 | The project inspects the most influential features and documents any leakage found and removed.                                   | 3      |
| FR-11 | The UI provides sample inputs, a clear button, loading and error states.                                                          | 7      |
| FR-12 | The backend exposes model metadata (dataset, metrics, training date).                                                             | 6      |
| FR-13 | Users can register and log in using a cookie-backed session.                                                                      | 11, 14 |
| FR-14 | The app provides cached news and authenticated fact-checking.                                                                     | 12–14  |
| FR-15 | Users can opt out of weekly digest email; only opted-in users receive it.                                                         | 15     |

### 3.2 External interfaces

**API** (details in `Documents/ARCHITECTURE.md`): Express handles the browser-facing `/api` routes; FastAPI provides `GET /health`, `GET /model-info`, and `POST /predict`.

**UI**: single-page app with an input area, Analyze button, result card, error banner, and an About/limitations section.

### 3.3 Non-functional requirements

| ID                     | Requirement                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-01 Performance     | A prediction for a typical article returns in under 1 second locally, and the model loads once at startup.                                |
| NFR-02 Reliability     | Malformed requests and missing model files produce structured errors, not crashes.                                                        |
| NFR-03 Usability       | A first-time user can get a result without instructions.                                                                                  |
| NFR-04 Maintainability | ML, backend and frontend code live in separate directories with documented contracts.                                                     |
| NFR-05 Reproducibility | Fixed seeds, pinned key versions, and a model card recording dataset, parameters and metrics.                                             |
| NFR-06 Security        | Input is length-limited and validated. CORS allows only the known frontend origin. Model files are loaded only from a trusted local path. |
| NFR-07 Transparency    | The UI never presents a prediction as proof of truth or falsehood.                                                                        |

## 4. Use cases

**UC-1 Classify an article.** Actor: End user. Flow: pastes text, clicks Analyze, UI shows a loading state, backend returns the prediction, UI shows the label, score and disclaimer. Alternate: input invalid, so the UI shows a validation error. Alternate: backend down, so the UI shows a "service unavailable" message.

**UC-2 Retrain the model.** Actor: Developer. Flow: places the dataset in `ml/data/raw/`, runs `python -m ml.src.train`, and the new `pipeline.joblib` and `model_card.json` are written.

**UC-3 Inspect model quality.** Actor: Developer. Flow: opens `ml/reports/` to view metrics, confusion matrix, cross-dataset results, top features, and error analysis.

## 5. Acceptance criteria (MVP complete when)

1. Dataset is cleaned, deduplicated, and its labels verified (Phase 1).
2. A baseline beats the majority-class baseline on a stratified held-out test set (Phase 2).
3. Leakage has been inspected, artifacts removed, and cross-dataset results reported (Phase 3).
4. Preprocessing and model comparisons are documented with CV results (Phase 4).
5. One `pipeline.joblib` loads and predicts from a fresh Python session (Phase 5).
6. `POST /predict` works, validates input, and has passing tests (Phase 6).
7. The React UI completes UC-1 including error paths (Phase 7).
8. The full system runs locally from README instructions (Phase 8).
9. README, results, limitations, and demo/presentation materials use traceable evidence (Phase 9).

## 6. Future scope (not required)

Transformer models (BERT), multilingual support, source credibility, calibrated scores, explainability (LIME/SHAP), and browser extension.
