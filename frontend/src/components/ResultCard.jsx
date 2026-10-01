export function ResultCard({ result }) {
  const isFake = result.label === 'FAKE';
  const scorePercent = Math.round(result.fake_score * 100);

  return (
    <section className="prediction-result" aria-labelledby="prediction-result-title" aria-live="polite">
      <div className="result-topline">
        <div>
          <span className="result-eyebrow">Model prediction</span>
          <h2 className={`result-verdict ${isFake ? 'result-fake' : 'result-real'}`} id="prediction-result-title">{result.label}</h2>
        </div>
        <div className="result-score">
          <strong>{scorePercent}%</strong>
          <span>FAKE-class score</span>
        </div>
      </div>
      <div className="score-section">
        <p className="sr-only">The score is uncalibrated and is not a probability that the article is false.</p>
        <div className="score-bar-track" role="progressbar" aria-label="FAKE-class model score" aria-valuenow={scorePercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`score-bar-fill ${isFake ? 'fill-fake' : 'fill-real'}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>
      <div className="result-foot">
        <p className="disclaimer-text">{result.disclaimer} The score is uncalibrated and does not establish truth.</p>
        <span className="model-version">Model {result.model_version}</span>
      </div>
    </section>
  );
}
