import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Check, Megaphone, Calendar, TrendingUp } from 'lucide-react';
import { promotions as initialPromotions } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C4A8]/30 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{payload[0].payload.name}</p>
        <p className="text-xs text-[#8B7355]">Revenue: ₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function Promotions() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<typeof promotions[0] | null>(null);
  const [form, setForm] = useState({ name: '', description: '', type: 'BOGO', startDate: '', endDate: '', status: 'Active' });

  const filteredPromotions = promotions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', type: 'BOGO', startDate: '', endDate: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (p: typeof promotions[0]) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, type: p.type, startDate: p.startDate, endDate: p.endDate, status: p.status });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setPromotions((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form } : p));
      toast.success('Promotion updated');
    } else {
      setPromotions((prev) => [...prev, { id: `prom${Date.now()}`, ...form, revenue: 0, redemptions: 0 }]);
      toast.success('Promotion added');
    }
    setShowModal(false);
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast.success('Promotion deleted');
  };

  const chartData = promotions.map((p) => ({ name: p.name, revenue: p.revenue }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Promotions</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Marketing campaigns and offers</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors">
          <Plus className="w-4 h-4" />
          Add Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-white mb-4">Promotion Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-white mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#EDE5D8]/30">
              <div className="flex items-center gap-2 mb-1">
                <Megaphone className="w-4 h-4 text-[#6B4E3D]" />
                <span className="text-sm text-[#8B7355]">Active</span>
              </div>
              <p className="text-2xl font-bold text-white">{promotions.filter((p) => p.status === 'Active').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#EDE5D8]/30">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-sm text-[#8B7355]">Upcoming</span>
              </div>
              <p className="text-2xl font-bold text-white">{promotions.filter((p) => p.status === 'Upcoming').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#EDE5D8]/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#6B7F59]" />
                <span className="text-sm text-[#8B7355]">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-white">₹{promotions.reduce((s, p) => s + p.revenue, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search promotions..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-white placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPromotions.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 group hover:border-[#D4C4A8]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6B4E3D]/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-[#6B4E3D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{promo.name}</h3>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    promo.status === 'Active' ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : promo.status === 'Upcoming' ? 'bg-[#8B7355]/20 text-[#3B82F6]' : 'bg-[#C75B39]/20 text-[#C75B39]'
                  )}>
                    {promo.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(promo)} className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#6B4E3D]/20 flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D]">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deletePromotion(promo.id)} className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#C75B39]/20 flex items-center justify-center text-[#8B7355] hover:text-[#C75B39]">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-[#8B7355] mb-3">{promo.description}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#EDE5D8]/30">
                <p className="text-xs text-[#8B7355]">Type</p>
                <p className="text-sm font-medium text-white">{promo.type}</p>
              </div>
              <div className="p-2 rounded-lg bg-[#EDE5D8]/30">
                <p className="text-xs text-[#8B7355]">Redemptions</p>
                <p className="text-sm font-medium text-white">{promo.redemptions}</p>
              </div>
              <div className="p-2 rounded-lg bg-[#EDE5D8]/30">
                <p className="text-xs text-[#8B7355]">Revenue</p>
                <p className="text-sm font-medium text-white">₹{promo.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#8B7355]">
              <Calendar className="w-3 h-3" />
              {promo.startDate} - {promo.endDate}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{editing ? 'Edit Promotion' : 'Add Promotion'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} className="w-full px-3 py-2 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                      <option className="bg-[#111827]">BOGO</option>
                      <option className="bg-[#111827]">Discount</option>
                      <option className="bg-[#111827]">Free Item</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                      <option className="bg-[#111827]">Active</option>
                      <option className="bg-[#111827]">Upcoming</option>
                      <option className="bg-[#111827]">Expired</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Start Date</label>
                    <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">End Date</label>
                    <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                  </div>
                </div>
                <button type="submit" className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  {editing ? 'Update Promotion' : 'Add Promotion'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
