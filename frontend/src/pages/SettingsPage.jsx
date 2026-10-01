import { useState } from 'react';
import { BellRing, CircleCheck, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { ProfileAvatar } from '../components/ProfileAvatar';

export function SettingsPage() {
  const { user, setEmailOptIn, saveProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || user?.email?.split('@')[0] || '');
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [pendingPreference, setPendingPreference] = useState(null);
  const enabled = pendingPreference ?? Boolean(user?.emailOptIn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileSaved(false);
    setProfileError('');
    try {
      const updated = await saveProfile({ displayName: displayName.trim(), profileImageUrl: profileImageUrl.trim() });
      setDisplayName(updated.displayName || '');
      setProfileImageUrl(updated.profileImageUrl || '');
      setProfileSaved(true);
    } catch (requestError) {
      setProfileError(requestError.message || 'Could not save your profile.');
    } finally {
      setProfileSaving(false);
    }
  }

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
        <form className="profile-edit-form" onSubmit={handleProfileSubmit}>
          <div className="profile-edit-heading">
            <ProfileAvatar displayName={displayName} email={user?.email} imageUrl={profileImageUrl} size="large" />
            <div><strong>Profile details</strong><small>Name and picture shown in your account menu.</small></div>
          </div>
          <label htmlFor="profile-display-name">Display name</label>
          <input id="profile-display-name" type="text" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={60} required />
          <label htmlFor="profile-image-url">Profile picture URL</label>
          <input id="profile-image-url" type="url" value={profileImageUrl} onChange={(event) => setProfileImageUrl(event.target.value)} maxLength={500} placeholder="https://example.com/photo.jpg" />
          {profileError && <p className="settings-feedback error" role="alert">{profileError}</p>}
          {profileSaved && <p className="settings-feedback success" role="status"><CircleCheck size={15} /> Profile saved.</p>}
          <button className="button button-outline profile-save" type="submit" disabled={profileSaving || !displayName.trim()}>{profileSaving ? 'Saving…' : 'Save profile'}</button>
        </form>
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

      <p className="settings-footnote">Password reset and account deletion are not currently available.</p>
    </main>
  );
}
