import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Plus, Trash2, Save, Move, X, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Floor {
  id: number;
  floorId?: number;
  name: string;
}

interface Table {
  id: number;
  tableId?: number;
  tableNumber: string;
  seats: number;
  status: string;
  floorId: number;
  coordX: number;
  coordY: number;
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-[#6B7F59] border-[#6B7F59]',
  OCCUPIED: 'bg-[#C75B39] border-[#C75B39]',
  RESERVED: 'bg-[#C9A84C] border-[#C9A84C]',
  CLEANING: 'bg-[#5B9BD5] border-[#5B9BD5]',
  available: 'bg-[#6B7F59] border-[#6B7F59]',
  occupied: 'bg-[#C75B39] border-[#C75B39]',
  reserved: 'bg-[#C9A84C] border-[#C9A84C]',
  cleaning: 'bg-[#5B9BD5] border-[#5B9BD5]',
};

const GRID_SNAP = 5; // % snap
const TABLE_SIZE = 80;

export function Floors() {
  const queryClient = useQueryClient();
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localPositions, setLocalPositions] = useState<Record<number, { x: number; y: number }>>({});
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', seats: 4 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const { data: floors = [], isLoading: floorsLoading } = useQuery<Floor[]>({
    queryKey: ['floors'],
    queryFn: async () => {
      const res = await api.get('/floors');
      return res.data.map((f: any) => ({ id: f.floorId || f.id, name: f.floorName || f.name, floorId: f.floorId })) as Floor[];
    },
  });

  useEffect(() => {
    if (floors.length > 0 && !selectedFloor) setSelectedFloor(floors[0].id);
  }, [floors, selectedFloor]);

  const { data: tables = [], isLoading: tablesLoading } = useQuery<Table[]>({
    queryKey: ['tables', selectedFloor],
    queryFn: async () => {
      const res = selectedFloor
        ? await api.get(`/tables/floor/${selectedFloor}`)
        : await api.get('/tables');
      return res.data.map((t: any) => ({
        id: t.tableId || t.id,
        tableNumber: t.tableNumber || t.name || `T${t.tableId}`,
        seats: t.seats || 4,
        status: t.activeStatus !== false ? 'AVAILABLE' : 'OCCUPIED',
        floorId: t.floorId,
        coordX: t.coordX ?? 10,
        coordY: t.coordY ?? 10,
      }));
    },
    enabled: !!selectedFloor,
  });

  const createFloorMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post('/floors', { floorName: name });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      const newId = data.floorId || data.id;
      setSelectedFloor(newId);
      toast.success(`Floor "${data.floorName || data.name}" created`);
      setShowAddFloor(false);
      setNewFloorName('');
    },
    onError: () => toast.error('Failed to create floor'),
  });

  const deleteFloorMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/floors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      setSelectedFloor(floors[0]?.id ?? null);
      toast.success('Floor deleted');
    },
    onError: () => toast.error('Failed to delete floor'),
  });

  const createTableMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/tables', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', selectedFloor] });
      toast.success('Table added');
      setShowAddTable(false);
      setNewTable({ tableNumber: '', seats: 4 });
    },
    onError: () => toast.error('Failed to add table'),
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`/tables/${id}`, data);
      return res.data;
    },
    onError: () => toast.error('Failed to update table position'),
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tables/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', selectedFloor] });
      toast.success('Table removed');
    },
    onError: () => toast.error('Failed to delete table'),
  });

  // Drag handlers
  const getTablePosition = useCallback((table: Table) => {
    return localPositions[table.id] ?? { x: table.coordX, y: table.coordY };
  }, [localPositions]);

  const handleMouseDown = (e: React.MouseEvent, tableId: number) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    const pos = getTablePosition(table);
    const pctX = (pos.x / 100) * rect.width;
    const pctY = (pos.y / 100) * rect.height;
    setDragOffset({ x: e.clientX - rect.left - pctX, y: e.clientY - rect.top - pctY });
    setDraggingId(tableId);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let rawX = e.clientX - rect.left - dragOffset.x;
    let rawY = e.clientY - rect.top - dragOffset.y;
    // Convert to percentage
    let pctX = (rawX / rect.width) * 100;
    let pctY = (rawY / rect.height) * 100;
    // Snap to grid
    pctX = Math.round(pctX / GRID_SNAP) * GRID_SNAP;
    pctY = Math.round(pctY / GRID_SNAP) * GRID_SNAP;
    // Clamp
    pctX = Math.max(0, Math.min(pctX, 90));
    pctY = Math.max(0, Math.min(pctY, 85));
    setLocalPositions(prev => ({ ...prev, [draggingId]: { x: pctX, y: pctY } }));
  }, [draggingId, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (draggingId === null) return;
    const pos = localPositions[draggingId];
    if (pos) {
      const table = tables.find(t => t.id === draggingId);
      if (table) {
        updateTableMutation.mutate({
          id: draggingId,
          data: {
            tableNumber: table.tableNumber,
            seats: table.seats,
            activeStatus: table.status === 'AVAILABLE' || table.status === 'available',
            floorId: table.floorId,
            coordX: pos.x,
            coordY: pos.y,
          },
        });
      }
    }
    setDraggingId(null);
  }, [draggingId, localPositions, tables]);

  const handleSavePositions = () => {
    const updates = Object.entries(localPositions);
    if (updates.length === 0) { toast.info('No position changes to save'); return; }
    Promise.all(updates.map(([idStr, pos]) => {
      const id = parseInt(idStr);
      const table = tables.find(t => t.id === id);
      if (!table) return Promise.resolve();
      return updateTableMutation.mutateAsync({
        id,
        data: {
          tableNumber: table.tableNumber,
          seats: table.seats,
          activeStatus: table.status === 'AVAILABLE' || table.status === 'available',
          floorId: table.floorId,
          coordX: pos.x,
          coordY: pos.y,
        },
      });
    })).then(() => {
      toast.success('All positions saved');
      queryClient.invalidateQueries({ queryKey: ['tables', selectedFloor] });
      setLocalPositions({});
    });
  };

  const currentFloor = floors.find(f => f.id === selectedFloor);
  const floorTables = tables.filter(t => t.floorId === selectedFloor);

  const statusCounts = {
    available: floorTables.filter(t => ['AVAILABLE', 'available'].includes(t.status)).length,
    occupied: floorTables.filter(t => ['OCCUPIED', 'occupied'].includes(t.status)).length,
    reserved: floorTables.filter(t => ['RESERVED', 'reserved'].includes(t.status)).length,
    cleaning: floorTables.filter(t => ['CLEANING', 'cleaning'].includes(t.status)).length,
  };

  if (floorsLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-[#8B7355]">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Loading floors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Floor Management</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Drag tables to arrange your floor layout</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(localPositions).length > 0 && (
            <button
              onClick={handleSavePositions}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B7F59] text-white text-sm font-medium hover:bg-[#6B7F59]/80 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Layout
            </button>
          )}
          <button
            onClick={() => setShowAddFloor(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Floor
          </button>
        </div>
      </div>

      {/* Floor Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {floors.map((f) => (
          <div key={f.id} className="flex items-center gap-1">
            <button
              onClick={() => { setSelectedFloor(f.id); setLocalPositions({}); }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                selectedFloor === f.id
                  ? 'bg-[#6B4E3D] text-white'
                  : 'bg-white text-[#8B7355] border border-[#D4C4A8]/30 hover:border-[#6B4E3D]/40'
              )}
            >
              <Layers className="w-4 h-4" />
              {f.name}
            </button>
            {selectedFloor === f.id && floors.length > 1 && (
              <button
                onClick={() => deleteFloorMutation.mutate(f.id)}
                className="w-7 h-7 rounded-lg bg-[#C75B39]/10 hover:bg-[#C75B39]/20 flex items-center justify-center text-[#C75B39] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        {floors.length === 0 && (
          <p className="text-sm text-[#8B7355] py-2">No floors yet. Add your first floor to get started.</p>
        )}
      </div>

      {currentFloor && (
        <motion.div
          key={selectedFloor}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-6"
        >
          {/* Legend + Actions */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Map className="w-5 h-5 text-[#6B4E3D]" />
              <h2 className="text-lg font-bold text-[#2C1E14]">{currentFloor.name}</h2>
              <span className="text-sm text-[#8B7355]">— {floorTables.length} tables</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm flex-wrap">
                {[
                  { label: 'Available', count: statusCounts.available, color: 'bg-[#6B7F59]' },
                  { label: 'Occupied', count: statusCounts.occupied, color: 'bg-[#C75B39]' },
                  { label: 'Reserved', count: statusCounts.reserved, color: 'bg-[#C9A84C]' },
                  { label: 'Cleaning', count: statusCounts.cleaning, color: 'bg-[#5B9BD5]' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className={cn('w-3 h-3 rounded-full', s.color)} />
                    <span className="text-[#8B7355]">{s.label} ({s.count})</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAddTable(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#6B4E3D]/10 text-[#6B4E3D] text-sm font-medium hover:bg-[#6B4E3D]/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Table
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="relative rounded-xl border border-[#D4C4A8]/20 overflow-hidden select-none"
            style={{
              minHeight: 520,
              background: 'radial-gradient(circle at 1px 1px, rgba(107,78,61,0.08) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              backgroundColor: '#F9F5EF',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {tablesLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-[#8B7355]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">Loading tables...</span>
              </div>
            ) : floorTables.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8B7355]">
                <Move className="w-10 h-10 opacity-20 mb-3" />
                <p className="text-sm">No tables on this floor</p>
                <p className="text-xs mt-1 opacity-60">Click "Add Table" to place your first table</p>
              </div>
            ) : null}

            {floorTables.map((table) => {
              const pos = getTablePosition(table);
              const isDragging = draggingId === table.id;
              return (
                <motion.div
                  key={table.id}
                  animate={{ scale: isDragging ? 1.08 : 1 }}
                  className={cn(
                    'absolute flex flex-col items-center justify-center rounded-xl border-2 cursor-grab active:cursor-grabbing shadow-md transition-shadow group',
                    statusColors[table.status] || 'bg-[#8B7355] border-[#8B7355]',
                    isDragging && 'shadow-2xl z-50 ring-2 ring-white/50'
                  )}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: TABLE_SIZE,
                    height: TABLE_SIZE,
                    zIndex: isDragging ? 50 : 10,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, table.id)}
                >
                  <span className="text-xs font-bold text-white">{table.tableNumber}</span>
                  <span className="text-[10px] text-white/80">{table.seats} seats</span>
                  <button
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#C75B39] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); deleteTableMutation.mutate(table.id); }}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Drag hint */}
          <p className="text-xs text-[#8B7355] mt-3 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5" />
            Drag tables to reposition. Changes are saved automatically on drop. Click "Save Layout" to persist all.
          </p>
        </motion.div>
      )}

      {/* Add Floor Modal */}
      <AnimatePresence>
        {showAddFloor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2C1E14]">Add New Floor</h3>
                <button onClick={() => setShowAddFloor(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/50 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Floor Name</label>
                  <input
                    type="text"
                    value={newFloorName}
                    onChange={(e) => setNewFloorName(e.target.value)}
                    placeholder="e.g. Ground Floor, Rooftop..."
                    className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]"
                    onKeyDown={(e) => e.key === 'Enter' && newFloorName.trim() && createFloorMutation.mutate(newFloorName.trim())}
                  />
                </div>
                <button
                  onClick={() => newFloorName.trim() && createFloorMutation.mutate(newFloorName.trim())}
                  disabled={!newFloorName.trim() || createFloorMutation.isPending}
                  className="w-full h-11 rounded-xl bg-[#6B4E3D] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createFloorMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Floor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Table Modal */}
      <AnimatePresence>
        {showAddTable && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2C1E14]">Add Table</h3>
                <button onClick={() => setShowAddTable(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/50 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Table Number / Name</label>
                  <input
                    type="text"
                    value={newTable.tableNumber}
                    onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                    placeholder="e.g. T1, A-5..."
                    className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newTable.seats}
                    onChange={(e) => setNewTable({ ...newTable, seats: parseInt(e.target.value) || 4 })}
                    className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newTable.tableNumber.trim()) return;
                    createTableMutation.mutate({
                      tableNumber: newTable.tableNumber.trim(),
                      seats: newTable.seats,
                      activeStatus: true,
                      floorId: selectedFloor,
                      coordX: 10,
                      coordY: 10,
                    });
                  }}
                  disabled={!newTable.tableNumber.trim() || createTableMutation.isPending}
                  className="w-full h-11 rounded-xl bg-[#6B4E3D] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createTableMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Table
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
