import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BookOpenText, RefreshCw } from 'lucide-react';
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
        <span className="section-kicker">THE METHOD <span>03</span></span>
        <h1>What the model can—and can't—tell you.</h1>
        <p>This project classifies writing patterns. It does not establish whether a story's claims are true.</p>
      </header>

      <section className="about-method">
        <div className="method-copy">
          <BookOpenText size={20} />
          <h2>A text classifier, not a fact-checker</h2>
          <p>The model uses text cleaning, TF-IDF features, and Logistic Regression to compare an article with patterns learned from labeled news datasets. It can misread unfamiliar sources, topics, satire, opinion, and newer reporting.</p>
          <p>Its FAKE-class score is uncalibrated. It is not the probability that an article is false, nor a confidence measure.</p>
        </div>
        <div className="method-pipeline" aria-label="Model pipeline">
          <span>ARTICLE TEXT</span><i /><span>CLEANING</span><i /><span>TF-IDF</span><i /><span>LOGISTIC REGRESSION</span>
        </div>
      </section>

      <section className="model-section" aria-labelledby="model-info-title">
        <div className="section-intro">
          <div><span className="section-kicker">LIVE MODEL CARD <span>01</span></span><h2 id="model-info-title">Model information</h2></div>
          {status === 'error' && <button className="button button-outline" type="button" onClick={() => { setStatus('loading'); setAttempt((value) => value + 1); }}><RefreshCw size={15} /> Retry</button>}
        </div>
        {status === 'loading' && <div className="loading-line" role="status"><span className="loading-pulse" /> Loading model information…</div>}
        {status === 'error' && <div className="inline-error" role="alert"><AlertTriangle size={18} /><div><strong>Model information is unavailable.</strong><p>{error}</p></div></div>}
        {status === 'success' && model && (
          <div className="model-card-content">
            <div className="model-facts">
              <div><span>MODEL VERSION</span><strong>{model.model_version || 'Not provided'}</strong></div>
              <div><span>CLASSIFIER</span><strong>{model.classifier || 'Not provided'}</strong></div>
              <div><span>TRAINING DATA</span><strong>{model.dataset || 'Not provided'}</strong></div>
              <div><span>TRAIN / TEST ROWS</span><strong>{model.n_train?.toLocaleString?.() ?? '—'} / {model.n_test?.toLocaleString?.() ?? '—'}</strong></div>
              <div><span>TRAINED</span><strong>{model.trained_at ? new Date(model.trained_at).toLocaleDateString() : 'Not provided'}</strong></div>
            </div>
            <div className="metric-compare">
              <div><span><Activity size={15} /> IN-DOMAIN</span><strong>F1 {percent(model.metrics_in_domain?.f1)}</strong><small>Accuracy {percent(model.metrics_in_domain?.accuracy)}</small></div>
              <div><span><Activity size={15} /> SECOND DATASET</span><strong>F1 {percent(model.metrics_cross_dataset?.f1)}</strong><small>Accuracy {percent(model.metrics_cross_dataset?.accuracy)}</small></div>
            </div>
          </div>
        )}
      </section>

      <section className="about-bottom">
        <div><AlertTriangle size={18} /><h2>Read predictions as signals, not verdicts.</h2><p>Source bias, domain shift, and language style can affect results. Verify important claims through reliable reporting and primary sources.</p></div>
        <Link className="button button-primary" to="/">Try an article <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
