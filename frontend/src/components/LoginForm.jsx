import { useState } from 'react';

export default function LoginForm({ onSubmit, onSwitchToRegister, onForgotPassword, error }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ identifier, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-header">
        <p className="eyebrow">Adama CCTV Registration</p>
        <h1>Welcome Back</h1>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email or Phone
          <input
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Email or phone"
          />
        </label>

        <label className="password-field">
          Password
          <div className="password-input-row">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="auth-footer">
          <button type="button" className="auth-link" onClick={onForgotPassword}>
            Forgot Password?
          </button>
          <span>Don't have an account?</span>
          <button type="button" className="auth-link" onClick={onSwitchToRegister}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
