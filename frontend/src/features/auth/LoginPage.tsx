// src/features/auth/LoginPage.tsx
import { useSearchParams, Navigate } from 'react-router-dom'; // Import Navigate
import AuthForm from './AuthForm';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  
  useEffect(() => {
    if (searchParams.get('success') && !token) {
      toast.success('Registration successful! Please log in.');
    }
  }, [searchParams, token]);

  // If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm isRegister={false} />;
};

export default LoginPage;