import { useState } from 'react';

export function ProfileAvatar({ displayName, email, imageUrl, size = 'regular' }) {
  const [failedUrl, setFailedUrl] = useState('');
  const label = displayName?.trim() || email?.trim() || 'Reader';
  const initials = label.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  const showImage = Boolean(imageUrl) && failedUrl !== imageUrl;

  return (
    <span className={`profile-avatar profile-avatar-${size}`} aria-label={`${label} profile picture`}>
      {showImage
        ? <img src={imageUrl} alt="" referrerPolicy="no-referrer" onError={() => setFailedUrl(imageUrl)} />
        : <span aria-hidden="true">{initials || 'R'}</span>}
    </span>
  );
}
