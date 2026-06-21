import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle2, Search, Utensils, ChefHat, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { addNotification } from '@/lib/notifications';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const columns = [
  { id: 'Pending', label: 'To Cook', color: '#C9A84C', bg: '#C9A84C/10' },
  { id: 'Preparing', label: 'Preparing', color: '#6B4E3D', bg: '#6B4E3D/10' },
  { id: 'Ready', label: 'Completed', color: '#6B7F59', bg: '#6B7F59/10' },
];

interface KitchenItem {
  kitchenItemId: number;
  name: string;
  qty: number;
  completed: boolean;
}

interface KitchenOrder {
  kitchenOrderId: number;
  orderId: number;
  id: string;
  status: string;
  items: KitchenItem[];
  time: string;
  priority: string;
  tableNumber?: string;
}

export function Kitchen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch active kitchen orders
  const { data: rawOrders = [], isLoading } = useQuery<any[]>({
    queryKey: ['kitchenOrders'],
    queryFn: async () => {
      const res = await api.get('/kitchen/active');
      return res.data;
    },
    refetchInterval: 5000, // automatic updates every 5 seconds
  });

  // Map backend orders to frontend structure
  const orders: KitchenOrder[] = rawOrders.map((o) => {
    let status = 'Pending';
    if (o.stage === 'PREPARING') status = 'Preparing';
    if (o.stage === 'COMPLETED') status = 'Ready';
    if (o.stage === 'SERVED') status = 'Served';

    const items: KitchenItem[] = (o.items || []).map((item: any) => ({
      kitchenItemId: item.kitchenItemId,
      name: item.productName || 'Unknown Product',
      qty: item.quantity || 1,
      completed: item.completed || false,
    }));

    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const priority = totalQty > 4 ? 'High' : 'Normal';

    return {
      kitchenOrderId: o.kitchenOrderId,
      orderId: o.orderId,
      id: o.orderNumber || `ORD-${o.orderId}`,
      status,
      items,
      time: o.createdAt || '00:00:00',
      priority,
      tableNumber: o.tableNumber,
    };
  });

  // Calculate workloads dynamically
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const preparingCount = orders.filter((o) => o.status === 'Preparing').length;
  const readyCount = orders.filter((o) => o.status === 'Ready').length;
  const totalCount = orders.length;

  // Mutate kitchen order stage
  const stageMutation = useMutation({
    mutationFn: async ({ kitchenOrderId, stage }: { kitchenOrderId: number; stage: string }) => {
      const res = await api.put(`/kitchen/stage/${kitchenOrderId}?stage=${stage}`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      
      const orderNumber = data.orderNumber || `ORD-${data.orderId}`;
      const stageLabel = variables.stage === 'PREPARING' ? 'Preparing' : variables.stage === 'COMPLETED' ? 'Completed' : 'Served';
      toast.success(`Order ${orderNumber} moved to ${stageLabel}`);

      if (variables.stage === 'PREPARING') {
        addNotification(
          'Order Preparing',
          'Your order is now being prepared in the kitchen.',
          'Order'
        );
        addNotification(
          'Order Status Update',
          `Order #${orderNumber} status updated to Preparing.`,
          'Order'
        );
      } else if (variables.stage === 'COMPLETED') {
        addNotification(
          'Order Ready',
          'Your order is ready! Please collect it.',
          'Order'
        );
        addNotification(
          'Order Ready',
          `Order #${orderNumber} is ready for pickup/delivery.`,
          'Order'
        );
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to update order status');
    },
  });

  // Mutate kitchen item completion status
  const itemCompleteMutation = useMutation({
    mutationFn: async (kitchenItemId: number) => {
      const res = await api.put(`/kitchen/item/${kitchenItemId}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      toast.success('Item marked completed');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to mark item complete');
    },
  });

  const handleMoveOrder = (order: KitchenOrder, toStatus: string) => {
    let backendStage = 'TO_COOK';
    if (toStatus === 'Preparing') backendStage = 'PREPARING';
    if (toStatus === 'Ready') backendStage = 'COMPLETED';
    if (toStatus === 'Served') backendStage = 'SERVED';

    stageMutation.mutate({
      kitchenOrderId: order.kitchenOrderId,
      stage: backendStage,
    });
  };

  const handleMarkItemComplete = (kitchenItemId: number) => {
    itemCompleteMutation.mutate(kitchenItemId);
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-112px)] flex items-center justify-center text-[#8B7355] dark:text-[#A08A75]">
        <div className="flex flex-col items-center gap-2">
          <ChefHat className="w-10 h-10 animate-bounce text-[#6B4E3D]" />
          <p className="text-sm font-semibold font-display">Loading kitchen workload...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Kitchen Board</h1>
          <p className="text-sm text-[#8B7355] dark:text-[#A08A75] mt-0.5">Real-time tracking of food orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders or items..."
              className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20 text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Real-time Workload Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase">To Cook</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{pendingCount}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-800/10 border border-amber-800/20 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-850/20 flex items-center justify-center text-[#6B4E3D] dark:text-[#A0522D]">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase">Preparing</p>
            <p className="text-xl font-bold text-[#6B4E3D] dark:text-[#A0522D] mt-0.5">{preparingCount}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-green-550/10 border border-green-500/20 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-[#6B7F59] dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase">Ready</p>
            <p className="text-xl font-bold text-[#6B7F59] dark:text-green-400 mt-0.5">{readyCount}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] uppercase">Active Total</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{totalCount}</p>
          </div>
        </div>
      </div>

      {/* Board Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col rounded-2xl bg-[#EDE5D8]/20 dark:bg-[#2C1E14]/20 border border-[#D4C4A8]/20 dark:border-[#4A3428]/20 p-4 transition-colors">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
              <h2 className="font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display text-lg">{col.label}</h2>
              <span className="ml-auto text-xs font-bold text-[#6B4F3A] dark:text-[#A08A75] bg-white/60 dark:bg-[#2C1E14]/60 px-2 py-0.5 rounded-lg border border-[#D4C4A8]/30 dark:border-[#4A3428]/30">
                {filteredOrders.filter((o) => o.status === col.id).length}
              </span>
            </div>
            
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
              <AnimatePresence>
                {filteredOrders.filter((o) => o.status === col.id).map((order) => (
                  <motion.div
                    key={order.kitchenOrderId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-[#2C1E14] rounded-xl border border-[#D4C4A8]/40 dark:border-[#4A3428]/30 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2C1E14] dark:text-[#F5F0E8] text-lg">{order.id}</span>
                          {order.priority === 'High' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C75B39]/15 text-[#C75B39] font-bold uppercase">RUSH</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-semibold text-[#8B7355] dark:text-[#A08A75]">Table: {order.tableNumber || 'Takeaway'}</span>
                          <span className="text-xs text-[#8B7355] dark:text-[#A08A75] flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {order.time ? new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00'}
                          </span>
                        </div>
                      </div>
                      {col.id === 'Pending' && (
                        <button
                          onClick={() => handleMoveOrder(order, 'Preparing')}
                          className="w-8 h-8 rounded-lg bg-[#6B4E3D]/10 hover:bg-[#6B4E3D]/20 flex items-center justify-center text-[#6B4E3D] transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      {col.id === 'Preparing' && (
                        <button
                          onClick={() => handleMoveOrder(order, 'Ready')}
                          className="w-8 h-8 rounded-lg bg-[#6B7F59]/10 hover:bg-[#6B7F59]/20 flex items-center justify-center text-[#6B7F59] transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.items.map((item) => (
                        <div
                          key={item.kitchenItemId}
                          onClick={() => col.id === 'Preparing' && !item.completed && handleMarkItemComplete(item.kitchenItemId)}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg transition-all',
                            item.completed ? 'bg-[#6B7F59]/10' : 'bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/50',
                            col.id === 'Preparing' && !item.completed && 'hover:bg-[#EDE5D8]/50 dark:hover:bg-[#EDE5D8]/20 cursor-pointer'
                          )}
                        >
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                            item.completed ? 'bg-[#6B7F59] text-white' : 'bg-[#D4C4A8]/40 text-[#6B4F3A] dark:text-[#D4C4A8]'
                          )}>
                            {item.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : item.qty}
                          </div>
                          <span className={cn(
                            'text-sm font-semibold',
                            item.completed ? 'text-[#6B7F59] line-through' : 'text-[#2C1E14] dark:text-[#F5F0E8]'
                          )}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {col.id === 'Ready' && (
                      <button
                        onClick={() => handleMoveOrder(order, 'Served')}
                        className="w-full h-9 rounded-lg bg-[#6B7F59] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Served
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredOrders.filter((o) => o.status === col.id).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-[#8B7355]">
                  <Utensils className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No orders</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
