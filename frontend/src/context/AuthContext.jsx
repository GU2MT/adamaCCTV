import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authServiceClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [error, setError] = useState('');

  useEffect(() => {
    const existingUser = authService.loadActiveUser();
    if (existingUser) {
      setUser(existingUser);
      authService.getCurrentUser().then((freshUser) => {
        if (freshUser) {
          setUser(freshUser);
        }
      }).catch(() => {
        authService.signOut();
        setUser(null);
      });
    }
  }, []);

  const signIn = async (credentials) => {
    setError('');

    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
      throw err;
    }
  };

  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const signUp = async (form) => {
    setError('');
    setForgotPasswordMessage('');

    try {
      await authService.register(form);
      setPage('login');
    } catch (err) {
      setError(err.message || 'Unable to register.');
      throw err;
    }
  };

  const forgotPassword = async ({ email }) => {
    setError('');
    setForgotPasswordMessage('');

    try {
      const response = await authService.forgotPassword({ email });
      setForgotPasswordMessage(response.message || 'Recovery instructions sent if that email exists.');
      return response;
    } catch (err) {
      setError(err.message || 'Unable to send recovery instructions.');
      throw err;
    }
  };

  const signOut = () => {
    authService.signOut();
    setUser(null);
    setPage('login');
    setForgotPasswordMessage('');
  };

  const goToRegister = () => {
    setError('');
    setForgotPasswordMessage('');
    setPage('register');
  };

  const goToLogin = () => {
    setError('');
    setForgotPasswordMessage('');
    setPage('login');
  };

  const goToForgotPassword = () => {
    setError('');
    setForgotPasswordMessage('');
    setPage('forgot-password');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        page,
        error,
        forgotPasswordMessage,
        signIn,
        signUp,
        forgotPassword,
        signOut,
        goToRegister,
        goToLogin,
        goToForgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
