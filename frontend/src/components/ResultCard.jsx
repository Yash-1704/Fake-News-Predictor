export function ResultCard({ result }) {
  const isFake = result.label === 'FAKE';
  const scorePercent = Math.round(result.fake_score * 100);

  return (
    <div className={`result-card ${isFake ? 'result-fake' : 'result-real'}`} role="region" aria-label="Analysis result">
      <div className="result-badge-row">
        <span className={`result-badge ${isFake ? 'badge-fake' : 'badge-real'}`}>
          {isFake ? '⚠ FAKE' : '✓ REAL'}
        </span>
      </div>

      <div className="score-section">
        <p className="score-label">Model score (fake likelihood)</p>
        <div className="score-bar-track" role="progressbar" aria-valuenow={scorePercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`score-bar-fill ${isFake ? 'fill-fake' : 'fill-real'}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
        <span className="score-value">{scorePercent}%</span>
      </div>

      <p className="disclaimer-text">⚠ {result.disclaimer}</p>
      <p className="model-version">Model: {result.model_version}</p>
    </div>
  );
}
