import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Smartphone, Copy, Check, Share2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Table {
  id: string;
  name: string;
  section: string;
  capacity: number;
}

export function QR() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [qrBlobUrl, setQrBlobUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const res = await api.get('/tables');
      return res.data.map((t: any) => ({
        id: t.tableId.toString(),
        name: t.tableNumber,
        section: t.floorName || 'Indoor',
        capacity: t.seats,
      })) as Table[];
    },
  });

  const generateQR = async (tableId: string, tableName: string) => {
    setSelectedTable(tableName);
    const url = `https://ps2-cafe.app/order?tableId=${tableId}`;
    setQrUrl(url);
    setQrLoading(true);
    setQrBlobUrl('');

    try {
      const response = await api.get(`/qr/table/${tableId}`, { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data);
      setQrBlobUrl(imageUrl);
      toast.success(`QR Code generated for ${tableName}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate QR Code from backend');
    } finally {
      setQrLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrBlobUrl) return;
    const link = document.createElement('a');
    link.href = qrBlobUrl;
    link.download = `table-${selectedTable}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded');
  };

  const shareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: `QR Code for ${selectedTable}`,
        text: `Scan to order from Table ${selectedTable}`,
        url: qrUrl,
      }).catch(console.error);
    } else {
      copyUrl();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Ordering</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Generate QR codes for table ordering</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-white mb-4">Select Table</h3>
          {tablesLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#8B7355]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading tables...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {tables.map((table) => (
                <motion.button
                  key={table.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => generateQR(table.id, table.name)}
                  className={cn(
                    'p-3 rounded-xl border text-center transition-all',
                    selectedTable === table.name
                      ? 'border-[#6B4E3D] bg-[#6B4E3D]/10'
                      : 'border-[#D4C4A8]/30 bg-[#EDE5D8]/30 hover:border-[#D4C4A8]/40'
                  )}
                >
                  <Smartphone className="w-5 h-5 text-[#8B7355] mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{table.name}</p>
                  <p className="text-xs text-[#8B7355]">{table.section}</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-white mb-4">QR Code Preview</h3>
          {selectedTable ? (
            <div className="flex flex-col items-center">
              <div className="w-56 h-56 rounded-2xl bg-white p-4 flex items-center justify-center mb-4 border border-[#D4C4A8]/30">
                {qrLoading ? (
                  <div className="flex flex-col items-center justify-center text-[#8B7355]">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-xs">Generating...</p>
                  </div>
                ) : qrBlobUrl ? (
                  <img src={qrBlobUrl} alt="Table QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#8B7355]">
                    <QrCode className="w-16 h-16 opacity-30 mb-2" />
                    <p className="text-xs">Select a table</p>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-white mb-1">{selectedTable}</p>
              <p className="text-xs text-[#8B7355] mb-4">{qrUrl}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyUrl}
                  disabled={qrLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EDE5D8]/30 text-[#8B7355] hover:text-white text-sm transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-[#6B7F59]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                <button
                  onClick={downloadQR}
                  disabled={!qrBlobUrl || qrLoading}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    qrBlobUrl && !qrLoading
                      ? 'bg-[#6B4E3D] text-white hover:bg-[#6B4E3D]/80'
                      : 'bg-[#EDE5D8]/30 text-[#8B7355] cursor-not-allowed'
                  )}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={shareQR}
                  disabled={qrLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EDE5D8]/30 text-[#8B7355] hover:text-white text-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[#8B7355]">
              <QrCode className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a table to generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
