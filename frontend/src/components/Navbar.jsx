import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, FileText, LogOut, Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export function Navbar({ theme, onToggleTheme, onOpenAuth, onLogout }) {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/" onClick={closeMobile} aria-label="News Pattern Analyzer home">
          <span className="brand-mark"><FileText size={19} strokeWidth={1.8} /></span>
          <span className="brand-name">News<span>Signal</span></span>
        </Link>

        <button
          className="icon-button mobile-menu-button"
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`nav-content ${mobileOpen ? 'nav-content-open' : ''}`}>
          <nav className="primary-nav" aria-label="Main navigation">
            <NavLink to="/" end onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Analyze</NavLink>
            <NavLink to="/news" onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>News feed</NavLink>
            <NavLink to="/about" onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>About</NavLink>
          </nav>

          <div className="nav-actions">
            <button
              className="icon-button theme-toggle"
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {loading ? (
              <span className="nav-loading" role="status">Checking session…</span>
            ) : user ? (
              <details className="profile-menu">
                <summary className="profile-trigger">
                  <span className="avatar-mark" aria-hidden="true">{user.email?.slice(0, 1).toUpperCase()}</span>
                  <span className="profile-email">{user.email}</span>
                  <ChevronDown size={15} />
                </summary>
                <div className="profile-dropdown">
                  <span className="dropdown-label">ACCOUNT</span>
                  <span className="dropdown-email">{user.email}</span>
                  <Link to="/settings" onClick={closeMobile}><Settings size={16} /> Settings</Link>
                  <button type="button" onClick={() => { closeMobile(); onLogout(); }}><LogOut size={16} /> Sign out</button>
                </div>
              </details>
            ) : (
              <div className="guest-actions">
                <button className="button button-quiet" type="button" onClick={() => { closeMobile(); onOpenAuth('login'); }}>Sign in</button>
                <button className="button button-small-primary" type="button" onClick={() => { closeMobile(); onOpenAuth('register'); }}>Create account</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
