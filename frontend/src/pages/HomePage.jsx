import { useRef, useState } from 'react';
import { CircleHelp, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { factCheck, predict, webSearchFactCheck } from '../api';
import { useAuth } from '../context/useAuth';
import { ErrorBanner } from '../components/ErrorBanner';
import { FactCheckPanel } from '../components/FactCheckPanel';
import { NewsForm } from '../components/NewsForm';
import { ResultCard } from '../components/ResultCard';

export function HomePage({ onOpenAuth }) {
  const { user, refreshUser } = useAuth();
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisError, setAnalysisError] = useState('');
  const [result, setResult] = useState(null);
  const [submittedText, setSubmittedText] = useState('');
  const [factCheckStatus, setFactCheckStatus] = useState('idle');
  const [factCheckResult, setFactCheckResult] = useState(null);
  const [webSearchStatus, setWebSearchStatus] = useState('idle');
  const [webSearchResult, setWebSearchResult] = useState(null);
  const [webSearchLimitError, setWebSearchLimitError] = useState(null);
  const requestId = useRef(0);

  async function handleAnalyze(text) {
    if (analysisStatus === 'loading') return;
    const activeId = ++requestId.current;
    setSubmittedText(text);
    setAnalysisStatus('loading');
    setAnalysisError('');
    setResult(null);
    setFactCheckResult(null);
    setFactCheckStatus('idle');
    setWebSearchResult(null);
    setWebSearchStatus('idle');
    setWebSearchLimitError(null);

    try {
      const prediction = await predict(text);
      if (activeId !== requestId.current) return;
      setResult(prediction);
      setAnalysisStatus('success');
    } catch (error) {
      if (activeId !== requestId.current) return;
      setAnalysisError(error.message);
      setAnalysisStatus('error');
    }
  }

  function handleClear() {
    requestId.current += 1;
    setAnalysisStatus('idle');
    setAnalysisError('');
    setResult(null);
    setSubmittedText('');
    setFactCheckStatus('idle');
    setFactCheckResult(null);
    setWebSearchStatus('idle');
    setWebSearchResult(null);
    setWebSearchLimitError(null);
  }

  async function performFactCheck(text) {
    setFactCheckStatus('loading');
    setFactCheckResult(null);
    try {
      const response = await factCheck(text);
      setFactCheckResult(response);
      setFactCheckStatus('success');
    } catch (error) {
      if (error.message.includes('Login required')) {
        setFactCheckStatus('idle');
        onOpenAuth('login', () => { void performFactCheck(submittedText); });
        return;
      }
      setFactCheckResult({
        verdict: 'unavailable',
        explanation: error.message || 'Fact-check service is temporarily unavailable.',
        sources: [],
        cached: false,
      });
      setFactCheckStatus('error');
    }
  }

  function handleFactCheck() {
    if (!submittedText || analysisStatus !== 'success') return;
    if (!user) {
      onOpenAuth('login', () => { void performFactCheck(submittedText); });
      return;
    }
    void performFactCheck(submittedText);
  }

  async function performWebSearch(text) {
    setWebSearchStatus('loading');
    setWebSearchResult(null);
    setWebSearchLimitError(null);
    try {
      const response = await webSearchFactCheck(text);
      setWebSearchResult(response);
      setWebSearchStatus('success');
      if (!response.cached && response.verdict !== 'unavailable') await refreshUser();
    } catch (error) {
      if (error.message.includes('Login required')) {
        setWebSearchStatus('idle');
        onOpenAuth('login', () => { void performWebSearch(text); });
        return;
      }
      if (error.status === 403 && error.data?.limitReached) {
        setWebSearchLimitError({
          used: error.data.used,
          limit: error.data.limit,
          upgradeUrl: error.data.upgradeUrl || '/premium',
        });
        setWebSearchStatus('limit');
        return;
      }
      setWebSearchResult({
        verdict: 'unavailable',
        explanation: error.message || 'Web search is temporarily unavailable. Please try again later.',
        sources: [],
        cached: false,
      });
      setWebSearchStatus('error');
    }
  }

  function handleWebSearch() {
    if (!submittedText || factCheckResult?.verdict !== 'unverifiable') return;
    if (!user) {
      onOpenAuth('login', () => { void performWebSearch(submittedText); });
      return;
    }
    void performWebSearch(submittedText);
  }

  function scrollToAnalyzer() {
    document.getElementById('article-analyzer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main>
      <section className="home-hero page-shell">
        <div className="hero-copy">
          <h1>Read the story.<br />Question the signal.</h1>
          <p className="hero-description">See how an article's writing compares with patterns in the training data. A model label is a prompt to think, not proof.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={scrollToAnalyzer}>Analyze an article</button>
            <Link className="button button-outline" to="/news">Explore the news</Link>
          </div>
          <div className="hero-disclaimer"><CircleHelp size={15} /><span>Does not verify claims, sources, or authors.</span></div>
        </div>
        <div className="hero-note" aria-label="How analysis works">
          <p><span className="marked">Language patterns<br />are not evidence.</span></p>
          <span className="note-caption">TF-IDF + Logistic Regression</span>
        </div>
      </section>

      <section id="article-analyzer" className="analyzer-section page-shell" aria-labelledby="analyzer-title">
        <div className="section-intro">
          <div>
            <h2 id="analyzer-title">Analyze an article</h2>
            <p>Paste text or choose a sample. Keep the full article for more context.</p>
          </div>
          <span className="length-rule">20 to 20,000 characters</span>
        </div>

        <div className="analyzer-grid">
          <div className="analysis-main">
            <NewsForm onSubmit={handleAnalyze} onClear={handleClear} isLoading={analysisStatus === 'loading'} />
            {analysisStatus === 'loading' && <div className="loading-line" role="status"><span className="loading-pulse" /> Running the language-pattern model…</div>}
            {analysisStatus === 'error' && <ErrorBanner message={analysisError} />}
            {analysisStatus === 'success' && result && (
              <div className="results-stack" aria-live="polite">
                <ResultCard result={result} />
                <FactCheckPanel
                  articleText={submittedText}
                  result={factCheckResult}
                  webSearchResult={webSearchResult}
                  webSearchLimitError={webSearchLimitError}
                  loading={factCheckStatus === 'loading'}
                  webSearchLoading={webSearchStatus === 'loading'}
                  onFactCheck={handleFactCheck}
                  onWebSearch={handleWebSearch}
                  onRequestLogin={() => onOpenAuth('login', () => { void performFactCheck(submittedText); })}
                  user={user}
                />
              </div>
            )}
          </div>

          <aside className="analysis-aside">
            <h2 className="aside-title">How to read this</h2>
            <ol className="reading-steps">
              <li><span>1</span><div><strong>Pattern label</strong><p>FAKE or REAL reflects the dataset label the text resembles.</p></div></li>
              <li><span>2</span><div><strong>Model score</strong><p>An uncalibrated score for the FAKE class, not confidence or truth probability.</p></div></li>
              <li><span>3</span><div><strong>Optional fact-check</strong><p>Sign in to compare against limited related news context.</p></div></li>
            </ol>
            <div className="aside-lock"><LockKeyhole size={15} /><span>AI fact-checking requires an account.</span></div>
          </aside>
        </div>
      </section>

      <section className="closing-note page-shell">
        <p>Good reading starts with curiosity.</p>
        <Link to="/about">Learn how this model works</Link>
      </section>
    </main>
  );
}
