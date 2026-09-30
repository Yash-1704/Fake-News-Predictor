import { ArrowUpRight, Newspaper } from 'lucide-react';

function formatPublishedDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function NewsArticleCard({ article, index = 0 }) {
  return (
    <article className="news-row">
      <span className="news-row-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="news-row-body">
        <div className="news-meta"><span><Newspaper size={13} /> {article.source || 'Unknown source'}</span><time dateTime={article.publishedAt}>{formatPublishedDate(article.publishedAt)}</time></div>
        <h2>{article.title || 'Untitled article'}</h2>
        {article.snippet && <p>{article.snippet}</p>}
      </div>
      {article.url ? <a className="news-open-link" href={article.url} target="_blank" rel="noreferrer" aria-label={`Open ${article.title || 'article'} at its source`}><ArrowUpRight size={18} /></a> : <span className="news-open-link disabled" aria-hidden="true"><ArrowUpRight size={18} /></span>}
    </article>
  );
}
