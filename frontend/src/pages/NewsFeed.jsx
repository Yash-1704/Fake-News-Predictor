import { useEffect, useState } from 'react';

export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      try {
        const response = await fetch('/api/news', { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Could not load the news feed.');
        }

        if (active) {
          setItems(data.items || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFeed();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <section><h2>Latest headlines</h2><p>Loading news…</p></section>;
  }

  if (error) {
    return <section><h2>Latest headlines</h2><p role="alert">{error}</p></section>;
  }

  return (
    <section>
      <h2>Latest headlines</h2>
      {items.length === 0 ? (
        <p>No headlines are available right now.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.url || item.title}>
              <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
              <div>
                <span>{item.source}</span>
                <span> · </span>
                <time dateTime={item.publishedAt}>{new Date(item.publishedAt).toLocaleDateString()}</time>
              </div>
              {item.snippet && <p>{item.snippet}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
