// src/app/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const ProtectedRoute = () => {
  const { token, isLoading} = useAuth();
  if(isLoading){
    return <div>Loading...</div>
  }

  if(token){
    return <Outlet/>
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;