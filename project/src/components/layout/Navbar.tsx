import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, Search, X, Check, Clock, Coffee, ShoppingCart, User, Megaphone } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { getNotifications, markAsRead as apiMarkAsRead, markAllRead as apiMarkAllRead } from '@/lib/notifications';
import { cn } from '@/lib/utils';

interface NavbarProps {
  collapsed: boolean;
}

export function Navbar({ collapsed }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    setNotifs(getNotifications());

    const handleUpdate = () => {
      setNotifs(getNotifications());
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cafe_notifications') {
        handleUpdate();
      }
    };

    window.addEventListener('notifications-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('notifications-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const markAsRead = (id: string) => {
    apiMarkAsRead(id);
  };

  const markAllRead = () => {
    apiMarkAllRead();
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'Order': return <ShoppingCart className="w-4 h-4 text-[#6B4E3D]" />;
      case 'Payment': return <Check className="w-4 h-4 text-[#6B7F59]" />;
      case 'Employee': return <User className="w-4 h-4 text-[#C9A84C]" />;
      case 'Feedback': return <Coffee className="w-4 h-4 text-[#C75B39]" />;
      case 'Promotion': return <Megaphone className="w-4 h-4 text-[#C75B39]" />;
      default: return <Coffee className="w-4 h-4 text-[#6B4E3D]" />;
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-[#D4C4A8]/30 bg-[#FDF5ED]/90 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'left-[72px]' : 'left-[260px]'
      )}
    >
      <div className="flex items-center gap-4">
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 320 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                <input
                  type="text"
                  placeholder="Search orders, products, customers..."
                  className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#EDE5D8]/50 border border-[#D4C4A8]/40 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/30 text-sm"
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-[#8B7355] hover:text-[#4A3428]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4 text-[#8B7355]" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C9A84C]" /> : <Moon className="w-4 h-4 text-[#6B4E3D]" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4 text-[#8B7355]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C75B39] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-96 bg-[#FDF5ED] border border-[#D4C4A8]/30 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#D4C4A8]/30">
                    <h3 className="font-semibold text-[#2C1E14] text-sm font-display">Notifications</h3>
                    <button onClick={markAllRead} className="text-xs text-[#6B4E3D] hover:text-[#C75B39] font-medium">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                    {notifs.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          setShowNotifications(false);
                        }}
                        className={cn(
                          'flex items-start gap-3 p-4 border-b border-[#D4C4A8]/10 cursor-pointer hover:bg-[#EDE5D8]/30 transition-colors',
                          !notif.read && 'bg-[#6B4E3D]/5'
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#EDE5D8] flex items-center justify-center shrink-0">
                          {typeIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2C1E14] truncate">{notif.title}</p>
                          <p className="text-xs text-[#8B7355] mt-0.5">{notif.message}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock className="w-3 h-3 text-[#8B7355]" />
                            <span className="text-[10px] text-[#8B7355]">{notif.time}</span>
                          </div>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-[#C75B39] shrink-0 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-[#D4C4A8]/30">
          <div className="w-8 h-8 rounded-full gradient-coffee flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {user?.avatar || 'AD'}
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[#2C1E14] leading-tight">{user?.name || 'Admin User'}</p>
              {user && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase', ROLES[user.role].color)}>
                  {ROLES[user.role].badge}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8B7355] leading-tight">{ROLES[user?.role || 'admin'].label}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
