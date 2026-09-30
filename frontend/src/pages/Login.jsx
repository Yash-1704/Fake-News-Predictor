import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage({ onSuccess, onSwitchToRegister, onBack }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header-row">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← Back
          </button>
        </div>

        <h1>Login</h1>
        <p className="auth-subtitle">Use your account to unlock fact-checking.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Need an account?{' '}
          <button type="button" className="link-button" onClick={onSwitchToRegister}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
