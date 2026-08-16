import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp, error, goToLogin } = useAuth();

  return <RegisterForm onSubmit={signUp} onSwitchToLogin={goToLogin} error={error} />;
}
