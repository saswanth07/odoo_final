import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Banknote, Smartphone, Wallet, Check, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Payment {
  paymentId: number;
  orderId: number;
  orderNumber?: string;
  method: string;
  amount: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  SUCCESS: 'bg-[#6B7F59]/20 text-[#6B7F59]',
  PENDING: 'bg-[#C9A84C]/20 text-[#C9A84C]',
  REFUNDED: 'bg-[#C75B39]/20 text-[#C75B39]',
  FAILED: 'bg-[#C75B39]/20 text-[#C75B39]',
};

const pieColors = ['#6B4E3D', '#C9A84C', '#6B7F59', '#5B9BD5', '#C75B39'];

const methodIcons: Record<string, any> = {
  CASH: Banknote,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  UPI: Smartphone,
  WALLET: Wallet,
  Card: CreditCard,
  Cash: Banknote,
  Wallet: Wallet,
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C4A8]/30 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-medium text-[#2C1E14]">{payload[0].name}</p>
        <p className="text-xs text-[#8B7355]">₹{Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const { data: payments = [], isLoading, refetch } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/payments');
      return res.data.map((p: any) => ({
        paymentId: p.paymentId || p.id,
        orderId: p.orderId,
        orderNumber: p.orderNumber || `#${p.orderId}`,
        method: p.paymentMethod || p.method || 'Unknown',
        amount: p.amount,
        status: p.paymentStatus || p.status || 'PENDING',
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—',
      })) as Payment[];
    },
  });

  const successPayments = payments.filter((p) => p.status === 'SUCCESS' || p.status === 'Success');
  const totalRevenue = successPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const successRate = payments.length > 0 ? Math.round((successPayments.length / payments.length) * 100) : 0;

  // Build method breakdown
  const methodMap: Record<string, number> = {};
  payments.forEach((p) => {
    const key = p.method;
    methodMap[key] = (methodMap[key] || 0) + p.amount;
  });
  const methodData = Object.entries(methodMap).map(([name, value]) => ({ name, value }));

  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQ = p.orderNumber?.toLowerCase().includes(q) ||
      String(p.paymentId).includes(q) ||
      p.method.toLowerCase().includes(q);
    const matchStatus = statusFilter ? (p.status === statusFilter || p.status.toUpperCase() === statusFilter) : true;
    return matchQ && matchStatus;
  });

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Payments</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Transaction history and analytics</p>
        </div>
        <button onClick={() => refetch()} className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 hover:bg-[#EDE5D8] flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, Icon: TrendingUp, color: 'text-[#6B4E3D]', bg: 'bg-[#6B4E3D]/10' },
          { label: 'Transactions', value: payments.length, Icon: CreditCard, color: 'text-[#6B7F59]', bg: 'bg-[#6B7F59]/10' },
          { label: 'Success Rate', value: `${successRate}%`, Icon: Check, color: 'text-[#C9A84C]', bg: 'bg-[#C9A84C]/10' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.bg)}>
                <card.Icon className={cn('w-5 h-5', card.color)} />
              </div>
              <div>
                <p className="text-sm text-[#8B7355]">{card.label}</p>
                <p className="text-xl font-bold text-[#2C1E14]">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : card.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {methodData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
            <h3 className="font-semibold text-[#2C1E14] mb-4">Payment Method Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={methodData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {methodData.map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {methodData.map((m, i) => (
                <div key={m.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                  <span className="text-xs text-[#8B7355] truncate">{m.name}</span>
                  <span className="text-xs text-[#2C1E14] font-medium ml-auto">₹{m.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
            <h3 className="font-semibold text-[#2C1E14] mb-4">By Payment Method</h3>
            <div className="space-y-3">
              {methodData.map((m, i) => {
                const Icon = methodIcons[m.name] || CreditCard;
                const txCount = payments.filter(p => p.method === m.name).length;
                const pct = totalRevenue > 0 ? (m.value / totalRevenue) * 100 : 0;
                return (
                  <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-[#EDE5D8]/30">
                    <div className="w-9 h-9 rounded-xl bg-[#6B4E3D]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#6B4E3D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#2C1E14]">{m.name}</p>
                        <p className="text-sm font-medium text-[#2C1E14]">₹{m.value.toLocaleString()}</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#EDE5D8]/60 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pieColors[i % pieColors.length] }} />
                      </div>
                      <p className="text-[10px] text-[#8B7355] mt-0.5">{txCount} transactions</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Search transactions..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            {['SUCCESS', 'PENDING', 'REFUNDED', 'FAILED'].map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(statusFilter === status ? null : status); setPage(0); }}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  statusFilter === status ? 'bg-[#6B4E3D] text-white' : 'bg-[#EDE5D8]/30 text-[#8B7355] border border-[#D4C4A8]/30 hover:text-[#2C1E14]'
                )}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[#8B7355]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading payments...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D4C4A8]/30">
                    {['Payment ID', 'Order', 'Method', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-sm text-[#8B7355]">No payments found</td></tr>
                  ) : paginated.map((p, i) => (
                    <motion.tr key={p.paymentId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-[#D4C4A8]/20 hover:bg-[#EDE5D8]/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-[#2C1E14]">PAY-{p.paymentId}</td>
                      <td className="px-4 py-3 text-sm text-[#8B7355]">{p.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-[#8B7355]">{p.method}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#2C1E14]">₹{p.amount?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', statusColors[p.status] || 'bg-[#EDE5D8]/30 text-[#8B7355]')}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8B7355]">{p.createdAt}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4C4A8]/20">
                <p className="text-xs text-[#8B7355]">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#EDE5D8]/30 text-[#8B7355] hover:bg-[#EDE5D8]/60 disabled:opacity-40 transition-colors">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                        page === i ? 'bg-[#6B4E3D] text-white' : 'bg-[#EDE5D8]/30 text-[#8B7355] hover:bg-[#EDE5D8]/60'
                      )}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#EDE5D8]/30 text-[#8B7355] hover:bg-[#EDE5D8]/60 disabled:opacity-40 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
