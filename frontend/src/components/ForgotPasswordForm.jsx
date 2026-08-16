import { useState } from 'react';

export default function ForgotPasswordForm({ onSubmit, onSwitchToLogin, error, message }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ email });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-header">
        <p className="eyebrow">Adama CCTV Registration</p>
        <h1>Forgot Password</h1>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Registered Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
          />
        </label>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <button className="auth-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Recovery Email'}
        </button>

        <div className="auth-footer">
          <span>Remembered your password?</span>
          <button type="button" className="auth-link" onClick={onSwitchToLogin}>
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
