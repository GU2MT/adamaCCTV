import { useState } from 'react';

export default function RegisterForm({ onSubmit, onSwitchToLogin, error }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    role_id: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-header">
        <p className="eyebrow">Adama CCTV Registration</p>
        <h1>Create an Account</h1>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />
        </label>

        <label>
          Last Name
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </label>

        <label>
          Gender
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </label>

        <label>
          Address
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </label>

        <label className="password-field">
          Password
          <div className="password-input-row">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
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

        <label className="password-field">
          Confirm Password
          <div className="password-input-row">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((current) => !current)}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button type="button" className="auth-link" onClick={onSwitchToLogin}>
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
