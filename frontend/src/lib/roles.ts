export type UserRole = 'admin' | 'employee' | 'customer' | 'kitchen';

export interface Permission {
  page: string;
  actions: string[];
}

export const ROLES: Record<UserRole, { label: string; badge: string; color: string }> = {
  admin: { label: 'Administrator', badge: 'ADMIN', color: 'bg-[#6B4E3D] text-white' },
  employee: { label: 'Employee', badge: 'EMPLOYEE', color: 'bg-[#8B7355] text-white' },
  customer: { label: 'Customer', badge: 'CUSTOMER', color: 'bg-[#6B7F59] text-white' },
  kitchen: { label: 'Kitchen Staff', badge: 'KITCHEN', color: 'bg-[#C9A84C] text-white' },
};

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { page: 'dashboard', actions: ['view'] },
    { page: 'products', actions: ['view', 'create', 'edit', 'delete'] },
    { page: 'categories', actions: ['view', 'create', 'edit', 'delete'] },
    { page: 'employees', actions: ['view', 'create', 'edit', 'delete', 'archive', 'reset_password'] },
    { page: 'tables', actions: ['view', 'create', 'edit', 'activate', 'deactivate'] },
    { page: 'floors', actions: ['view', 'create', 'edit', 'delete'] },
    { page: 'payments', actions: ['view', 'configure', 'enable', 'disable'] },
    { page: 'coupons', actions: ['view', 'create', 'edit', 'delete'] },
    { page: 'promotions', actions: ['view', 'create', 'edit', 'disable'] },
    { page: 'self_ordering', actions: ['view', 'configure'] },
    { page: 'kitchen', actions: ['view', 'monitor'] },
    { page: 'reports', actions: ['view', 'export_pdf', 'export_excel'] },
    { page: 'settings', actions: ['view', 'configure'] },
    { page: 'pos', actions: ['view', 'open_session', 'close_session'] },
    { page: 'orders', actions: ['view', 'edit', 'delete'] },
    { page: 'customers', actions: ['view', 'create', 'edit', 'delete'] },
    { page: 'receipt', actions: ['view', 'print', 'email', 'download'] },
    { page: 'receipts', actions: ['view', 'search', 'print', 'download', 'email'] },
    { page: 'feedback', actions: ['view'] },
    { page: 'track_order', actions: ['view'] },
  ],
  employee: [
    { page: 'pos', actions: ['view', 'open_session', 'close_session'] },
    { page: 'orders', actions: ['view', 'edit', 'delete'] },
    { page: 'customers', actions: ['view', 'create', 'edit', 'delete'] },
    { page: 'tables', actions: ['view', 'select', 'switch'] },
    { page: 'receipt', actions: ['view', 'print', 'email'] },
    { page: 'receipts', actions: ['view', 'search', 'print', 'download', 'email'] },
    { page: 'products', actions: ['view', 'search', 'add_to_cart'] },
    { page: 'payments', actions: ['view', 'process_cash', 'process_card', 'process_upi', 'cancel'] },
    { page: 'coupons', actions: ['view', 'apply'] },
    { page: 'promotions', actions: ['view'] },
  ],
  customer: [
    { page: 'pos', actions: ['view'] },
    { page: 'self_ordering', actions: ['view', 'browse', 'search', 'add_to_cart', 'place_order'] },
    { page: 'orders', actions: ['view', 'track'] },
    { page: 'receipt', actions: ['view', 'download'] },
    { page: 'products', actions: ['view', 'search', 'add_to_cart'] },
    { page: 'coupons', actions: ['view', 'apply'] },
    { page: 'track_order', actions: ['view'] },
  ],
  kitchen: [
    { page: 'kitchen', actions: ['view', 'update_status', 'mark_complete', 'filter'] },
    { page: 'orders', actions: ['view', 'search', 'filter'] },
  ],
};

export const SIDEBAR_ITEMS: Record<UserRole, { path: string; label: string; icon: string }[]> = {
  admin: [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/pos', label: 'POS', icon: 'ShoppingCart' },
    { path: '/orders', label: 'Orders', icon: 'ClipboardList' },
    { path: '/products', label: 'Products', icon: 'Package' },
    { path: '/categories', label: 'Categories', icon: 'FolderTree' },
    { path: '/customers', label: 'Customers', icon: 'Users' },
    { path: '/employees', label: 'Employees', icon: 'UserCheck' },
    { path: '/kitchen', label: 'Kitchen', icon: 'ChefHat' },
    { path: '/tables', label: 'Tables', icon: 'Table' },
    { path: '/floors', label: 'Floor Mgmt', icon: 'Map' },
    { path: '/payments', label: 'Payments', icon: 'CreditCard' },
    { path: '/coupons', label: 'Coupons', icon: 'Ticket' },
    { path: '/promotions', label: 'Promotions', icon: 'Megaphone' },
    { path: '/feedback', label: 'Feedback', icon: 'MessageSquare' },
    { path: '/reports', label: 'Reports', icon: 'BarChart3' },
    { path: '/receipts', label: 'Receipts', icon: 'Receipt' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  employee: [
    { path: '/pos', label: 'POS', icon: 'ShoppingCart' },
    { path: '/orders', label: 'Orders', icon: 'ClipboardList' },
    { path: '/customers', label: 'Customers', icon: 'Users' },
    { path: '/tables', label: 'Tables', icon: 'Table' },
    { path: '/receipts', label: 'Receipts', icon: 'Receipt' },
  ],
  customer: [
    { path: '/pos', label: 'Menu', icon: 'ShoppingCart' },
    { path: '/orders', label: 'Orders', icon: 'ClipboardList' },
    { path: '/track-order', label: 'Track Order', icon: 'QrCode' },
  ],
  kitchen: [
    { path: '/kitchen', label: 'Kitchen Board', icon: 'ChefHat' },
    { path: '/orders', label: 'Order Queue', icon: 'ClipboardList' },
  ],
};

export function hasPermission(role: UserRole, page: string, action: string = 'view'): boolean {
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  const pagePerm = perms.find((p) => p.page === page);
  if (!pagePerm) return false;
  return pagePerm.actions.includes(action);
}

export function canAccessPage(role: UserRole, page: string): boolean {
  return hasPermission(role, page, 'view');
}

export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'admin': return '/';
    case 'employee': return '/pos';
    case 'customer': return '/pos';
    case 'kitchen': return '/kitchen';
    default: return '/';
  }
}
