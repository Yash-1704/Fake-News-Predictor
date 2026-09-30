import { useState, useRef } from 'react';
import { factCheck, predict } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NewsForm } from './components/NewsForm';
import { ResultCard } from './components/ResultCard';
import { ErrorBanner } from './components/ErrorBanner';
import { About } from './components/About';
import { FactCheckPanel } from './components/FactCheckPanel';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import NewsFeed from './pages/NewsFeed';
import './App.css';

function AppShell() {
  const { user, logout, loading: authLoading, setEmailOptIn } = useAuth();
  const [page, setPage] = useState('analysis');
  const [authView, setAuthView] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [submittedText, setSubmittedText] = useState('');
  const [factCheckResult, setFactCheckResult] = useState(null);
  const [factCheckStatus, setFactCheckStatus] = useState('idle');
  const currentRequestId = useRef(0);

  async function handleSubmit(text) {
    if (status === 'loading') return;

    const requestId = ++currentRequestId.current;
    setStatus('loading');
    setResult(null);
    setError(null);
    setSubmittedText(text);
    setFactCheckResult(null);
    setFactCheckStatus('idle');

    try {
      const data = await predict(text);
      if (requestId !== currentRequestId.current) return;
      setResult(data);
      setStatus('success');
    } catch (err) {
      if (requestId !== currentRequestId.current) return;
      setError(err.message);
      setStatus('error');
    }
  }

  async function handleFactCheck() {
    if (!user || !submittedText) return;

    setFactCheckStatus('loading');

    try {
      const data = await factCheck(submittedText);
      setFactCheckResult(data);
      setFactCheckStatus('success');
    } catch (err) {
      setFactCheckStatus('error');
      setFactCheckResult({
        verdict: 'unavailable',
        explanation: err.message || 'Fact-check service is temporarily unavailable.',
        sources: [],
        cached: false,
      });
    }
  }

  function handleClear() {
    currentRequestId.current++;
    setStatus('idle');
    setResult(null);
    setError(null);
    setSubmittedText('');
    setFactCheckResult(null);
    setFactCheckStatus('idle');
  }

  if (authView === 'login') {
    return (
      <LoginPage
        onSuccess={() => setAuthView(null)}
        onSwitchToRegister={() => setAuthView('register')}
        onBack={() => setAuthView(null)}
      />
    );
  }

  if (authView === 'register') {
    return (
      <RegisterPage
        onSuccess={() => setAuthView(null)}
        onSwitchToLogin={() => setAuthView('login')}
        onBack={() => setAuthView(null)}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-lockup">
            <span className="header-logo" aria-hidden="true">FN</span>
            <div className="brand-copy">
              <span className="header-title">Fake News Detector</span>
              <span className="header-subtitle">NEWS TEXT ANALYSIS</span>
            </div>
          </div>

          <nav className="header-meta" aria-label="Main navigation">
            <button type="button" className="nav-button" onClick={() => setPage('analysis')}>
              Home
            </button>
            <button type="button" className="nav-button" onClick={() => setPage('feed')}>
              News Feed
            </button>
            {user ? (
              <>
                <span className="user-pill">Logged in as {user.email}</span>
                <label className="optin-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(user.emailOptIn)}
                    onChange={(event) => setEmailOptIn(event.target.checked)}
                  />
                  <span>Email digest</span>
                </label>
                <button type="button" className="nav-button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button type="button" className="nav-button" onClick={() => setAuthView('login')}>
                  Login
                </button>
                <button type="button" className="nav-button" onClick={() => setAuthView('register')}>
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {page === 'feed' ? (
        <main className="app-main">
          <NewsFeed />
        </main>
      ) : (
        <main className="app-main">
          <section className="intro-band" aria-labelledby="intro-title">
            <div className="intro-copy">
              <p className="eyebrow"><span>FIELD NOTE 01</span> / WRITING PATTERNS</p>
              <h1 className="intro-title" id="intro-title">Read the signal.<br /><em>Question the verdict.</em></h1>
              <p className="intro-description">
                Explore how an article's language resembles examples in the training data.
                A text pattern is not proof of truth.
              </p>
            </div>
            <aside className="intro-note" aria-label="Classifier scope">
              <span className="note-label">THIS MODEL RETURNS</span>
              <strong>FAKE <i>/</i> REAL</strong>
              <p>Based on word patterns only. No claim, source, or evidence checking.</p>
              <span className="note-rule" aria-hidden="true" />
              <span className="note-foot">MODEL P2_LR <b>·</b> TF-IDF + LOGISTIC REGRESSION</span>
            </aside>
          </section>

          <div className="workbench">
            <section className="analysis-column" aria-labelledby="analysis-title">
              <div className="section-heading">
                <span className="section-index">01</span>
                <div>
                  <h2 id="analysis-title">Article analysis</h2>
                  <p>Paste an article or try a sample text.</p>
                </div>
              </div>

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

              {status === 'success' && result && (
                <>
                  <ResultCard result={result} />
                  <FactCheckPanel
                    articleText={submittedText}
                    result={factCheckResult}
                    loading={factCheckStatus === 'loading'}
                    onFactCheck={handleFactCheck}
                    user={user}
                  />
                </>
              )}

              {!authLoading && status !== 'success' && !result && (
                <FactCheckPanel
                  articleText={submittedText}
                  result={factCheckResult}
                  loading={factCheckStatus === 'loading'}
                  onFactCheck={handleFactCheck}
                  user={user}
                />
              )}
            </section>

            <aside className="insight-column" aria-label="Model information and limitations">
              <About />
            </aside>
          </div>
        </main>
      )}

      <footer className="app-footer">
        <div className="footer-inner">
          <p>FAKE NEWS DETECTION USING NLP <span>·</span> COLLEGE PROJECT</p>
          <span>MODEL TRAINED ON ISOT DATA</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
