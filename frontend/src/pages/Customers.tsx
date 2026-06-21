import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Mail, Phone, ShoppingBag, Star, TrendingUp, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  totalSpend?: number;
  orderCount?: number;
  avatar: string;
}

interface CustomerOrder {
  orderId: number;
  orderNumber?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customers = [], isLoading, refetch } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return res.data.map((c: any) => ({
        id: c.customerId || c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '—',
        loyaltyPoints: c.loyaltyPoints ?? 0,
        totalSpend: c.totalSpend ?? 0,
        orderCount: c.orderCount ?? 0,
        avatar: c.name
          ? c.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          : 'CU',
      })) as Customer[];
    },
  });

  const { data: customerOrders = [], isLoading: ordersLoading } = useQuery<CustomerOrder[]>({
    queryKey: ['customer-orders', selectedCustomer?.id],
    queryFn: async () => {
      const res = await api.get(`/customers/${selectedCustomer!.id}/orders`);
      return res.data.map((o: any) => ({
        orderId: o.orderId,
        orderNumber: o.orderNumber || `#${o.orderId}`,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—',
      }));
    },
    enabled: !!selectedCustomer,
  });

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Customers</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Customer relationship management</p>
        </div>
        <button
          onClick={() => refetch()}
          className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 hover:bg-[#EDE5D8] flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#8B7355]">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm">Loading customers...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#8B7355]">
          <User className="w-10 h-10 opacity-20 mb-3" />
          <p className="text-sm">No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedCustomer(customer)}
              className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 cursor-pointer hover:border-[#6B4E3D]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B4E3D] to-[#C9A84C] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {customer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#2C1E14] truncate">{customer.name}</h3>
                  <p className="text-xs text-[#8B7355] truncate">{customer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-[#EDE5D8]/30">
                  <p className="text-lg font-bold text-[#2C1E14]">{customer.orderCount ?? 0}</p>
                  <p className="text-[10px] text-[#8B7355]">Orders</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-[#EDE5D8]/30">
                  <p className="text-sm font-bold text-[#6B4E3D]">₹{(customer.totalSpend ?? 0).toLocaleString()}</p>
                  <p className="text-[10px] text-[#8B7355]">Spent</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-[#EDE5D8]/30">
                  <p className="text-lg font-bold text-[#C9A84C]">{customer.loyaltyPoints}</p>
                  <p className="text-[10px] text-[#8B7355]">Points</p>
                </div>
              </div>
              {customer.phone && (
                <div className="mt-3 pt-3 border-t border-[#D4C4A8]/30 flex items-center gap-1 text-xs text-[#8B7355]">
                  <Phone className="w-3 h-3" />
                  {customer.phone}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-[#D4C4A8]/30 p-5 flex items-center justify-between z-10">
                <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-[#8B7355] hover:text-[#2C1E14] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/50 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B4E3D] to-[#C9A84C] flex items-center justify-center text-white font-bold text-2xl">
                    {selectedCustomer.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2C1E14]">{selectedCustomer.name}</h2>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-[#8B7355]">
                        <Mail className="w-3 h-3" /> {selectedCustomer.email}
                      </span>
                      {selectedCustomer.phone && (
                        <span className="flex items-center gap-1 text-xs text-[#8B7355]">
                          <Phone className="w-3 h-3" /> {selectedCustomer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#EDE5D8]/30 text-center">
                    <ShoppingBag className="w-5 h-5 text-[#6B4E3D] mx-auto mb-2" />
                    <p className="text-xl font-bold text-[#2C1E14]">{selectedCustomer.orderCount ?? 0}</p>
                    <p className="text-xs text-[#8B7355]">Total Orders</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EDE5D8]/30 text-center">
                    <TrendingUp className="w-5 h-5 text-[#6B7F59] mx-auto mb-2" />
                    <p className="text-xl font-bold text-[#2C1E14]">₹{(selectedCustomer.totalSpend ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-[#8B7355]">Total Spent</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EDE5D8]/30 text-center">
                    <Star className="w-5 h-5 text-[#C9A84C] mx-auto mb-2" />
                    <p className="text-xl font-bold text-[#C9A84C]">{selectedCustomer.loyaltyPoints}</p>
                    <p className="text-xs text-[#8B7355]">Loyalty Points</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#2C1E14] mb-3">Order History</h3>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-6 text-[#8B7355]">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span className="text-sm">Loading orders...</span>
                    </div>
                  ) : customerOrders.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {customerOrders.map((order) => (
                        <div key={order.orderId} className="flex items-center justify-between p-3 rounded-lg bg-[#EDE5D8]/30">
                          <div>
                            <p className="text-sm font-medium text-[#2C1E14]">{order.orderNumber}</p>
                            <p className="text-xs text-[#8B7355]">{order.createdAt}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#2C1E14]">₹{order.totalAmount?.toFixed(2)}</p>
                            <span className={cn(
                              'text-[10px] px-2 py-0.5 rounded-full font-medium',
                              order.status === 'COMPLETED' || order.status === 'Completed'
                                ? 'bg-[#6B7F59]/20 text-[#6B7F59]'
                                : 'bg-[#C9A84C]/20 text-[#C9A84C]'
                            )}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#8B7355] py-4 text-center">No orders found</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
