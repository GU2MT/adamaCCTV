import LoginForm from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, error, goToRegister, goToForgotPassword } = useAuth();

  return (
    <LoginForm
      onSubmit={signIn}
      onSwitchToRegister={goToRegister}
      onForgotPassword={goToForgotPassword}
      error={error}
    />
  );
}
