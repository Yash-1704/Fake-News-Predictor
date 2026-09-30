import { useState } from 'react';

const MIN_CHARS = 20;
const MAX_CHARS = 20000;

const SAMPLES = [
  {
    label: 'Sample: Real news',
    text: 'The Federal Reserve held interest rates steady on Wednesday while signalling it still expects to cut borrowing costs later this year, as policymakers look for more evidence that inflation is on a sustainable path toward their 2% target. Fed Chair Jerome Powell said at a press conference that the committee remains attentive to inflation risks and will carefully assess incoming data before making any further changes.',
  },
  {
    label: 'Sample: Fake news',
    text: 'BREAKING: Scientists at a secret underground lab have confirmed that chemtrails contain mind-control chemicals approved by the deep state government to keep citizens docile. Leaked documents obtained by whistleblowers prove that major airlines are paid $50,000 per flight to spray these substances. Share this before it gets deleted!',
  },
  {
    label: 'Sample: Opinion',
    text: 'The government has once again failed the working class with its latest budget proposal. While billionaires enjoy record tax cuts, ordinary families are left struggling to pay rent and put food on the table. The so-called economic growth touted by politicians is nothing but smoke and mirrors designed to hide the widening inequality gap that is tearing society apart.',
  },
];

export function NewsForm({ onSubmit, onClear, isLoading }) {
  const [text, setText] = useState('');
  const charCount = text.length;
  const trimmedLen = text.trim().length;
  const canSubmit = !isLoading && trimmedLen >= MIN_CHARS && trimmedLen <= MAX_CHARS;

  function handleSubmit(e) {
    e.preventDefault();
    if (canSubmit) onSubmit(text);
  }

  function handleClear() {
    setText('');
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" aria-label="News article analyzer">
      <label htmlFor="news-textarea" className="form-label">
        Paste a news article to analyse
      </label>
      <textarea
        id="news-textarea"
        className="news-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_CHARS + 1}
        placeholder="Paste the full article text here. More context gives the model more language to analyze."
        rows={10}
        aria-describedby="char-counter length-guidance sample-note"
        disabled={isLoading}
      />
      <div className="char-row">
        <span
          id="char-counter"
          className={`char-counter ${charCount > MAX_CHARS ? 'char-error' : charCount > MAX_CHARS * 0.9 ? 'char-warn' : ''}`}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
        <span id="length-guidance" className={`char-hint ${trimmedLen > MAX_CHARS ? 'char-error' : ''}`}>
          {trimmedLen === 0 ? `At least ${MIN_CHARS} characters required` : trimmedLen < MIN_CHARS ? `Add ${MIN_CHARS - trimmedLen} more characters` : trimmedLen > MAX_CHARS ? 'Text is over the 20,000 character limit' : 'Ready to analyze'}
        </span>
      </div>

      <div className="button-row">
        <button type="submit" className="button button-primary" disabled={!canSubmit} aria-busy={isLoading}>
          {isLoading ? 'Analysing…' : 'Analyse'}
        </button>
        <button type="button" className="button button-outline" onClick={handleClear} disabled={isLoading || !text}>
          Clear
        </button>
      </div>

      <div className="samples-row" id="sample-note">
        <span className="samples-label">Use a sample</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            className="sample-button"
            onClick={() => setText(s.text)}
            disabled={isLoading}
          >
            {s.label}
          </button>
        ))}
      </div>
    </form>
  );
}
