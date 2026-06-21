import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Check, Ticket, Tag, Calendar, TrendingUp } from 'lucide-react';
import { coupons as initialCoupons } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Coupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<typeof coupons[0] | null>(null);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percentage', value: '', startDate: '', endDate: '', status: 'Active' });

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ code: '', discount: '', type: 'percentage', value: '', startDate: '', endDate: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (c: typeof coupons[0]) => {
    setEditing(c);
    setForm({ code: c.code, discount: c.discount, type: c.type, value: c.value.toString(), startDate: c.startDate, endDate: c.endDate, status: c.status });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCoupons((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form, value: parseFloat(form.value) } : c));
      toast.success('Coupon updated');
    } else {
      setCoupons((prev) => [...prev, { id: `cp${Date.now()}`, ...form, value: parseFloat(form.value), usage: 0, revenue: 0 }]);
      toast.success('Coupon added');
    }
    setShowModal(false);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success('Coupon deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupons</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Manage discount codes</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors">
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search coupons..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-white placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCoupons.map((coupon, i) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white border border-[#D4C4A8]/30 overflow-hidden group hover:border-[#D4C4A8]/40 transition-all"
          >
            <div className="p-4 border-b border-[#D4C4A8]/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#6B4E3D]" />
                  <span className="text-sm font-medium text-[#8B7355]">Coupon</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(coupon)} className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#6B4E3D]/20 flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D]">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteCoupon(coupon.id)} className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#C75B39]/20 flex items-center justify-center text-[#8B7355] hover:text-[#C75B39]">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{coupon.code}</h3>
                <span className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium',
                  coupon.status === 'Active' ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : 'bg-[#C75B39]/20 text-[#C75B39]'
                )}>
                  {coupon.status}
                </span>
              </div>
              <p className="text-lg font-semibold text-[#6B4E3D] mt-1">{coupon.discount}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8B7355] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Valid
                </span>
                <span className="text-white">{coupon.startDate} - {coupon.endDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8B7355] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Usage
                </span>
                <span className="text-white">{coupon.usage} times</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8B7355] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Revenue
                </span>
                <span className="text-white">₹{coupon.revenue.toLocaleString()}</span>
              </div>
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
                <h3 className="text-lg font-bold text-white">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Code</label>
                  <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Discount Label</label>
                  <input type="text" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} required placeholder="e.g. 20% Off" className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                      <option className="bg-[#111827]">percentage</option>
                      <option className="bg-[#111827]">fixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Value</label>
                    <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
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
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                    <option className="bg-[#111827]">Active</option>
                    <option className="bg-[#111827]">Expired</option>
                  </select>
                </div>
                <button type="submit" className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  {editing ? 'Update Coupon' : 'Add Coupon'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
