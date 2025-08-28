// src/features/auth/RegisterPage.tsx
import { Navigate } from "react-router-dom"; // Import Navigate
import AuthForm from "./components/AuthForm";
import { useAuth } from "./AuthContext";

const RegisterPage = () => {
  const { token } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm isRegister={true} />;
};

export default RegisterPage;
