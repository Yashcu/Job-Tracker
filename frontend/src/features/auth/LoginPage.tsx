// frontend/src/features/auth/LoginPage.tsx
import { useSearchParams, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Registration successful! Please log in.");
      // Clean up the URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm isRegister={false} />;
};

export default LoginPage;
