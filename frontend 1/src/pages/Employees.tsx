import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Check, UserCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';

interface Employee {
  id: string; // maps to userId
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'kitchen';
  status: 'Active' | 'Inactive';
  avatar: string;
  revenue: number;
  orders: number;
}

export function Employees() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState({ name: '', role: 'employee', email: '', status: 'Active' });

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data.map((user: any) => {
        let mappedRole: 'admin' | 'employee' | 'kitchen' = 'employee';
        const roleLower = user.role.toLowerCase();
        if (roleLower === 'admin') mappedRole = 'admin';
        else if (roleLower === 'kitchen') mappedRole = 'kitchen';
        else if (roleLower === 'cashier') mappedRole = 'employee';

        return {
          id: user.userId.toString(),
          name: user.name,
          email: user.email,
          role: mappedRole,
          status: user.active ? 'Active' : 'Inactive',
          avatar: user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'EM',
          revenue: 0, // Fallback for stats
          orders: 0,   // Fallback for stats
        };
      }) as Employee[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newEmp: any) => {
      const res = await api.post('/employees', newEmp);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added. Initial password sent via email.');
      setShowModal(false);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to add employee');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/employees/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee details updated');
      setShowModal(false);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to update employee');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to delete employee');
    },
  });

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', role: 'employee', email: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({ name: emp.name, role: emp.role, email: emp.email, status: emp.status });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let backendRole = 'CASHIER';
    if (form.role === 'admin') backendRole = 'ADMIN';
    else if (form.role === 'kitchen') backendRole = 'KITCHEN';

    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        data: {
          userId: parseInt(editing.id),
          name: form.name,
          email: form.email,
          role: backendRole,
          active: form.status === 'Active',
        },
      });
    } else {
      createMutation.mutate({
        name: form.name,
        email: form.email,
        role: backendRole,
        password: 'dummyPassword123', // required for backend validation, overridden with random UUID
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Manage your team</p>
        </div>
        {can('employees', 'create') && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search employees..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-white placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#8B7355]">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Loading employees...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4C4A8]/30">
                  <th className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">Employee</th>
                  <th className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">Role</th>
                  <th className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[#D4C4A8]/20 hover:bg-[#EDE5D8]/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3" onClick={() => setSelectedEmployee(emp)}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {emp.avatar}
                        </div>
                        <span className="text-sm font-medium text-white">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B7355] capitalize">{emp.role}</td>
                    <td className="px-4 py-3 text-sm text-[#8B7355]">{emp.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-xs px-2.5 py-1 rounded-full font-medium',
                        emp.status === 'Active' ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : 'bg-[#C9A84C]/20 text-[#C9A84C]'
                      )}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {can('employees', 'edit') && (
                          <button onClick={() => openEdit(emp)} className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#6B4E3D]/20 flex items-center justify-center text-[#8B7355] hover:text-[#6B4E3D] transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {can('employees', 'delete') && (
                          <button onClick={() => deleteMutation.mutate(emp.id)} className="w-7 h-7 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#C75B39]/20 flex items-center justify-center text-[#8B7355] hover:text-[#C75B39] transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
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
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{editing ? 'Edit Employee' : 'Add Employee'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                    <option className="bg-[#111827]" value="employee">Cashier / Employee</option>
                    <option className="bg-[#111827]" value="kitchen">Kitchen Staff</option>
                    <option className="bg-[#111827]" value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                    <option className="bg-[#111827]">Active</option>
                    <option className="bg-[#111827]">Inactive</option>
                  </select>
                </div>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editing ? 'Update Employee' : 'Add Employee'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmployee && (
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
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setSelectedEmployee(null)} className="flex items-center gap-2 text-[#8B7355] hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <button onClick={() => setSelectedEmployee(null)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-2xl">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white text-capitalize">{selectedEmployee.name}</h2>
                  <p className="text-sm text-[#8B7355] capitalize">{selectedEmployee.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#EDE5D8]/30 text-center col-span-2">
                  <UserCheck className="w-5 h-5 text-[#8B7355] mx-auto mb-2" />
                  <p className="text-xl font-bold text-white">{selectedEmployee.status}</p>
                  <p className="text-xs text-[#8B7355]">Current Status</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
