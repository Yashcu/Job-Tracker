// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './app/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardLayout from './features/dashboard/DashboardLayout';
import JobBoard from './features/jobs/JobBoard';
import AnalyticsPage from './features/dashboard/AnalyticsPage'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Render the JobBoard as the main dashboard view */}
          <Route index element={<JobBoard />} /> 
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;