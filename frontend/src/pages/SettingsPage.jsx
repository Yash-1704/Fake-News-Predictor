import { useState } from 'react';
import { BellRing, CircleCheck, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export function SettingsPage() {
  const { user, setEmailOptIn } = useAuth();
  const [pendingPreference, setPendingPreference] = useState(null);
  const enabled = pendingPreference ?? Boolean(user?.emailOptIn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleDigestChange(event) {
    const nextValue = event.target.checked;
    setPendingPreference(nextValue);
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await setEmailOptIn(nextValue);
      setPendingPreference(null);
      setSaved(true);
    } catch (requestError) {
      setPendingPreference(null);
      setError(requestError.message || 'Could not save your preference.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell content-page settings-page">
      <header className="page-heading">
        <span className="section-kicker">YOUR ACCOUNT <span>04</span></span>
        <h1>Settings</h1>
        <p>Manage the account details and email preference supported by this project.</p>
      </header>

      <section className="settings-section">
        <div className="settings-section-heading"><ShieldCheck size={18} /><div><h2>Account</h2><p>Your signed-in account</p></div></div>
        <div className="setting-row account-row"><span>Email address</span><strong>{user?.email}</strong></div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading"><BellRing size={18} /><div><h2>Email digest</h2><p>Choose whether to receive the existing weekly digest.</p></div></div>
        <label className="setting-row preference-row" htmlFor="weekly-digest">
          <span className="setting-copy"><Mail size={18} /><span><strong>Weekly most-checked articles</strong><small>One email with the most-checked articles from the past week.</small></span></span>
          <input id="weekly-digest" type="checkbox" checked={enabled} onChange={handleDigestChange} disabled={saving} />
        </label>
        {saving && <p className="settings-feedback" role="status">Saving preference…</p>}
        {saved && <p className="settings-feedback success" role="status"><CircleCheck size={15} /> Preference saved.</p>}
        {error && <p className="settings-feedback error" role="alert">{error}</p>}
      </section>

      <p className="settings-footnote">Profile editing, password reset, and account deletion are not currently available.</p>
    </main>
  );
}
