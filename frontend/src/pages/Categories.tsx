import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, FolderTree, Check, Coffee } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Category {
  categoryId: number;
  name: string;
  image: string;
  productCount?: number;
}

export function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', image: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [catsRes, prodsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products')
      ]);

      const cats = catsRes.data;
      const prods = prodsRes.data;

      const mapped = cats.map((c: any) => {
        const count = prods.filter((p: any) => p.categoryId === c.categoryId).length;
        return {
          ...c,
          productCount: count
        };
      });

      setItems(mapped);
    } catch (err) {
      console.error('Failed to load categories', err);
      toast.error('Failed to fetch categories from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', image: '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, image: cat.image || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing.categoryId}`, {
          name: form.name,
          image: form.image
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', {
          name: form.name,
          image: form.image
        });
        toast.success('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category? All associated products may be affected.')) {
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Categories</h1>
          <p className="text-sm text-[#8B7355] dark:text-[#A08A75] mt-0.5 font-medium">Organize and manage your cafe menu sections</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4E3D] hover:bg-[#6B4E3D]/95 text-white text-sm font-semibold hover:opacity-95 transition-all shadow-md">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#8B7355] dark:text-[#A08A75] font-medium flex flex-col items-center justify-center gap-2">
          <Coffee className="w-8 h-8 animate-bounce text-[#6B4E3D]" />
          <span>Loading categories...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D4C4A8] dark:border-[#4A3428]/30 bg-white/30 dark:bg-[#2C1E14]/20 py-16 text-center text-[#8B7355] dark:text-[#A08A75]">
          <FolderTree className="w-12 h-12 mx-auto opacity-30 mb-2" />
          <p className="text-sm font-semibold">No menu categories found. Get started by adding one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((cat, i) => (
            <motion.div
              key={cat.categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl bg-white dark:bg-[#2C1E14] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 overflow-hidden hover:border-[#6B4E3D]/40 dark:hover:border-[#C75B39]/40 transition-all shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-[#EDE5D8]/20">
                <img
                  src={cat.image || 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=200'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E14]/90 via-[#2C1E14]/20 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg bg-[#2C1E14]/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#6B4E3D] transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCategory(cat.categoryId)} className="w-8 h-8 rounded-lg bg-[#2C1E14]/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#C75B39] transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white font-display">{cat.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-white/80">
                    <FolderTree className="w-4 h-4 text-[#D4C4A8]" />
                    <span className="text-xs font-semibold">{cat.productCount || 0} Products</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
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
              className="bg-[#FDF5ED] dark:bg-[#1A110B] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">{editing ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] mb-1">Category Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Cold Brews"
                    className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.pexels.com/..."
                    className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20"
                  />
                </div>
                <button type="submit" className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md mt-6">
                  <Check className="w-4 h-4" />
                  {editing ? 'Update Category' : 'Save Category'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
