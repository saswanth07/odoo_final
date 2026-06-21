import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChefHat, Utensils, Receipt, Download, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'cooking', label: 'To Cook', icon: ChefHat, desc: 'Order received by kitchen' },
  { id: 'preparing', label: 'Preparing', icon: Utensils, desc: 'Food being prepared' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, desc: 'Ready for pickup' },
];

const demoOrder = {
  id: 'ORD-1024',
  table: 'Table 12',
  customer: 'Sarah Johnson',
  items: [
    { name: 'Caramel Macchiato', qty: 2, price: 440.00 },
    { name: 'Avocado Toast', qty: 1, price: 640.00 },
    { name: 'Blueberry Muffin', qty: 1, price: 280.00 },
  ],
  total: 1800.00,
  status: 'preparing' as const,
  time: '12:34 PM',
};

export function TrackOrder() {
  const { orderId } = useParams();
  const [currentStep] = useState(demoOrder.status);
  const activeIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/60 border border-[#D4C4A8]/30 rounded-2xl p-8 shadow-sm"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#2C1E14] font-display mb-1">Order Tracking</h1>
            <p className="text-sm text-[#8B7355]">Order #{orderId || demoOrder.id}</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 rounded-xl bg-[#EDE5D8]/30">
              <p className="text-xs text-[#8B7355] mb-1">Table</p>
              <p className="text-sm font-bold text-[#2C1E14]">{demoOrder.table}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[#EDE5D8]/30">
              <p className="text-xs text-[#8B7355] mb-1">Customer</p>
              <p className="text-sm font-bold text-[#2C1E14]">{demoOrder.customer}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[#EDE5D8]/30">
              <p className="text-xs text-[#8B7355] mb-1">Time</p>
              <p className="text-sm font-bold text-[#2C1E14]">{demoOrder.time}</p>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= activeIndex;
                const isActive = idx === activeIndex;
                return (
                  <div key={step.id} className="flex flex-col items-center relative flex-1">
                    {idx < steps.length - 1 && (
                      <div className={cn(
                        'absolute top-5 left-[60%] right-0 h-1 rounded-full',
                        idx < activeIndex ? 'bg-[#6B7F59]' : 'bg-[#D4C4A8]/40'
                      )} />
                    )}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 transition-all',
                      isCompleted ? 'bg-[#6B7F59] text-white' : isActive ? 'bg-[#6B4E3D] text-white' : 'bg-[#EDE5D8]/50 text-[#8B7355]'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={cn('text-xs font-medium', isCompleted || isActive ? 'text-[#2C1E14]' : 'text-[#8B7355]')}>{step.label}</p>
                    <p className="text-[10px] text-[#8B7355] mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#2C1E14] mb-3">Ordered Items</h3>
            <div className="space-y-2">
              {demoOrder.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#EDE5D8]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#6B4E3D]/10 flex items-center justify-center text-[#6B4E3D] font-bold text-xs">{item.qty}x</div>
                    <span className="text-sm font-medium text-[#2C1E14]">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-[#2C1E14]">₹{item.price.toFixed(2)}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#D4C4A8]/20">
              <span className="font-semibold text-[#2C1E14]">Total</span>
              <span className="text-xl font-bold text-[#6B4E3D] font-display">₹{demoOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="mb-6 p-4 rounded-xl bg-[#EDE5D8]/30 border border-[#D4C4A8]/20 text-center">
            <div className="w-28 h-28 mx-auto bg-white rounded-xl border border-[#D4C4A8]/30 flex items-center justify-center mb-3">
              <div className="w-20 h-20 bg-[#2C1E14] rounded-lg flex flex-col items-center justify-center text-white">
                <QrCode className="w-8 h-8 mb-1" />
                <span className="text-[8px]">QR-{orderId || '1024'}</span>
              </div>
            </div>
            <p className="text-xs text-[#8B7355]">Scan this QR code anytime to track your order</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 h-11 rounded-xl gradient-coffee text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            <button className="flex-1 h-11 rounded-xl border border-[#D4C4A8]/50 text-[#6B4E3D] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#EDE5D8]/30 transition-colors">
              <Receipt className="w-4 h-4" />
              View Details
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
