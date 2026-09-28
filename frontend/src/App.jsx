import { useState, useRef } from 'react';
import { predict } from './api';
import { NewsForm } from './components/NewsForm';
import { ResultCard } from './components/ResultCard';
import { ErrorBanner } from './components/ErrorBanner';
import { About } from './components/About';
import './App.css';

export default function App() {
  // status: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  // Guard against stale requests: each submit gets a unique id
  const currentRequestId = useRef(0);

  async function handleSubmit(text) {
    // Prevent double submit
    if (status === 'loading') return;

    const requestId = ++currentRequestId.current;
    setStatus('loading');
    setResult(null);
    setError(null);

    try {
      const data = await predict(text);
      // Discard result if a newer request was made
      if (requestId !== currentRequestId.current) return;
      setResult(data);
      setStatus('success');
    } catch (err) {
      if (requestId !== currentRequestId.current) return;
      setError(err.message);
      setStatus('error');
    }
  }

  function handleClear() {
    currentRequestId.current++; // discard any in-flight response
    setStatus('idle');
    setResult(null);
    setError(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-logo">🔍</span>
          <div>
            <h1 className="header-title">Fake News Detector</h1>
            <p className="header-subtitle">AI-powered writing pattern analysis · Not a fact-checker</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <NewsForm
          onSubmit={handleSubmit}
          onClear={handleClear}
          isLoading={status === 'loading'}
        />

        {status === 'loading' && (
          <div className="loading-state" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span>Analysing article…</span>
          </div>
        )}

        {status === 'error' && <ErrorBanner message={error} />}

        {status === 'success' && result && <ResultCard result={result} />}

        <About />
      </main>

      <footer className="app-footer">
        <p>College project · Fake News Detection Using NLP · Model trained on ISOT dataset</p>
      </footer>
    </div>
  );
}
