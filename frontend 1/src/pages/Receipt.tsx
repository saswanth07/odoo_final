import { useState, useEffect } from 'react';
import { Printer, Download, Mail, Coffee, Check, Loader2, Search } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  orderId: number;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  tableNumber?: string;
  totalAmount: number;
  paymentMethod?: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  employeeName?: string;
}

function buildPDF(order: Order): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' });
  const margin = 15;
  let y = margin;

  doc.setFillColor(107, 78, 61);
  doc.rect(0, 0, doc.internal.pageSize.width, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PS2 Cafe', margin, 15);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Receipt / Tax Invoice', margin, 22);
  doc.text('123 Coffee Street, Downtown', margin, 28);

  y = 44;
  doc.setTextColor(44, 30, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt: REC-${order.orderId}`, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Order: ${order.orderNumber || `#${order.orderId}`}`, margin, y + 6);
  doc.text(`Date: ${order.createdAt}`, margin, y + 12);
  if (order.tableNumber) { doc.text(`Table: ${order.tableNumber}`, margin, y + 18); y += 6; }
  y += 22;

  if (order.customerName) {
    doc.setFillColor(237, 229, 216);
    doc.rect(margin - 2, y - 2, doc.internal.pageSize.width - (margin - 2) * 2, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Customer:', margin, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerName, margin + 22, y + 4);
    y += 16;
  }

  doc.setFillColor(107, 78, 61);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin - 2, y, doc.internal.pageSize.width - (margin - 2) * 2, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', margin, y + 5.5);
  doc.text('Qty', 98, y + 5.5);
  doc.text('Rate', 112, y + 5.5);
  doc.text('Total', 132, y + 5.5);
  y += 12;

  doc.setTextColor(44, 30, 20);
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item, idx) => {
    if (idx % 2 === 0) { doc.setFillColor(249, 245, 239); doc.rect(margin - 2, y - 2, doc.internal.pageSize.width - (margin - 2) * 2, 8, 'F'); }
    doc.setFontSize(8);
    doc.text(item.productName.substring(0, 28), margin, y + 4);
    doc.text(String(item.quantity), 101, y + 4);
    doc.text(`Rs.${item.unitPrice?.toFixed(2)}`, 110, y + 4);
    doc.text(`Rs.${item.total?.toFixed(2)}`, 130, y + 4);
    y += 9;
  });

  y += 4;
  doc.setDrawColor(212, 196, 168);
  doc.line(margin, y, doc.internal.pageSize.width - margin, y);
  y += 6;

  const subtotal = order.totalAmount / 1.08;
  const tax = order.totalAmount - subtotal;
  [[`Subtotal`, `Rs.${subtotal.toFixed(2)}`], [`Tax (8%)`, `Rs.${tax.toFixed(2)}`]].forEach(([lbl, val]) => {
    doc.setFontSize(9);
    doc.text(lbl, margin, y);
    doc.text(val, doc.internal.pageSize.width - margin - doc.getTextWidth(val), y);
    y += 6;
  });

  doc.line(margin, y, doc.internal.pageSize.width - margin, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total', margin, y);
  const totStr = `Rs.${order.totalAmount?.toFixed(2)}`;
  doc.text(totStr, doc.internal.pageSize.width - margin - doc.getTextWidth(totStr), y);
  y += 8;

  if (order.paymentMethod) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Paid via: ${order.paymentMethod}`, margin, y);
    y += 6;
  }
  if (order.employeeName) {
    doc.text(`Served by: ${order.employeeName}`, margin, y);
  }

  doc.setFillColor(249, 245, 239);
  doc.rect(0, doc.internal.pageSize.height - 18, doc.internal.pageSize.width, 18, 'F');
  doc.setFontSize(8);
  doc.setTextColor(139, 115, 85);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for visiting PS2 Cafe! ☕  Come again.', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 8, { align: 'center' });

  return doc;
}

export function Receipt() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [search, setSearch] = useState('');

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['completed-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data
        .filter((o: any) => o.status === 'COMPLETED' || o.status === 'Completed')
        .map((o: any) => ({
          orderId: o.orderId,
          orderNumber: o.orderNumber || `#${o.orderId}`,
          customerName: o.customerName || (o.customerId ? `Customer #${o.customerId}` : 'Guest'),
          customerEmail: o.customerEmail || '',
          tableNumber: o.tableNumber,
          totalAmount: o.totalAmount,
          paymentMethod: o.paymentMethod || '—',
          status: o.status,
          createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—',
          items: (o.items || []).map((item: any) => ({
            productName: item.productName || item.name || 'Item',
            quantity: item.quantity,
            unitPrice: item.unitPrice || item.price || 0,
            total: item.total || item.quantity * (item.unitPrice || 0),
          })) as OrderItem[],
          employeeName: o.employeeName,
        })) as Order[];
    },
  });

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) setSelectedOrderId(orders[0].orderId);
  }, [orders, selectedOrderId]);

  const sendReceiptMutation = useMutation({
    mutationFn: async ({ orderId, email, pdfBlob }: { orderId: number; email: string; pdfBlob: Blob }) => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('file', pdfBlob, `receipt-${orderId}.pdf`);
      await api.post(`/orders/${orderId}/send-receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => { toast.success('Receipt emailed successfully!'); setShowEmailBox(false); setEmailInput(''); },
    onError: () => toast.error('Failed to send receipt'),
  });

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId) || null;

  const handleDownload = () => {
    if (!selectedOrder) return;
    buildPDF(selectedOrder).save(`receipt-${selectedOrder.orderNumber}.pdf`);
    toast.success('Receipt PDF downloaded');
  };

  const handlePrint = () => {
    if (!selectedOrder) return;
    const url = buildPDF(selectedOrder).output('bloburl');
    const w = window.open(url as unknown as string);
    if (w) { w.focus(); w.onload = () => w.print(); }
    toast.success('Sent to printer');
  };

  const handleEmailSend = async () => {
    if (!selectedOrder || !emailInput.trim()) return;
    const blob = buildPDF(selectedOrder).output('blob');
    await sendReceiptMutation.mutateAsync({ orderId: selectedOrder.orderId, email: emailInput.trim(), pdfBlob: blob });
  };

  const filteredOrders = orders.filter((o) =>
    (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName || '').toLowerCase().includes(search.toLowerCase())
  );

  const tax = selectedOrder ? selectedOrder.totalAmount - selectedOrder.totalAmount / 1.08 : 0;
  const subtotal = selectedOrder ? selectedOrder.totalAmount - tax : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Receipt Generator</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Generate and send receipts for completed orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order List Panel */}
        <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-[#2C1E14] mb-3">Completed Orders</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8B7355]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-xs focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-[#8B7355]"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-sm text-[#8B7355] text-center py-6">No completed orders</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredOrders.map((order) => (
                <button key={order.orderId} onClick={() => setSelectedOrderId(order.orderId)}
                  className={cn('w-full p-3 rounded-xl border text-left transition-all',
                    selectedOrderId === order.orderId
                      ? 'border-[#6B4E3D] bg-[#6B4E3D]/5'
                      : 'border-[#D4C4A8]/30 hover:border-[#6B4E3D]/30 hover:bg-[#EDE5D8]/20')}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#2C1E14]">{order.orderNumber}</span>
                    <span className="text-sm font-medium text-[#6B4E3D]">₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-[#8B7355] mt-0.5">{order.customerName} · {order.createdAt}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Receipt Preview */}
        <div className="lg:col-span-2">
          {!selectedOrder ? (
            <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-8 flex flex-col items-center justify-center text-[#8B7355] min-h-[400px]">
              <Coffee className="w-10 h-10 opacity-20 mb-3" />
              <p className="text-sm">Select an order to preview receipt</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-6">
              {/* Receipt Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B4E3D] to-[#C9A84C] flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2C1E14]">PS2 Cafe</h3>
                    <p className="text-xs text-[#8B7355]">123 Coffee Street, Downtown</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2C1E14]">REC-{selectedOrder.orderId}</p>
                  <p className="text-xs text-[#8B7355]">{selectedOrder.createdAt}</p>
                </div>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-[#EDE5D8]/30">
                <p className="text-xs text-[#8B7355] uppercase tracking-wider mb-1">Customer</p>
                <p className="text-sm font-medium text-[#2C1E14]">{selectedOrder.customerName}</p>
                {selectedOrder.tableNumber && <p className="text-xs text-[#8B7355]">Table: {selectedOrder.tableNumber}</p>}
              </div>

              {/* Items */}
              <div className="border-t border-[#D4C4A8]/30 pt-4 mb-4">
                <p className="text-xs text-[#8B7355] uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#8B7355] w-6">{item.quantity}×</span>
                        <span className="text-[#2C1E14]">{item.productName}</span>
                      </div>
                      <span className="text-[#2C1E14]">₹{item.total?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-[#D4C4A8]/30 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B7355]">Subtotal</span>
                  <span className="text-[#2C1E14]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B7355]">GST (8%)</span>
                  <span className="text-[#2C1E14]">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#D4C4A8]/30">
                  <span className="text-lg font-semibold text-[#2C1E14]">Total</span>
                  <span className="text-2xl font-bold text-[#6B4E3D]">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment info */}
              <div className="mt-4 pt-4 border-t border-[#D4C4A8]/30 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B7355]">Payment Method</span>
                  <span className="text-[#2C1E14]">{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.employeeName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8B7355]">Served By</span>
                    <span className="text-[#2C1E14]">{selectedOrder.employeeName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mt-5">
                <div className="w-7 h-7 rounded-full bg-[#6B7F59]/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-[#6B7F59]" />
                </div>
                <span className="text-sm text-[#8B7355]">Payment Successful</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-5">
                <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#EDE5D8]/40 text-[#8B7355] hover:text-[#2C1E14] text-sm font-medium transition-colors">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button onClick={() => { setEmailInput(selectedOrder.customerEmail || ''); setShowEmailBox(true); }}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#EDE5D8]/40 text-[#8B7355] hover:text-[#2C1E14] text-sm font-medium transition-colors">
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>

              {/* Email input */}
              {showEmailBox && (
                <div className="mt-4 p-4 rounded-xl bg-[#EDE5D8]/30 border border-[#D4C4A8]/30">
                  <p className="text-sm font-medium text-[#2C1E14] mb-2">Send Receipt via Email</p>
                  <div className="flex gap-2">
                    <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="customer@email.com"
                      className="flex-1 h-9 px-3 rounded-lg bg-white border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                    <button onClick={handleEmailSend} disabled={!emailInput.trim() || sendReceiptMutation.isPending}
                      className="px-4 h-9 rounded-lg bg-[#6B4E3D] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5">
                      {sendReceiptMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
