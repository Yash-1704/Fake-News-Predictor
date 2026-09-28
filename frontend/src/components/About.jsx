import { useEffect, useState } from 'react';
import { fetchModelInfo } from '../api';

export function About() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetchModelInfo().then(setInfo).catch(() => {});
  }, []);

  return (
    <section className="about-section" aria-labelledby="about-heading">
      <h2 id="about-heading" className="about-heading">About this tool</h2>
      <div className="about-grid">
        <div className="about-block">
          <h3>What it does</h3>
          <p>
            This tool classifies news articles as <strong>FAKE</strong> or <strong>REAL</strong> by
            analysing writing patterns using TF-IDF features and a Logistic Regression classifier.
            It does <em>not</em> verify facts or check sources — it is a text pattern classifier.
          </p>
        </div>
        <div className="about-block">
          <h3>Training data</h3>
          <p>
            Trained on the <strong>ISOT Fake News Dataset</strong> (~39,000 articles). The model
            was also evaluated on an independent Kaggle Fake/Real News dataset to assess
            cross-domain generalisation.
          </p>
        </div>
        <div className="about-block">
          <h3>Performance</h3>
          {info ? (
            <ul className="metrics-list">
              <li>In-domain F1: <strong>{(info.metrics_in_domain?.f1 * 100).toFixed(1)}%</strong></li>
              <li>In-domain accuracy: <strong>{(info.metrics_in_domain?.accuracy * 100).toFixed(1)}%</strong></li>
              <li>Cross-dataset F1: <strong>{(info.metrics_cross_dataset?.f1 * 100).toFixed(1)}%</strong></li>
              <li>Classifier: <strong>{info.classifier}</strong></li>
            </ul>
          ) : (
            <p className="metrics-loading">Loading model info…</p>
          )}
        </div>
        <div className="about-block">
          <h3>Limitations</h3>
          <ul className="limitations-list">
            <li>Cannot verify facts or claims in an article</li>
            <li>Trained on specific news sources — may be wrong on other kinds of news</li>
            <li>May misclassify satire, opinion, or international news</li>
            <li>The model score is <em>not</em> a calibrated probability</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
