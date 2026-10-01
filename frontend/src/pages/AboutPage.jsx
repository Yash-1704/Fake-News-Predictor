import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchModelInfo } from '../api';

function percent(value) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : 'Not available';
}

export function AboutPage() {
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchModelInfo({ signal: controller.signal })
      .then((data) => { setModel(data); setError(''); setStatus('success'); })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return;
        setError(requestError.message);
        setStatus('error');
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <main className="page-shell content-page about-page">
      <header className="page-heading">
        <h1>What the model <span className="nowrap">can—and can't—tell</span> you.</h1>
        <p>This project classifies writing patterns. It does not establish whether a story's claims are true.</p>
      </header>

      <section className="about-method">
        <div className="method-copy">
          <h2>A text classifier, not a fact-checker</h2>
          <p>The model uses text cleaning, TF-IDF features, and Logistic Regression to compare an article with patterns learned from labeled news datasets. It can misread unfamiliar sources, topics, satire, opinion, and newer reporting.</p>
          <p>Its FAKE-class score is uncalibrated. It is not the probability that an article is false, nor a confidence measure.</p>
        </div>
        <ol className="method-pipeline" aria-label="Model pipeline">
          <li>Article text</li><li>Cleaning</li><li>TF-IDF</li><li>Logistic regression</li>
        </ol>
      </section>

      <section className="model-section" aria-labelledby="model-info-title">
        <div className="section-intro">
          <div><h2 id="model-info-title">Model information</h2></div>
          {status === 'error' && <button className="button button-outline" type="button" onClick={() => { setStatus('loading'); setAttempt((value) => value + 1); }}><RefreshCw size={15} /> Retry</button>}
        </div>
        {status === 'loading' && <div className="loading-line" role="status"><span className="loading-pulse" /> Loading model information…</div>}
        {status === 'error' && <div className="inline-error" role="alert"><AlertTriangle size={18} /><div><strong>Model information is unavailable.</strong><p>{error}</p></div></div>}
        {status === 'success' && model && (
          <div className="model-card-content">
            <dl className="model-facts">
              <div><dt>Model version</dt><dd>{model.model_version || 'Not provided'}</dd></div>
              <div><dt>Classifier</dt><dd>{model.classifier || 'Not provided'}</dd></div>
              <div><dt>Training data</dt><dd>{model.dataset || 'Not provided'}</dd></div>
              <div><dt>Train / test rows</dt><dd>{model.n_train?.toLocaleString?.() ?? '—'} / {model.n_test?.toLocaleString?.() ?? '—'}</dd></div>
              <div><dt>Trained</dt><dd>{model.trained_at ? new Date(model.trained_at).toLocaleDateString() : 'Not provided'}</dd></div>
            </dl>
            <table className="metric-table">
              <caption className="sr-only">Model evaluation metrics</caption>
              <thead><tr><th scope="col">Evaluation</th><th scope="col">F1</th><th scope="col">Accuracy</th></tr></thead>
              <tbody>
                <tr><th scope="row">In-domain</th><td>{percent(model.metrics_in_domain?.f1)}</td><td>{percent(model.metrics_in_domain?.accuracy)}</td></tr>
                <tr><th scope="row">Second dataset</th><td>{percent(model.metrics_cross_dataset?.f1)}</td><td>{percent(model.metrics_cross_dataset?.accuracy)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="about-bottom">
        <div><h2>Read predictions as signals, not verdicts.</h2><p>Source bias, domain shift, and language style can affect results. Verify important claims through reliable reporting and primary sources.</p></div>
        <Link className="button button-primary" to="/">Try an article</Link>
      </section>
    </main>
  );
}
