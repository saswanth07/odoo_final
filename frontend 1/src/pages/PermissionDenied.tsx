import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getDefaultRoute } from '@/lib/roles';

export function PermissionDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-2xl bg-[#C75B39]/20 flex items-center justify-center mb-6"
      >
        <ShieldAlert className="w-10 h-10 text-[#C75B39]" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        Access Denied
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-[#8B7355] max-w-md mb-6"
      >
        Your current role <span className="text-white font-medium">({user?.role})</span> does not have permission to access this page.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate(getDefaultRoute(user?.role || 'employee'))}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </motion.button>
    </div>
  );
}
