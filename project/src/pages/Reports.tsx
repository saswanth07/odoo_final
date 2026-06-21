import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart, Users, ShoppingBag, DollarSign, Filter, Loader2, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AreaChart, Area, BarChart as ReBarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardStats {
  totalRevenue?: number;
  totalOrders?: number;
  totalCustomers?: number;
  revenueChartData?: { name: string; revenue: number }[];
  hourlyData?: { hour: string; revenue: number }[];
  topProducts?: { name: string; sales: number; revenue: number }[];
  topCategories?: { name: string; percentage: number; sales: number }[];
}

const reportTypes = [
  { id: 'revenue', name: 'Revenue Report', Icon: DollarSign, description: 'Daily, weekly, monthly revenue', color: 'from-[#6B4E3D] to-[#8B7355]' },
  { id: 'sales', name: 'Sales Report', Icon: ShoppingBag, description: 'Product sales and category performance', color: 'from-[#6B7F59] to-[#8A9B7E]' },
  { id: 'customer', name: 'Customer Report', Icon: Users, description: 'Customer analytics and loyalty metrics', color: 'from-[#C9A84C] to-[#D4B96A]' },
  { id: 'employee', name: 'Employee Report', Icon: BarChart, description: 'Staff performance and productivity', color: 'from-[#8B7355] to-[#A08B6D]' },
];
const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C4A8]/30 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-medium text-[#2C1E14]">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs text-[#8B7355]">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="text-[#2C1E14] font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [period, setPeriod] = useState('Weekly');

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [summaryRes, ordersRes] = await Promise.allSettled([
        api.get('/dashboard/summary'),
        api.get('/orders'),
      ]);

      const summary = summaryRes.status === 'fulfilled' ? summaryRes.value.data : {};
      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data : [];

      // Build revenue chart from orders
      const revMap: Record<string, number> = {};
      orders.forEach((o: any) => {
        if (!o.createdAt) return;
        const d = new Date(o.createdAt);
        const key = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
        revMap[key] = (revMap[key] || 0) + (o.totalAmount || 0);
      });
      const revenueChartData = Object.entries(revMap).slice(-7).map(([name, revenue]) => ({ name, revenue }));

      // Hourly distribution
      const hourMap: Record<number, number> = {};
      orders.forEach((o: any) => {
        if (!o.createdAt) return;
        const h = new Date(o.createdAt).getHours();
        hourMap[h] = (hourMap[h] || 0) + (o.totalAmount || 0);
      });
      const hourlyData = Array.from({ length: 24 }, (_, h) => ({
        hour: `${h}:00`,
        revenue: Math.round(hourMap[h] || 0),
      })).filter((_, h) => h >= 6 && h <= 22);

      // Top products
      const productSales: Record<string, { sales: number; revenue: number }> = {};
      orders.forEach((o: any) => {
        (o.items || []).forEach((item: any) => {
          const name = item.productName || 'Unknown';
          if (!productSales[name]) productSales[name] = { sales: 0, revenue: 0 };
          productSales[name].sales += item.quantity || 0;
          productSales[name].revenue += item.total || 0;
        });
      });
      const topProducts = Object.entries(productSales)
        .map(([name, d]) => ({ name, ...d }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8);

      return {
        totalRevenue: summary.totalRevenue || 0,
        totalOrders: summary.totalOrders || orders.length,
        totalCustomers: summary.totalCustomers || 0,
        revenueChartData,
        hourlyData,
        topProducts,
      };
    },
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers-report'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return res.data.map((c: any) => ({
        id: c.customerId,
        name: c.name,
        email: c.email,
        orders: c.orderCount || 0,
        totalSpend: c.totalSpend || 0,
        loyaltyPoints: c.loyaltyPoints || 0,
        avatar: c.name ? c.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'CU',
      }));
    },
    enabled: selectedReport === 'customer',
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees-report'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data.map((e: any) => ({
        id: e.userId,
        name: e.name,
        role: e.role,
        status: e.active ? 'Active' : 'Inactive',
        revenue: 0,
        orders: 0,
        avatar: e.name ? e.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'EM',
      }));
    },
    enabled: selectedReport === 'employee',
  });

  const handleExport = async (format: string) => {
    try {
      const endpoint = `/reports/${period.toLowerCase()}-sales?format=${format.toLowerCase()}`;
      const res = await api.get(endpoint, { responseType: format === 'PDF' || format === 'Excel' ? 'blob' : 'json' });

      if (format === 'PDF' || format === 'Excel') {
        const url = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport}_${period.toLowerCase()}.${format === 'PDF' ? 'pdf' : 'xlsx'}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`${format} report downloaded`);
      } else {
        // CSV fallback — generate client-side
        const rows = stats?.topProducts?.map(p => `${p.name},${p.sales},${p.revenue}`) || [];
        const csv = ['Product,Sales,Revenue', ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${selectedReport}_report.csv`; a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV exported');
      }
    } catch {
      toast.error(`Failed to export ${format} report`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Reports</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Analytics and business intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#C75B39]/10 text-[#C75B39] text-sm font-medium hover:bg-[#C75B39]/20 transition-colors">
            <FileText className="w-4 h-4" />PDF
          </button>
          <button onClick={() => handleExport('Excel')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#6B7F59]/10 text-[#6B7F59] text-sm font-medium hover:bg-[#6B7F59]/20 transition-colors">
            <Download className="w-4 h-4" />Excel
          </button>
          <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#8B7355]/10 text-[#8B7355] text-sm font-medium hover:bg-[#8B7355]/20 transition-colors">
            <Download className="w-4 h-4" />CSV
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, Icon: TrendingUp, color: 'text-[#6B4E3D]', bg: 'bg-[#6B4E3D]/10' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, Icon: ShoppingBag, color: 'text-[#6B7F59]', bg: 'bg-[#6B7F59]/10' },
          { label: 'Customers', value: stats?.totalCustomers || 0, Icon: Users, color: 'text-[#C9A84C]', bg: 'bg-[#C9A84C]/10' },
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
                  {statsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : card.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Report type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((r) => (
          <motion.button key={r.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedReport(r.id)}
            className={cn('rounded-2xl border p-5 text-left transition-all',
              selectedReport === r.id
                ? 'border-[#6B4E3D] bg-[#6B4E3D]/5 shadow-md'
                : 'border-[#D4C4A8]/30 bg-white hover:border-[#6B4E3D]/30')}>
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', r.color)}>
              <r.Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-[#2C1E14] mb-1">{r.name}</h3>
            <p className="text-xs text-[#8B7355]">{r.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-[#8B7355]" />
        {periods.map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={cn('px-3 py-2 rounded-xl text-sm font-medium transition-all',
              period === p ? 'bg-[#6B4E3D] text-white' : 'bg-white text-[#8B7355] border border-[#D4C4A8]/30 hover:text-[#2C1E14]'
            )}>
            {p}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="space-y-4">
        {selectedReport === 'revenue' && (
          <>
            <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
              <h3 className="font-semibold text-[#2C1E14] mb-4">Revenue Trend (Last 7 Days)</h3>
              {statsLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8B7355]"><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Loading...</span></div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats?.revenueChartData || []}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6B4E3D" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6B4E3D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4C4A820" />
                    <XAxis dataKey="name" stroke="#8B7355" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8B7355" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6B4E3D" strokeWidth={2} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
              <h3 className="font-semibold text-[#2C1E14] mb-4">Hourly Revenue Distribution</h3>
              {statsLoading ? (
                <div className="flex items-center justify-center h-32 text-[#8B7355]"><Loader2 className="w-5 h-5 animate-spin" /></div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <ReBarChart data={stats?.hourlyData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4C4A820" />
                    <XAxis dataKey="hour" stroke="#8B7355" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8B7355" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" fill="#6B4E3D" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}

        {selectedReport === 'sales' && (
          <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
            <h3 className="font-semibold text-[#2C1E14] mb-4">Top Products by Revenue</h3>
            {statsLoading ? (
              <div className="flex items-center justify-center py-10 text-[#8B7355]"><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Loading...</span></div>
            ) : (stats?.topProducts || []).length === 0 ? (
              <p className="text-sm text-[#8B7355] text-center py-8">No product sales data available yet</p>
            ) : (
              <div className="space-y-3">
                {(stats?.topProducts || []).map((product, idx) => {
                  const maxRev = Math.max(...(stats?.topProducts || []).map(p => p.revenue));
                  return (
                    <div key={product.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#6B4E3D]/10 flex items-center justify-center text-[#6B4E3D] font-bold text-sm shrink-0">{idx + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#2C1E14]">{product.name}</span>
                          <span className="text-sm font-medium text-[#2C1E14]">₹{product.revenue.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#EDE5D8]/40 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#6B4E3D] to-[#C9A84C] transition-all" style={{ width: `${maxRev > 0 ? (product.revenue / maxRev) * 100 : 0}%` }} />
                        </div>
                        <p className="text-xs text-[#8B7355] mt-0.5">{product.sales} units sold</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedReport === 'customer' && (
          <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
            <h3 className="font-semibold text-[#2C1E14] mb-4">Customer Overview</h3>
            {customersLoading ? (
              <div className="flex items-center justify-center py-10 text-[#8B7355]"><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Loading...</span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4C4A8]/30">
                      {['Customer', 'Email', 'Orders', 'Total Spent', 'Loyalty Points', 'Avg/Order'].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(customers as any[]).length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-sm text-[#8B7355]">No customer data available</td></tr>
                    ) : (customers as any[]).map((c) => (
                      <tr key={c.id} className="border-b border-[#D4C4A8]/20 hover:bg-[#EDE5D8]/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B4E3D] to-[#C9A84C] flex items-center justify-center text-white text-xs font-bold">{c.avatar}</div>
                            <span className="text-sm font-medium text-[#2C1E14]">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#8B7355]">{c.email}</td>
                        <td className="px-4 py-3 text-sm text-[#8B7355]">{c.orders}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#2C1E14]">₹{c.totalSpend.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-[#C9A84C] font-medium">{c.loyaltyPoints}</td>
                        <td className="px-4 py-3 text-sm text-[#8B7355]">{c.orders > 0 ? `₹${(c.totalSpend / c.orders).toFixed(2)}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {selectedReport === 'employee' && (
          <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
            <h3 className="font-semibold text-[#2C1E14] mb-4">Employee Overview</h3>
            {employeesLoading ? (
              <div className="flex items-center justify-center py-10 text-[#8B7355]"><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Loading...</span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4C4A8]/30">
                      {['Employee', 'Role', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(employees as any[]).length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-8 text-sm text-[#8B7355]">No employee data available</td></tr>
                    ) : (employees as any[]).map((e) => (
                      <tr key={e.id} className="border-b border-[#D4C4A8]/20 hover:bg-[#EDE5D8]/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B4E3D] to-[#8B7355] flex items-center justify-center text-white text-xs font-bold">{e.avatar}</div>
                            <span className="text-sm font-medium text-[#2C1E14]">{e.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#8B7355] capitalize">{e.role?.toLowerCase()}</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium',
                            e.status === 'Active' ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : 'bg-[#C9A84C]/20 text-[#C9A84C]'
                          )}>{e.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
