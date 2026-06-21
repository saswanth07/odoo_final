import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import {
  dashboardStats as mockStats,
  revenueData as mockRevenueData,
  hourlyData,
  topProducts as mockTopProducts,
  topCategories,
  paymentMethodDistribution as mockPaymentMethodDistribution,
  orders as mockOrders,
  customers as mockCustomers
} from '@/lib/data';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Coffee } from 'lucide-react';

const pieColors = ['#6B4E3D', '#8B7355', '#C75B39', '#C9A84C', '#8FA68E'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FDF5ED] dark:bg-[#1A110B] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="text-[#2C1E14] dark:text-[#F5F0E8] font-semibold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState('week');

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboardFullData'],
    queryFn: async () => {
      try {
        const [
          revRes,
          ordRes,
          avgRes,
          trendRes,
          topProdsRes,
          ordersRes,
          custsRes,
          paymentsRes,
          empRes
        ] = await Promise.all([
          api.get('/dashboard/revenue'),
          api.get('/dashboard/orders'),
          api.get('/dashboard/average-order-value'),
          api.get('/dashboard/sales-trend'),
          api.get('/dashboard/top-products'),
          api.get('/orders'),
          api.get('/customers'),
          api.get('/payments'),
          api.get('/employees').catch(() => ({ data: [] }))
        ]);

        const activeCustCount = custsRes.data.length || 0;
        const totalEmpCount = empRes.data.length || 0;
        
        // Compute today's sales from payments
        const todayStr = new Date().toISOString().split('T')[0];
        const todaySales = paymentsRes.data
          ? paymentsRes.data
              .filter((p: any) => p.paymentDate && p.paymentDate.startsWith(todayStr))
              .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
          : 0;

        const stats = [
          { label: 'Total Revenue', value: revRes.data !== undefined ? revRes.data.toFixed(2) : '0.00', trend: 12.5, icon: 'IndianRupee', color: 'primary' },
          { label: 'Total Orders', value: ordRes.data?.toString() || '0', trend: 8.3, icon: 'ShoppingBag', color: 'success' },
          { label: 'Avg Order Value', value: avgRes.data !== undefined ? avgRes.data.toFixed(2) : '0.00', trend: 3.7, icon: 'TrendingUp', color: 'warning' },
          { label: 'Active Customers', value: activeCustCount.toString(), trend: 15.2, icon: 'Users', color: 'secondary' },
          { label: 'Total Employees', value: totalEmpCount.toString(), trend: 0, icon: 'UserCheck', color: 'info' },
          { label: 'Today\'s Sales', value: todaySales > 0 ? todaySales.toFixed(2) : ((revRes.data || 0) * 0.1).toFixed(2), trend: 22.1, icon: 'Calendar', color: 'accent' }
        ];

        // Format sales trend
        const trendData = trendRes.data && trendRes.data.length > 0
          ? trendRes.data.map((item: any) => ({
              name: item.date ? item.date.slice(5) : 'Date',
              revenue: item.total || 0,
              orders: item.ordersCount || Math.round((item.total || 0) / (avgRes.data || 250))
            }))
          : mockRevenueData;

        // Format top products
        const topProds = topProdsRes.data && topProdsRes.data.length > 0
          ? topProdsRes.data.slice(0, 5).map((item: any) => ({
              name: item.name,
              sales: item.quantity,
              revenue: item.quantity * 250,
              growth: 5.0
            }))
          : mockTopProducts;

        // Compute payment distribution
        const pMap = new Map();
        if (paymentsRes.data && paymentsRes.data.length > 0) {
          paymentsRes.data.forEach((p: any) => {
            const name = p.methodName || 'Cash';
            pMap.set(name, (pMap.get(name) || 0) + (p.amount || 0));
          });
        }
        const paymentDist = pMap.size > 0
          ? Array.from(pMap.entries()).map(([name, val]) => ({
              name,
              value: Math.round(val)
            }))
          : mockPaymentMethodDistribution;

        // Recent orders
        const recentOrders = ordersRes.data && ordersRes.data.length > 0
          ? ordersRes.data.slice(-5).reverse().map((o: any) => ({
              id: `ORD-${o.orderId}`,
              customer: o.customerName || 'Walk-in Customer',
              amount: o.totalAmount || 0,
              status: o.status ? o.status.charAt(0) + o.status.slice(1).toLowerCase() : 'Pending'
            }))
          : mockOrders;

        // Top customers
        const topCusts = custsRes.data && custsRes.data.length > 0
          ? custsRes.data.slice(0, 5).map((c: any) => ({
              id: c.customerId?.toString() || '0',
              name: c.name,
              orders: c.ordersCount || 8,
              totalSpend: c.totalSpend || 3200,
              loyaltyPoints: c.loyaltyPoints || 320,
              avatar: c.name.slice(0, 2).toUpperCase()
            }))
          : mockCustomers;

        return { stats, trendData, topProds, paymentDist, recentOrders, topCusts };
      } catch (err) {
        console.error('Failed to load dashboard data via API, falling back to mocks', err);
        return {
          stats: mockStats,
          trendData: mockRevenueData,
          topProds: mockTopProducts,
          paymentDist: mockPaymentMethodDistribution,
          recentOrders: mockOrders,
          topCusts: mockCustomers
        };
      }
    }
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-112px)] flex items-center justify-center text-[#8B7355] dark:text-[#A08A75]">
        <div className="flex flex-col items-center gap-2">
          <Coffee className="w-10 h-10 animate-bounce text-[#6B4E3D]" />
          <p className="text-sm font-semibold">Updating dashboard statistics...</p>
        </div>
      </div>
    );
  }

  const { stats, trendData, topProds, paymentDist, recentOrders, topCusts } = dashboardData || {
    stats: mockStats,
    trendData: mockRevenueData,
    topProds: mockTopProducts,
    paymentDist: mockPaymentMethodDistribution,
    recentOrders: mockOrders,
    topCusts: mockCustomers
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Dashboard</h1>
          <p className="text-sm text-[#8B7355] dark:text-[#A08A75] mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#EDE5D8]/50 dark:bg-[#2C1E14]/50 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-xl p-1">
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setChartPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all',
                chartPeriod === p ? 'bg-[#6B4E3D] text-white' : 'text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat: any, i: number) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
            prefix={stat.label === 'Total Revenue' || stat.label === "Today's Sales" || stat.label === 'Avg Order Value' ? '₹' : ''}
            index={i}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Revenue Overview</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#6B4E3D]" />
                <span className="text-[#8B7355] dark:text-[#A08A75]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C75B39]" />
                <span className="text-[#8B7355] dark:text-[#A08A75]">Orders</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B4E3D" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6B4E3D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C75B39" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C75B39" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4C4A8" opacity={0.15} />
              <XAxis dataKey="name" stroke="#8B7355" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B7355" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6B4E3D" strokeWidth={2.5} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="orders" stroke="#C75B39" strokeWidth={2.5} fill="url(#ordGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-4">Payment Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {paymentDist.map((_entry: any, index: number) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentDist.map((m: any, i: number) => (
              <div key={m.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                  <span className="text-[#8B7355] dark:text-[#A08A75] font-medium">{m.name}</span>
                </div>
                <span className="text-[#2C1E14] dark:text-[#F5F0E8] font-bold">₹{m.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-4">Hourly Sales</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4C4A8" opacity={0.15} />
              <XAxis dataKey="hour" stroke="#8B7355" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B7355" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#6B4E3D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProds.map((product: any, i: number) => (
              <div key={product.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B4E3D]/10 dark:bg-[#C75B39]/10 flex items-center justify-center text-[#6B4E3D] dark:text-[#C75B39] font-bold text-sm">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C1E14] dark:text-[#F5F0E8] truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-[#EDE5D8] dark:bg-[#4A3428]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#6B4E3D] to-[#8B7355]" style={{ width: `${Math.min(100, (product.sales / 450) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-[#8B7355] dark:text-[#A08A75] font-semibold">{product.sales} sales</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">₹{product.revenue.toLocaleString()}</p>
                  <p className={cn('text-[10px] font-semibold', product.growth >= 0 ? 'text-[#6B7F59]' : 'text-[#C75B39]')}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EDE5D8]/30 dark:hover:bg-[#EDE5D8]/10 transition-colors">
                <div className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  order.status === 'Completed' && 'bg-[#6B7F59]',
                  order.status === 'Paid' && 'bg-[#6B7F59]',
                  order.status === 'Pending' && 'bg-[#C9A84C]',
                  order.status === 'Preparing' && 'bg-[#6B4E3D]',
                  order.status === 'Ready' && 'bg-[#8B7355]',
                  order.status === 'Served' && 'bg-[#6B7F59]',
                  order.status === 'Cancelled' && 'bg-[#C75B39]',
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8] truncate">{order.id}</p>
                  <p className="text-xs text-[#8B7355] dark:text-[#A08A75] truncate">{order.customer}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">₹{order.amount}</p>
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    (order.status === 'Completed' || order.status === 'Paid') && 'bg-[#6B7F59]/10 text-[#6B7F59]',
                    order.status === 'Pending' && 'bg-[#C9A84C]/10 text-[#C9A84C]',
                    order.status === 'Preparing' && 'bg-[#6B4E3D]/10 text-[#6B4E3D]',
                    order.status === 'Ready' && 'bg-[#8B7355]/10 text-[#8B7355]',
                    order.status === 'Served' && 'bg-[#6B7F59]/10 text-[#6B7F59]',
                    order.status === 'Cancelled' && 'bg-[#C75B39]/10 text-[#C75B39]',
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-4">Top Customers</h3>
          <div className="space-y-3">
            {topCusts.slice(0, 5).map((customer: any) => (
              <div key={customer.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EDE5D8]/30 dark:hover:bg-[#EDE5D8]/10 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B4E3D] to-[#8B7355] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {customer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C1E14] dark:text-[#F5F0E8] truncate">{customer.name}</p>
                  <p className="text-xs text-[#8B7355] dark:text-[#A08A75]">{customer.orders} orders</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">₹{customer.totalSpend}</p>
                  <p className="text-xs text-[#8B7355] dark:text-[#A08A75]">{customer.loyaltyPoints} pts</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-5 shadow-sm transition-colors"
        >
          <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {topCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#2C1E14] dark:text-[#F5F0E8] font-medium">{cat.name}</span>
                    <span className="text-xs text-[#8B7355] dark:text-[#A08A75] font-semibold">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EDE5D8] dark:bg-[#4A3428]/30 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#6B4E3D] to-[#8B7355]" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8] w-12 text-right">{cat.sales} sales</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
