import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  FolderTree,
  Users,
  UserCheck,
  ChefHat,
  Table,
  Map,
  CreditCard,
  Ticket,
  Megaphone,
  MessageSquare,
  BarChart3,
  QrCode,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  Coffee,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { SIDEBAR_ITEMS } from '@/lib/roles';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  FolderTree,
  Users,
  UserCheck,
  ChefHat,
  Table,
  Map,
  CreditCard,
  Ticket,
  Megaphone,
  MessageSquare,
  BarChart3,
  QrCode,
  Receipt,
  Settings,
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [hovered, setHovered] = useState<string | null>(null);

  const role = user?.role || 'admin';
  const menuItems = SIDEBAR_ITEMS[role] || SIDEBAR_ITEMS.admin;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-50 h-screen flex flex-col border-r border-[#D4C4A8]/30 bg-[#FDF5ED]/90 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#D4C4A8]/30">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl gradient-coffee flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-[#2C1E14] tracking-tight font-display">CafePOS</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-xl gradient-coffee flex items-center justify-center mx-auto shadow-md">
            <Coffee className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-lg bg-[#D4C4A8]/20 hover:bg-[#D4C4A8]/40 flex items-center justify-center transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-[#6B4E3D]" /> : <ChevronLeft className="w-4 h-4 text-[#6B4E3D]" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onMouseEnter={() => setHovered(item.path)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative',
                    isActive
                      ? 'bg-[#6B4E3D]/10 text-[#6B4E3D]'
                      : 'text-[#8B7355] hover:bg-[#D4C4A8]/20 hover:text-[#4A3428]'
                  )}
                >
                  <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-[#6B4E3D]')} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute right-0 w-1 h-6 rounded-l-full bg-[#6B4E3D]"
                    />
                  )}
                  {collapsed && hovered === item.path && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#FDF5ED] border border-[#D4C4A8]/30 rounded-lg text-sm text-[#4A3428] whitespace-nowrap z-50 shadow-xl font-medium">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-[#D4C4A8]/30">
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 w-full',
            'text-[#8B7355] hover:bg-[#D4C4A8]/20 hover:text-[#C75B39]'
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
