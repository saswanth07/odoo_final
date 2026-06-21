import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, X, Package, CreditCard, Clock, User, Table as TableIcon, ChefHat } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusFilters = ['All', 'Pending', 'Preparing', 'Completed', 'Cancelled'];

const statusColors: Record<string, string> = {
  Pending: 'bg-[#C9A84C]/20 text-[#C9A84C]',
  Preparing: 'bg-[#6B4E3D]/20 text-[#6B4E3D]',
  Completed: 'bg-[#6B7F59]/20 text-[#6B7F59]',
  Cancelled: 'bg-[#C75B39]/20 text-[#C75B39]',
};

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'OFFLINE' | 'QR'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
      toast.error('Failed to load orders from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getDisplayStatus = (status: string) => {
    if (!status) return 'Pending';
    const s = status.toUpperCase();
    if (s === 'SENT_TO_KITCHEN' || s === 'DRAFT') return 'Pending';
    if (s === 'PAID' || s === 'COMPLETED') return 'Completed';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getTimeline = (order: any) => {
    const timeStr = order.createdAt 
      ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Just now';
    
    const steps = [{ status: 'Placed', time: timeStr }];
    
    const s = order.status?.toUpperCase() || 'DRAFT';
    if (s === 'SENT_TO_KITCHEN' || s === 'PREPARING' || s === 'COMPLETED' || s === 'PAID') {
      steps.push({ status: 'Kitchen Queue', time: 'Sent to Kitchen' });
    }
    if (s === 'PREPARING' || s === 'COMPLETED' || s === 'PAID') {
      steps.push({ status: 'Preparing', time: 'Under preparation' });
    }
    if (s === 'COMPLETED' || s === 'PAID') {
      steps.push({ status: 'Completed', time: 'Closed & Paid' });
    }
    if (s === 'CANCELLED') {
      steps.push({ status: 'Cancelled', time: 'Order Voided' });
    }
    return steps;
  };

  const filteredOrders = orders.filter((order) => {
    const oId = order.orderId?.toString() || '';
    const oNum = order.orderNumber || '';
    const oCust = order.customerName || 'Walk-in Customer';
    const oTab = order.tableName || `Table ${order.tableId || ''}`;
    const matchesSearch = oId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oCust.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oTab.toLowerCase().includes(searchQuery.toLowerCase());

    const displayStatus = getDisplayStatus(order.status);
    const matchesStatus = statusFilter === 'All' || displayStatus === statusFilter;

    const oType = (order.orderType || 'OFFLINE').toUpperCase();
    const matchesType = typeFilter === 'ALL' || oType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Orders</h1>
          <p className="text-sm text-[#8B7355] dark:text-[#A08A75] mt-0.5">Manage and track all customer checkouts</p>
        </div>

        {/* Order type filter tabs */}
        <div className="flex bg-[#EDE5D8]/50 dark:bg-[#2C1E14]/50 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-xl p-1 shrink-0">
          <button
            onClick={() => { setTypeFilter('ALL'); setCurrentPage(1); }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              typeFilter === 'ALL' ? 'bg-[#6B4E3D] text-white shadow-sm' : 'text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
            )}
          >
            All Orders
          </button>
          <button
            onClick={() => { setTypeFilter('OFFLINE'); setCurrentPage(1); }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              typeFilter === 'OFFLINE' ? 'bg-[#6B4E3D] text-white shadow-sm' : 'text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
            )}
          >
            Offline Orders
          </button>
          <button
            onClick={() => { setTypeFilter('QR'); setCurrentPage(1); }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              typeFilter === 'QR' ? 'bg-[#6B4E3D] text-white shadow-sm' : 'text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
            )}
          >
            QR Orders
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search orders by ID, number, customer, table..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20 text-sm transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
                statusFilter === status
                  ? 'bg-[#6B4E3D] text-white border-transparent'
                  : 'bg-white/60 dark:bg-[#2C1E14]/60 text-[#8B7355] dark:text-[#A08A75] border-[#D4C4A8]/30 dark:border-[#4A3428]/30 hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#8B7355] dark:text-[#A08A75] font-medium flex flex-col items-center justify-center gap-2">
          <ChefHat className="w-8 h-8 animate-spin text-[#6B4E3D]" />
          <span>Loading orders board...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D4C4A8] dark:border-[#4A3428]/30 bg-white/30 dark:bg-[#2C1E14]/20 py-16 text-center text-[#8B7355] dark:text-[#A08A75]">
          <Package className="w-12 h-12 mx-auto opacity-30 mb-2" />
          <p className="text-sm font-semibold">No orders matching the filters were found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 overflow-hidden shadow-sm transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-left bg-[#EDE5D8]/20 dark:bg-[#2C1E14]/20">
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Order ID / Num</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Type</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Customer</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Table</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Staff</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Amount</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase tracking-wider px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4C4A8]/20 dark:divide-[#4A3428]/20">
                  {paginatedOrders.map((order, i) => {
                    const displayStatus = getDisplayStatus(order.status);
                    return (
                      <motion.tr
                        key={order.orderId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-[#EDE5D8]/30 dark:hover:bg-[#EDE5D8]/5 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">
                          #{order.orderNumber || order.orderId}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider',
                            (order.orderType || 'OFFLINE').toUpperCase() === 'QR'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          )}>
                            {order.orderType || 'OFFLINE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#8B7355] dark:text-[#A08A75] font-medium">
                          {order.customerName || 'Walk-in Customer'}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#8B7355] dark:text-[#A08A75] font-medium">
                          {order.tableName || `Table ${order.tableId || '-'}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#8B7355] dark:text-[#A08A75] font-medium">
                          {order.userName || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#6B4E3D] dark:text-[#C75B39]">
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn('text-xs px-2.5 py-1 rounded-full font-bold', statusColors[displayStatus])}>
                            {displayStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#8B7355] dark:text-[#A08A75] font-medium">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-[#D4C4A8]/20 dark:border-[#4A3428]/20 pt-4">
            <p className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75]">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#2C1E14] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 flex items-center justify-center text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-bold transition-all border',
                    currentPage === p
                      ? 'bg-[#6B4E3D] border-transparent text-white shadow-sm'
                      : 'bg-white dark:bg-[#2C1E14] border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#2C1E14] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 flex items-center justify-center text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Selected Order Details Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-end"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full max-w-lg h-full bg-white dark:bg-[#1A110B] border-l border-[#D4C4A8]/30 dark:border-[#4A3428]/30 overflow-y-auto scrollbar-thin transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 dark:bg-[#1A110B]/95 backdrop-blur-xl border-b border-[#D4C4A8]/30 dark:border-[#4A3428]/30 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-[#2C1E14] dark:text-[#F5F0E8]">#{selectedOrder.orderNumber || selectedOrder.orderId}</h2>
                  <p className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-0.5">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'Date unavailable'}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30">
                    <User className="w-4 h-4 text-[#6B4E3D]" />
                    <div>
                      <p className="text-[10px] text-[#8B7355] dark:text-[#A08A75] font-semibold uppercase">Customer</p>
                      <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{selectedOrder.customerName || 'Walk-in Customer'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30">
                    <TableIcon className="w-4 h-4 text-[#8B7355]" />
                    <div>
                      <p className="text-[10px] text-[#8B7355] dark:text-[#A08A75] font-semibold uppercase">Table</p>
                      <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{selectedOrder.tableName || `Table ${selectedOrder.tableId}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30">
                    <ChefHat className="w-4 h-4 text-[#6B7F59]" />
                    <div>
                      <p className="text-[10px] text-[#8B7355] dark:text-[#A08A75] font-semibold uppercase">Served By</p>
                      <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{selectedOrder.userName || 'System'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30">
                    <CreditCard className="w-4 h-4 text-[#C9A84C]" />
                    <div>
                      <p className="text-[10px] text-[#8B7355] dark:text-[#A08A75] font-semibold uppercase">Order Type</p>
                      <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{selectedOrder.orderType || 'OFFLINE'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#2C1E14] dark:text-[#F5F0E8] mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#6B4E3D]" />
                    Items Ordered
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items && selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#6B4E3D]/20 flex items-center justify-center text-xs text-[#6B4E3D] dark:text-[#F5F0E8] font-bold">{item.quantity}</span>
                          <span className="text-sm text-[#2C1E14] dark:text-[#F5F0E8] font-semibold">{item.productName}</span>
                        </div>
                        <span className="text-sm font-bold text-[#2C1E14] dark:text-[#F5F0E8]">₹{item.total?.toFixed(2) || (item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D4C4A8]/30 dark:border-[#4A3428]/30">
                    <span className="text-sm font-bold text-[#2C1E14] dark:text-[#F5F0E8]">Total</span>
                    <span className="text-lg font-bold text-[#6B4E3D] dark:text-[#C75B39]">₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#2C1E14] dark:text-[#F5F0E8] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6B4E3D]" />
                    Track Timeline
                  </h3>
                  <div className="space-y-0 pl-1">
                    {getTimeline(selectedOrder).map((step: any, i: number, arr: any[]) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-3 h-3 rounded-full border-2 shrink-0',
                            step.status === 'Cancelled' ? 'bg-[#C75B39] border-[#C75B39]' : 'bg-[#6B4E3D] border-[#6B4E3D] dark:border-[#C75B39] dark:bg-[#C75B39]'
                          )} />
                          {i < arr.length - 1 && <div className="w-0.5 h-8 bg-[#EDE5D8]/40 dark:bg-[#4A3428]/40" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">{step.status}</p>
                          <p className="text-xs text-[#8B7355] dark:text-[#A08A75]">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
