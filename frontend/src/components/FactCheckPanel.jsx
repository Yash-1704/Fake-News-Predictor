export function FactCheckPanel({ articleText, result, loading, onFactCheck, user }) {
  const canUse = Boolean(user) && typeof articleText === 'string' && articleText.trim().length > 0;
  const verdictClass = {
    'likely true': 'fact-check-positive',
    'likely false': 'fact-check-negative',
    unverifiable: 'fact-check-neutral',
    unavailable: 'fact-check-neutral',
  }[String(result?.verdict || '').toLowerCase()] || 'fact-check-neutral';

  return (
    <section className="fact-check-panel" aria-live="polite">
      <div className="fact-check-header">
        <h3>Fact-check</h3>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onFactCheck}
          disabled={!canUse || loading}
          title={user ? 'Fact-check this article' : 'Log in to fact-check'}
        >
          {user ? (loading ? 'Checking…' : 'Fact-check this') : 'Log in to fact-check'}
        </button>
      </div>

      {!user && (
        <p className="fact-check-hint">Log in to access the fact-check feature and compare the article against cached news context.</p>
      )}

      {loading && <p className="fact-check-status">Checking article against recent news items…</p>}

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
                    <strong>{source.title || 'News source'}</strong> — {source.source || 'Unknown source'}
                    {source.url ? (
                      <>
                        {' '}
                        <a href={source.url} target="_blank" rel="noreferrer">Read</a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="fact-check-empty">No related sources were returned for this check.</p>
          )}

          <p className="disclaimer-text">⚠ Automated assessment based on limited retrieved sources, not a guarantee.</p>
        </div>
      )}
    </section>
  );
}
