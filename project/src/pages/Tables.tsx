import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Check } from 'lucide-react';
import { tables as initialTables } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusConfig = {
  Available: { color: 'bg-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', text: 'text-[#10B981]' },
  Occupied: { color: 'bg-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', text: 'text-[#EF4444]' },
  Reserved: { color: 'bg-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', text: 'text-[#F59E0B]' },
  Cleaning: { color: 'bg-[#8B7355]', bg: 'bg-[#8B7355]/10', border: 'border-[#8B7355]/30', text: 'text-[#3B82F6]' },
};

export function Tables() {
  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState<typeof tables[0] | null>(null);
  const [sectionFilter, setSectionFilter] = useState<string | null>(null);

  const filteredTables = sectionFilter ? tables.filter((t) => t.section === sectionFilter) : tables;
  const sections = [...new Set(tables.map((t) => t.section))];

  const cycleStatus = (tableId: string) => {
    const statuses = ['Available', 'Occupied', 'Reserved', 'Cleaning'];
    setTables((prev) => prev.map((t) => {
      if (t.id === tableId) {
        const currentIndex = statuses.indexOf(t.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length] as keyof typeof statusConfig;
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    toast.success('Table status updated');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Table Management</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Manage restaurant seating</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSectionFilter(null)}
          className={cn(
            'px-3 py-2 rounded-xl text-sm font-medium transition-all',
            sectionFilter === null ? 'bg-[#6B4E3D] text-white' : 'bg-white text-[#8B7355] border border-[#D4C4A8]/30 hover:text-white'
          )}
        >
          All Sections
        </button>
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSectionFilter(section)}
            className={cn(
              'px-3 py-2 rounded-xl text-sm font-medium transition-all',
              sectionFilter === section ? 'bg-[#6B4E3D] text-white' : 'bg-white text-[#8B7355] border border-[#D4C4A8]/30 hover:text-white'
            )}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((table, i) => {
          const config = statusConfig[table.status as keyof typeof statusConfig];
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedTable(table)}
              className={cn(
                'rounded-2xl border p-5 cursor-pointer transition-all hover:scale-[1.02]',
                config.bg,
                config.border
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-3 h-3 rounded-full', config.color)} />
                <span className="text-xs font-medium text-[#8B7355]">{table.section}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{table.name}</h3>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#8B7355]" />
                <span className="text-xs text-[#8B7355]">{table.capacity} seats</span>
              </div>
              <div className={cn('mt-3 text-xs font-medium', config.text)}>
                {table.status}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{selectedTable.name}</h3>
                <button onClick={() => setSelectedTable(null)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#EDE5D8]/30">
                  <span className="text-sm text-[#8B7355]">Section</span>
                  <span className="text-sm font-medium text-white">{selectedTable.section}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#EDE5D8]/30">
                  <span className="text-sm text-[#8B7355]">Capacity</span>
                  <span className="text-sm font-medium text-white">{selectedTable.capacity} seats</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#EDE5D8]/30">
                  <span className="text-sm text-[#8B7355]">Current Status</span>
                  <span className={cn(
                    'text-sm font-medium px-2 py-0.5 rounded-full',
                    statusConfig[selectedTable.status as keyof typeof statusConfig].bg,
                    statusConfig[selectedTable.status as keyof typeof statusConfig].text
                  )}>
                    {selectedTable.status}
                  </span>
                </div>

                <button
                  onClick={() => { cycleStatus(selectedTable.id); setSelectedTable(null); }}
                  className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Change Status
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
