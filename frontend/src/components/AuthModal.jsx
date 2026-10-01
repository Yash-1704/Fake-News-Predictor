import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { ProfileAvatar } from './ProfileAvatar';

export function AuthModal({ initialMode = 'login', onClose, onAuthenticated }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape' && !loading) onClose();
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [loading, onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = isRegister
        ? await register(email.trim(), password, { displayName: displayName.trim(), profileImageUrl: profileImageUrl.trim() })
        : await login(email.trim(), password);
      onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message || (isRegister ? 'Could not create your account.' : 'Could not sign in.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !loading && onClose()}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button modal-close" type="button" onClick={onClose} disabled={loading} aria-label="Close sign-in dialog">
          <X size={19} />
        </button>
        <h2 id="auth-title">{isRegister ? 'Create an account' : 'Welcome back'}</h2>
        <p className="modal-copy">
          {isRegister ? 'Sign in to unlock AI fact-checking and your weekly digest settings.' : 'Sign in to continue with AI fact-checking and your account settings.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="auth-display-name">Name</label>
              <input
                id="auth-display-name"
                type="text"
                autoComplete="name"
                maxLength={60}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
              />
              <label htmlFor="auth-profile-image">Profile picture URL <span>(optional)</span></label>
              <input
                id="auth-profile-image"
                type="url"
                autoComplete="url"
                maxLength={500}
                value={profileImageUrl}
                onChange={(event) => setProfileImageUrl(event.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
              <div className="auth-avatar-preview">
                <ProfileAvatar displayName={displayName} email={email} imageUrl={profileImageUrl} />
                <span>{profileImageUrl.trim() ? 'Preview' : 'Your initials appear until you add a picture URL.'}</span>
              </div>
            </>
          )}
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            minLength={isRegister ? 8 : undefined}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to the project?'}{' '}
          <button
            type="button"
            className="text-button"
            onClick={() => { setError(''); setMode(isRegister ? 'login' : 'register'); }}
            disabled={loading}
          >
            {isRegister ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </section>
    </div>
  );
}
