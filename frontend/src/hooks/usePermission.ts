import { useAuth } from '@/lib/auth';
import { hasPermission, canAccessPage } from '@/lib/roles';

export function usePermission() {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  return {
    can: (page: string, action?: string) => hasPermission(role, page, action),
    canView: (page: string) => canAccessPage(role, page),
    role,
    isAdmin: role === 'admin',
    isEmployee: role === 'employee',
    isCustomer: role === 'customer',
    isKitchen: role === 'kitchen',
  };
}
