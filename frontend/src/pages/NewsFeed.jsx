import { useEffect, useState } from 'react';
import { ArrowRight, LoaderCircle, Newspaper, RefreshCw, Search } from 'lucide-react';
import { getNews } from '../api';
import { useAuth } from '../context/useAuth';
import { NewsArticleCard } from '../components/NewsArticleCard';

export default function NewsFeed({ onOpenAuth }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedTopic, setAppliedTopic] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [feedState, setFeedState] = useState({ key: '', status: 'loading', items: [], error: '' });
  const requestKey = `${appliedTopic}\u0000${user?.email || 'guest'}\u0000${refreshKey}`;
  const isCurrentRequest = feedState.key === requestKey;
  const status = isCurrentRequest ? feedState.status : 'loading';
  const items = isCurrentRequest ? feedState.items : [];
  const error = isCurrentRequest ? feedState.error : '';

  useEffect(() => {
    const controller = new AbortController();
    getNews(appliedTopic, { signal: controller.signal })
      .then((data) => setFeedState({ key: requestKey, status: 'success', items: Array.isArray(data.items) ? data.items : [], error: '' }))
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return;
        setFeedState({ key: requestKey, status: 'error', items: [], error: requestError.message || 'Could not load the news feed.' });
      });
    return () => controller.abort();
  }, [appliedTopic, requestKey]);

  function handleSearch(event) {
    event.preventDefault();
    setAppliedTopic(searchTerm.trim());
    if (searchTerm.trim() === appliedTopic) setRefreshKey((value) => value + 1);
  }

  return (
    <main className="page-shell content-page news-page">
      <header className="page-heading news-heading">
        <span className="section-kicker">THE READING LIST <span>02</span></span>
        <h1>Headlines, with context.</h1>
        <p>Stories from the existing news cache. Read the source before drawing conclusions.</p>
      </header>

      <form className="news-search" onSubmit={handleSearch} role="search">
        <label className="sr-only" htmlFor="news-topic">Search headlines by topic</label>
        <Search size={18} aria-hidden="true" />
        <input id="news-topic" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search a topic" />
        {searchTerm && <button className="text-button" type="button" onClick={() => { setSearchTerm(''); setAppliedTopic(''); }}>Clear</button>}
        <button className="button button-primary" type="submit">Search</button>
      </form>

      <div className="feed-heading-row">
        <div><span className="section-kicker">{appliedTopic ? 'TOPIC RESULTS' : 'LATEST STORIES'}</span><h2>{appliedTopic || 'Recent headlines'}</h2></div>
        {status === 'success' && <span className="feed-count">{items.length} {items.length === 1 ? 'story' : 'stories'}</span>}
      </div>

      {status === 'loading' && <div className="loading-line" role="status"><LoaderCircle size={17} className="spin-icon" /> Loading headlines…</div>}
      {status === 'error' && <div className="inline-error" role="alert"><Newspaper size={18} /><div><strong>Headlines couldn't load.</strong><p>{error}</p><button className="text-button" type="button" onClick={() => setRefreshKey((value) => value + 1)}><RefreshCw size={14} /> Try again</button></div></div>}
      {status === 'success' && items.length === 0 && <div className="empty-state"><Newspaper size={22} /><h3>No headlines found</h3><p>Try a different topic.</p></div>}
      {status === 'success' && items.length > 0 && (
        <div className="news-list">{items.map((item, index) => <NewsArticleCard key={item.url || `${item.title}-${index}`} article={item} index={index} />)}</div>
      )}

      {!user && status === 'success' && (
        <aside className="feed-gate">
          <div><span className="section-kicker">READER PREVIEW</span><h2>Keep exploring the full feed.</h2><p>Sign in to view up to twenty cached headlines at a time.</p></div>
          <button className="button button-primary" type="button" onClick={() => onOpenAuth('login')}>Sign in <ArrowRight size={16} /></button>
        </aside>
      )}
    </main>
  );
}
