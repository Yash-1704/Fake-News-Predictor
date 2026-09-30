import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export function RequireAuth({ children, onRequestLogin }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="page-shell content-page"><div className="loading-line" role="status"><span className="loading-pulse" /> Checking your session…</div></main>;
  }

  if (!user) {
    return (
      <main className="page-shell content-page gate-page">
        <div className="gate-mark"><LockKeyhole size={22} /></div>
        <span className="section-kicker">ACCOUNT REQUIRED</span>
        <h1>Settings are for signed-in readers.</h1>
        <p>Sign in to manage your account email and weekly digest preference.</p>
        <button className="button button-primary" type="button" onClick={() => onRequestLogin('login')}>Sign in <ArrowRight size={16} /></button>
      </main>
    );
  }

  return children;
}
