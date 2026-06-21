import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Percent, DollarSign, Palette, Bell, Save, Check } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('business');
  const [saved, setSaved] = useState(false);

  const [business, setBusiness] = useState({
    name: 'CafePOS Pro',
    address: '123 Coffee Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'hello@cafepos.com',
  });

  const [tax, setTax] = useState({ rate: 8, enabled: true });
  const [currency, setCurrency] = useState('USD');

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'business', label: 'Business', icon: Store },
    { id: 'tax', label: 'Tax', icon: Percent },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Configure your restaurant</p>
        </div>
        <button onClick={handleSave} className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
          saved ? 'bg-[#6B7F59] text-white' : 'bg-[#6B4E3D] text-white hover:bg-[#6B4E3D]/80'
        )}>
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id ? 'bg-[#6B4E3D] text-white' : 'bg-white text-[#8B7355] border border-[#D4C4A8]/30 hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-6">
        {activeTab === 'business' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#8B7355] mb-1">Restaurant Name</label>
                <input type="text" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
              </div>
              <div>
                <label className="block text-sm text-[#8B7355] mb-1">Address</label>
                <input type="text" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Phone</label>
                  <input type="text" value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Email</label>
                  <input type="email" value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tax' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Tax Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={tax.enabled} onChange={(e) => setTax({ ...tax, enabled: e.target.checked })} className="w-4 h-4 rounded accent-[#6B4E3D]" />
                <span className="text-sm text-white">Enable Tax</span>
              </label>
              <div>
                <label className="block text-sm text-[#8B7355] mb-1">Tax Rate (%)</label>
                <input type="number" value={tax.rate} onChange={(e) => setTax({ ...tax, rate: parseFloat(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'currency' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Currency Settings</h3>
            <div>
              <label className="block text-sm text-[#8B7355] mb-1">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                <option className="bg-[#111827]">USD</option>
                <option className="bg-[#111827]">EUR</option>
                <option className="bg-[#111827]">GBP</option>
                <option className="bg-[#111827]">INR</option>
                <option className="bg-[#111827]">CAD</option>
              </select>
            </div>
          </motion.div>
        )}

        {activeTab === 'theme' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Theme Settings</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={cn(
                  'flex-1 p-4 rounded-xl border text-center transition-all',
                  theme === 'light' ? 'border-[#6B4E3D] bg-[#6B4E3D]/10' : 'border-[#D4C4A8]/30 bg-[#EDE5D8]/30 hover:border-[#D4C4A8]/40'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Light</p>
              </button>
              <button
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={cn(
                  'flex-1 p-4 rounded-xl border text-center transition-all',
                  theme === 'dark' ? 'border-[#6B4E3D] bg-[#6B4E3D]/10' : 'border-[#D4C4A8]/30 bg-[#EDE5D8]/30 hover:border-[#D4C4A8]/40'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] border border-[#D4C4A8]/40 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Dark</p>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {['Order Created', 'Order Completed', 'Payment Received', 'Low Stock Alert', 'New Employee'].map((item) => (
                <label key={item} className="flex items-center justify-between p-3 rounded-lg bg-[#EDE5D8]/30 cursor-pointer">
                  <span className="text-sm text-white">{item}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#6B4E3D]" />
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
