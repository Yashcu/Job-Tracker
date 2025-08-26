// src/features/dashboard/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      {/* The main content area will now fill the entire space */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;