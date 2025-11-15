import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import { DashboardPage, MeetingsPage, UsersPage } from '../pages/admin';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AdminRoutes: React.FC = () => {
  return (
    <AdminRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminRoutes;
