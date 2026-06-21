import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingCart, ClipboardList, QrCode, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function CustomerNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/pos', label: 'Menu', icon: ShoppingCart },
    { path: '/orders', label: 'Orders', icon: ClipboardList },
    { path: '/track-order', label: 'Track Order', icon: QrCode },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#D4C4A8]/30 bg-[#FDF5ED]/90 dark:bg-[#1A110B]/90 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/pos" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-coffee flex items-center justify-center shadow-md">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[#2C1E14] dark:text-[#F5F0E8] tracking-tight font-display">CafePOS</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#6B4E3D] text-white shadow-sm"
                      : "text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#FDF5ED] hover:bg-[#6B4E3D]/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right section actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 dark:bg-[#2C1E14]/50 hover:bg-[#D4C4A8]/30 dark:hover:bg-[#4A3428]/30 flex items-center justify-center transition-colors text-[#8B7355] dark:text-[#A08A75]"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#D4C4A8]/30">
              <div className="w-8 h-8 rounded-full bg-[#6B7F59] text-white flex items-center justify-center font-semibold text-sm">
                {user?.avatar || 'CU'}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#2C1E14] dark:text-[#F5F0E8] leading-none">{user?.name || 'Customer'}</p>
                <p className="text-[10px] text-[#8B7355] dark:text-[#A08A75] leading-none mt-1">Table Guest</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors text-red-600 dark:text-red-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 dark:bg-[#2C1E14]/50 flex items-center justify-center text-[#8B7355] dark:text-[#A08A75]"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 dark:bg-[#2C1E14]/50 flex items-center justify-center text-[#8B7355] dark:text-[#A08A75]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D4C4A8]/30 bg-[#FDF5ED] dark:bg-[#1A110B] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#6B4E3D] text-white"
                    : "text-[#8B7355] dark:text-[#A08A75] hover:bg-[#6B4E3D]/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#D4C4A8]/20 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6B7F59] text-white flex items-center justify-center font-semibold text-sm">
                {user?.avatar || 'CU'}
              </div>
              <span className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{user?.name || 'Customer'}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
