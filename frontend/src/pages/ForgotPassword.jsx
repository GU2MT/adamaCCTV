import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword, goToLogin, error, forgotPasswordMessage } = useAuth();

  return (
    <ForgotPasswordForm
      onSubmit={forgotPassword}
      onSwitchToLogin={goToLogin}
      error={error}
      message={forgotPasswordMessage}
    />
  );
}
