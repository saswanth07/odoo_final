import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Printer, Download, Mail, Eye, X, Receipt, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ReceiptOrder {
  orderId: number;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  totalAmount: number;
  paymentMethod?: string;
  status: string;
  createdAt: string;
  items?: { productName: string; quantity: number; unitPrice: number; total: number }[];
  tableNumber?: string;
}

function generatePDF(order: ReceiptOrder): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' });
  const margin = 15;
  let y = margin;

  // Header
  doc.setFillColor(107, 78, 61);
  doc.rect(0, 0, doc.internal.pageSize.width, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PS2 Cafe', margin, 15);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Receipt / Invoice', margin, 22);
  doc.text('123 Coffee Street, Downtown', margin, 28);

  y = 45;
  doc.setTextColor(44, 30, 20);

  // Receipt info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt: REC-${order.orderId}`, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Order: ${order.orderNumber || `#${order.orderId}`}`, margin, y + 6);
  doc.text(`Date: ${order.createdAt}`, margin, y + 12);
  if (order.tableNumber) doc.text(`Table: ${order.tableNumber}`, margin, y + 18);
  y += order.tableNumber ? 28 : 22;

  // Customer
  if (order.customerName) {
    doc.setFillColor(237, 229, 216);
    doc.rect(margin - 2, y - 2, doc.internal.pageSize.width - (margin - 2) * 2, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Customer', margin, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerName, margin + 25, y + 4);
    if (order.customerEmail) doc.text(order.customerEmail, margin + 25, y + 9);
    y += 18;
  }

  // Items header
  doc.setFillColor(107, 78, 61);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin - 2, y, doc.internal.pageSize.width - (margin - 2) * 2, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', margin, y + 5.5);
  doc.text('Qty', 100, y + 5.5);
  doc.text('Price', 115, y + 5.5);
  doc.text('Total', 135, y + 5.5);
  y += 12;

  doc.setTextColor(44, 30, 20);
  doc.setFont('helvetica', 'normal');
  const items = order.items || [];
  items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(249, 245, 239);
      doc.rect(margin - 2, y - 2, doc.internal.pageSize.width - (margin - 2) * 2, 8, 'F');
    }
    doc.setFontSize(8);
    doc.text(item.productName.substring(0, 30), margin, y + 4);
    doc.text(String(item.quantity), 103, y + 4);
    doc.text(`Rs.${item.unitPrice.toFixed(2)}`, 113, y + 4);
    doc.text(`Rs.${item.total.toFixed(2)}`, 133, y + 4);
    y += 9;
  });

  y += 4;
  doc.setDrawColor(212, 196, 168);
  doc.line(margin, y, doc.internal.pageSize.width - margin, y);
  y += 6;

  // Totals
  const tax = order.totalAmount * 0.08;
  const subtotal = order.totalAmount - tax;
  const rows = [
    ['Subtotal', `Rs.${subtotal.toFixed(2)}`],
    ['Tax (8%)', `Rs.${tax.toFixed(2)}`],
  ];
  rows.forEach(([label, val]) => {
    doc.setFontSize(9);
    doc.text(label, margin, y);
    doc.text(val, doc.internal.pageSize.width - margin - doc.getTextWidth(val), y);
    y += 6;
  });

  doc.line(margin, y, doc.internal.pageSize.width - margin, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total', margin, y);
  const totalStr = `Rs.${order.totalAmount.toFixed(2)}`;
  doc.text(totalStr, doc.internal.pageSize.width - margin - doc.getTextWidth(totalStr), y);
  y += 10;

  // Payment method
  if (order.paymentMethod) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Method: ${order.paymentMethod}`, margin, y);
    y += 8;
  }

  // Footer
  doc.setFillColor(249, 245, 239);
  doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
  doc.setFontSize(8);
  doc.setTextColor(139, 115, 85);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for visiting PS2 Cafe! ☕', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  return doc;
}

export function Receipts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ReceiptOrder | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const { data: orders = [], isLoading, refetch } = useQuery<ReceiptOrder[]>({
    queryKey: ['receipt-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data
        .filter((o: any) => o.status === 'COMPLETED' || o.status === 'Completed')
        .map((o: any) => ({
          orderId: o.orderId,
          orderNumber: o.orderNumber || `#${o.orderId}`,
          customerName: o.customerName || (o.customerId ? `Customer #${o.customerId}` : 'Guest'),
          customerEmail: o.customerEmail || '',
          totalAmount: o.totalAmount,
          paymentMethod: o.paymentMethod || '—',
          status: o.status,
          createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—',
          items: o.items || [],
          tableNumber: o.tableNumber,
        }));
    },
  });

  const sendReceiptMutation = useMutation({
    mutationFn: async ({ orderId, email, pdfBlob }: { orderId: number; email: string; pdfBlob: Blob }) => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('file', pdfBlob, `receipt-${orderId}.pdf`);
      await api.post(`/orders/${orderId}/send-receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => toast.success('Receipt sent successfully!'),
    onError: () => toast.error('Failed to send receipt email'),
  });

  const handleDownload = (order: ReceiptOrder) => {
    const doc = generatePDF(order);
    doc.save(`receipt-${order.orderNumber || order.orderId}.pdf`);
    toast.success(`Receipt downloaded`);
  };

  const handlePrint = (order: ReceiptOrder) => {
    const doc = generatePDF(order);
    const url = doc.output('bloburl');
    const w = window.open(url as unknown as string);
    if (w) { w.focus(); w.onload = () => { w.print(); }; }
    toast.success('Sent to printer');
  };

  const handleEmailSend = async () => {
    if (!selectedOrder || !emailInput.trim()) return;
    const doc = generatePDF(selectedOrder);
    const blob = doc.output('blob');
    await sendReceiptMutation.mutateAsync({ orderId: selectedOrder.orderId, email: emailInput.trim(), pdfBlob: blob });
    setShowEmailPrompt(false);
    setEmailInput('');
  };

  const filtered = orders.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.orderNumber || '').toLowerCase().includes(q) ||
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.customerEmail || '').toLowerCase().includes(q) ||
      r.createdAt.includes(q)
    );
  });

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Receipts</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Download, print, and email receipts</p>
        </div>
        <button onClick={() => refetch()} className="w-9 h-9 rounded-xl bg-[#EDE5D8]/50 hover:bg-[#EDE5D8] flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          placeholder="Search by order, customer, email, or date..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50 text-sm"
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#8B7355]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading receipts...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D4C4A8]/20">
                    {['Receipt #', 'Customer', 'Order', 'Amount', 'Method', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="text-center py-12 text-[#8B7355]">
                          <Receipt className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">No receipts found</p>
                          <p className="text-xs mt-1 opacity-60">Completed orders will appear here</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.map((r, i) => (
                    <motion.tr key={r.orderId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-[#D4C4A8]/10 hover:bg-[#EDE5D8]/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-[#6B4E3D]" />
                          <span className="text-sm font-medium text-[#2C1E14]">REC-{r.orderId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#2C1E14]">{r.customerName}</p>
                        {r.customerEmail && <p className="text-xs text-[#8B7355]">{r.customerEmail}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8B7355]">{r.orderNumber}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#2C1E14]">₹{r.totalAmount?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#6B4E3D]/10 text-[#6B4E3D] font-medium">{r.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8B7355]">{r.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedOrder(r)} title="View" className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#6B4E3D]/10 flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D] transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handlePrint(r)} title="Print" className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#6B7F59]/10 flex items-center justify-center text-[#8B7355] hover:text-[#6B7F59] transition-colors">
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDownload(r)} title="Download PDF" className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#C75B39]/10 flex items-center justify-center text-[#8B7355] hover:text-[#C75B39] transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setSelectedOrder(r); setEmailInput(r.customerEmail || ''); setShowEmailPrompt(true); }}
                            title="Email Receipt"
                            className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#C9A84C]/10 flex items-center justify-center text-[#8B7355] hover:text-[#C9A84C] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-[#D4C4A8]/20">
                <p className="text-xs text-[#8B7355]">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#EDE5D8]/30 text-[#8B7355] hover:bg-[#EDE5D8]/60 disabled:opacity-40 transition-colors">Prev</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
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

      {/* Receipt Detail Modal */}
      <AnimatePresence>
        {selectedOrder && !showEmailPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FDF5ED] border border-[#D4C4A8]/30 rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-[#8B7355] hover:text-[#2C1E14] transition-colors">
                  <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back</span>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/50 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#6B4E3D]/10 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-[#6B4E3D]" />
                </div>
                <h2 className="text-xl font-bold text-[#2C1E14]">REC-{selectedOrder.orderId}</h2>
                <p className="text-sm text-[#8B7355]">Order: {selectedOrder.orderNumber}</p>
              </div>

              <div className="space-y-2 mb-4">
                {(([
                  ['Customer', selectedOrder.customerName],
                  ['Email', selectedOrder.customerEmail || '—'],
                  ['Payment Method', selectedOrder.paymentMethod],
                  ['Date', selectedOrder.createdAt],
                  selectedOrder.tableNumber ? ['Table', selectedOrder.tableNumber] : null,
                ].filter(Boolean)) as string[][]).map(([label, value]) => (
                  <div key={label as string} className="flex items-center justify-between text-sm">
                    <span className="text-[#8B7355]">{label}</span>
                    <span className="text-[#2C1E14] font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#8B7355] uppercase tracking-wider mb-2">Items</p>
                  <div className="space-y-1.5">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-[#8B7355]">{item.quantity}× {item.productName}</span>
                        <span className="text-[#2C1E14]">₹{item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#D4C4A8]/20">
                <span className="font-semibold text-[#2C1E14]">Total</span>
                <span className="text-xl font-bold text-[#6B4E3D]">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                <button onClick={() => handlePrint(selectedOrder)} className="h-10 rounded-xl bg-[#6B4E3D] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={() => handleDownload(selectedOrder)} className="h-10 rounded-xl bg-[#6B7F59] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button onClick={() => { setEmailInput(selectedOrder.customerEmail || ''); setShowEmailPrompt(true); }}
                  className="h-10 rounded-xl border border-[#D4C4A8]/50 text-[#6B4E3D] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#EDE5D8]/30 transition-colors">
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button onClick={() => setSelectedOrder(null)} className="h-10 rounded-xl border border-[#D4C4A8]/50 text-[#8B7355] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#EDE5D8]/30 transition-colors">
                  <X className="w-4 h-4" /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Prompt Modal */}
      <AnimatePresence>
        {showEmailPrompt && selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-sm p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2C1E14]">Email Receipt</h3>
                <button onClick={() => setShowEmailPrompt(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <p className="text-sm text-[#8B7355] mb-4">
                Send receipt <strong className="text-[#2C1E14]">REC-{selectedOrder.orderId}</strong> as a PDF attachment.
              </p>
              <div className="mb-4">
                <label className="block text-sm text-[#8B7355] mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowEmailPrompt(false)}
                  className="flex-1 h-10 rounded-xl border border-[#D4C4A8]/50 text-[#8B7355] text-sm font-medium hover:bg-[#EDE5D8]/30 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleEmailSend}
                  disabled={!emailInput.trim() || sendReceiptMutation.isPending}
                  className="flex-1 h-10 rounded-xl bg-[#6B4E3D] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sendReceiptMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
