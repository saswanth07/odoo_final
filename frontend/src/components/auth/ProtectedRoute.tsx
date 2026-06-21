import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { canAccessPage, getDefaultRoute } from '@/lib/roles';
import { PermissionDenied } from '@/pages/PermissionDenied';

const routeToPage: Record<string, string> = {
  '/': 'dashboard',
  '/pos': 'pos',
  '/orders': 'orders',
  '/products': 'products',
  '/categories': 'categories',
  '/customers': 'customers',
  '/employees': 'employees',
  '/kitchen': 'kitchen',
  '/tables': 'tables',
  '/floors': 'floors',
  '/payments': 'payments',
  '/coupons': 'coupons',
  '/promotions': 'promotions',
  '/feedback': 'feedback',
  '/reports': 'reports',
  '/qr': 'qr',
  '/receipt': 'receipt',
  '/settings': 'settings',
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/' && user && !canAccessPage(user.role, 'dashboard')) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  const page = routeToPage[location.pathname];
  if (page && !canAccessPage(user!.role, page)) {
    if (fallback) return <>{fallback}</>;
    return <PermissionDenied />;
  }

  return <>{children}</>;
}

