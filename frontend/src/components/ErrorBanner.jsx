import { CircleAlert } from 'lucide-react';

export function ErrorBanner({ message }) {
  const display =
    message && (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('502') || message.includes('503'))
      ? 'Cannot reach the application API. Make sure the server is running on port 4000.'
      : message || 'An unexpected error occurred.';

  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <CircleAlert size={18} aria-hidden="true" />
      <span>{display}</span>
    </div>
  );
}
