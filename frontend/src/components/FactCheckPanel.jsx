import { ArrowUpRight, LockKeyhole } from 'lucide-react';

export function FactCheckPanel({ articleText, result, loading, onFactCheck, onRequestLogin, user }) {
  const hasText = typeof articleText === 'string' && articleText.trim().length > 0;
  const verdictClass = {
    'likely true': 'fact-check-positive',
    'likely false': 'fact-check-negative',
    unverifiable: 'fact-check-neutral',
    unavailable: 'fact-check-neutral',
  }[String(result?.verdict || '').toLowerCase()] || 'fact-check-neutral';

  return (
    <section className="fact-check-panel" aria-live="polite" aria-labelledby="fact-check-title">
      <div className="fact-check-header">
        <div className="fact-check-title-wrap"><h3 id="fact-check-title">AI fact-check</h3><p className="fact-check-scope">Limited context</p></div>
        <button
          type="button"
          className="button button-outline"
          onClick={user ? onFactCheck : onRequestLogin}
          disabled={!hasText || loading}
          title={user ? 'Compare with available related news context' : 'Sign in to use AI fact-checking'}
        >
          {user ? (loading ? 'Checking…' : 'Fact-check article') : <><LockKeyhole size={15} /> Sign in to fact-check</>}
        </button>
      </div>

      {!user && (
        <p className="fact-check-hint">Sign in to use AI-powered fact-checking. Your article stays here while you sign in.</p>
      )}

      {loading && <p className="fact-check-status" role="status"><span className="loading-pulse" /> Checking against limited related-news context…</p>}

      {result && (
        <div className="fact-check-result">
          <div className="fact-check-row">
            <span className={`fact-check-badge ${verdictClass}`}>
              {String(result.verdict || '').toUpperCase()}
            </span>
            {result.cached && <span className="fact-check-cache">Cached result</span>}
          </div>

          <p className="fact-check-explanation">{result.explanation}</p>

          {Array.isArray(result.sources) && result.sources.length > 0 ? (
            <div className="source-block">
              <h4>Sources used</h4>
              <ul>
                {result.sources.map((source, index) => (
                  <li key={`${source.url || source.title || index}-${index}`}>
                    <strong>{source.title || 'News source'}</strong> <span className="source-name">{source.source || 'Unknown source'}</span>
                    {source.url ? <a href={source.url} target="_blank" rel="noreferrer" aria-label={`Read source: ${source.title || source.source || 'news article'}`}>Source <ArrowUpRight size={14} /></a> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="fact-check-empty">No related sources were returned for this check.</p>
          )}

          <p className="fact-check-disclaimer">AI-generated assessment based on limited retrieved sources. It is not a guarantee or a substitute for checking primary sources.</p>
        </div>
      )}
    </section>
  );
}
