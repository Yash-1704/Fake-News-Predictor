from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from ml.src import config


def build_baseline() -> Pipeline:
    """Builds baseline NLP classification pipeline combining TF-IDF vectorization and Logistic Regression.
    
    Why: Wrapping TF-IDF and Logistic Regression in a single scikit-learn Pipeline prevents
    data leakage by ensuring the vectorizer vocabulary and IDF weights are fit ONLY on 
    the training split when Pipeline.fit(X_train, y_train) is called.
    """
    return Pipeline([
        ("tfidf", TfidfVectorizer(lowercase=True, max_features=50_000)),
        ("clf", LogisticRegression(max_iter=1000, random_state=config.RANDOM_STATE)),
    ])
