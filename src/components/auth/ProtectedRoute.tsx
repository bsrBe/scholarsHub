import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Rendering', { loading, user, path: location.pathname });

  if (loading) {
    console.log('ProtectedRoute: Loading authentication state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    // Save the current location they were trying to go to when they were redirected
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if the route is admin-only and if the user is an admin
  if (adminOnly && user.role !== 'admin') {
    console.log('ProtectedRoute: Admin access required');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};
