import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CustomerNavbar } from './CustomerNavbar';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/lib/auth';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isCustomer = user?.role === 'customer';

  return (
    <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1A110B] text-[#2C1E14] dark:text-[#F5F0E8] transition-colors duration-300">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Navbar collapsed={collapsed} />
      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
      <Toaster position="top-right" />
    </div>
  );
}

