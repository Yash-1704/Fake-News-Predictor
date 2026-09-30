import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { RequireAuth } from './components/RequireAuth';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import NewsFeed from './pages/NewsFeed';
import { SettingsPage } from './pages/SettingsPage';
import './styles.css';

function NotFoundPage() {
  return (
    <main className="page-shell content-page not-found-page">
      <span className="section-kicker">PAGE NOT FOUND</span>
      <h1>This page isn't in the feed.</h1>
      <Link className="button button-primary" to="/">Return to analysis <ArrowUpRight size={16} /></Link>
    </main>
  );
}

function AppShell() {
  const { logout } = useAuth();
  const [authModal, setAuthModal] = useState(null);
  const [logoutError, setLogoutError] = useState('');
  const [theme, setTheme] = useState(() => window.localStorage.getItem('news-signal-theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('news-signal-theme', theme);
  }, [theme]);

  function openAuth(mode = 'login', afterAuthenticated = null) {
    setAuthModal({ mode, afterAuthenticated });
  }

  async function handleLogout() {
    setLogoutError('');
    try {
      await logout();
    } catch (error) {
      setLogoutError(error.message || 'Could not sign out. Please try again.');
    }
  }

  return (
    <div className="site-app">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />
      {logoutError && <div className="global-notice" role="alert"><CircleAlert size={16} />{logoutError}</div>}

      <Routes>
        <Route path="/" element={<HomePage onOpenAuth={openAuth} />} />
        <Route path="/news" element={<NewsFeed onOpenAuth={openAuth} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<RequireAuth onRequestLogin={openAuth}><SettingsPage /></RequireAuth>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <footer className="site-footer page-shell">
        <Link to="/" className="footer-brand">NewsSignal <span>·</span> Text-pattern analysis</Link>
        <p>AI outputs are limited assessments, not evidence of truth.</p>
        <Link to="/about">How it works <ArrowUpRight size={14} /></Link>
      </footer>

      {authModal && (
        <AuthModal
          key={authModal.mode}
          initialMode={authModal.mode}
          onClose={() => setAuthModal(null)}
          onAuthenticated={(user) => {
            const afterAuthenticated = authModal.afterAuthenticated;
            setAuthModal(null);
            afterAuthenticated?.(user);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
