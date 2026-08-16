import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, page } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  if (page === 'register') {
    return <Register />;
  }

  if (page === 'forgot-password') {
    return <ForgotPassword />;
  }

  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
