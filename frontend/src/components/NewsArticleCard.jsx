import { ArrowUpRight } from 'lucide-react';

function formatPublishedDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function NewsArticleCard({ article, index = 0 }) {
  return (
    <article className={`news-row${index === 0 ? ' news-row-lead' : ''}`}>
      <div className="news-row-body">
        <div className="news-meta"><span className="news-source">{article.source || 'Unknown source'}</span><time dateTime={article.publishedAt}>{formatPublishedDate(article.publishedAt)}</time></div>
        <h2>{article.title || 'Untitled article'}</h2>
        {article.snippet && <p>{article.snippet}</p>}
      </div>
      {article.url ? <a className="news-open-link" href={article.url} target="_blank" rel="noreferrer" aria-label={`Open ${article.title || 'article'} at its source`}>Read <ArrowUpRight size={15} /></a> : <span className="news-open-link disabled" aria-hidden="true">Read <ArrowUpRight size={15} /></span>}
    </article>
  );
}
