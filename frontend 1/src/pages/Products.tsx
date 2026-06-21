import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermission';

interface Product {
  id: string; // mapped from productId
  name: string;
  description: string;
  price: number;
  category: string; // mapped from categoryId
  categoryName: string;
  image: string;
  stock: number;
  available: boolean; // mapped from active
}

interface Category {
  id: string; // mapped from categoryId
  name: string;
  color?: string;
}

export function Products() {
  const { can } = usePermission();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', available: true, image: ''
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.map((c: any) => ({
        id: c.categoryId.toString(),
        name: c.name,
        color: c.color,
      })) as Category[];
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data.map((p: any) => ({
        id: p.productId.toString(),
        name: p.name,
        description: p.description || '',
        price: p.price,
        category: p.categoryId.toString(),
        categoryName: p.categoryName || '',
        image: p.image || 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
        stock: p.stock || 0,
        available: p.active,
      })) as Product[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const res = await api.post('/products', newProduct);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added');
      setShowModal(false);
    },
    onError: () => toast.error('Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated');
      setShowModal(false);
    },
    onError: () => toast.error('Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ 
      name: '', 
      description: '', 
      price: '', 
      category: categories.length > 0 ? categories[0].id : '', 
      stock: '0', 
      available: true,
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
    });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      available: product.available,
      image: product.image,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      categoryId: parseInt(form.category),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      active: form.available,
      image: form.image || 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  if (isLoading || categoriesLoading) {
    return <div className="p-8 text-center text-[#8B7355]">Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1E14]">Products</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Manage your menu items</p>
        </div>
        {can('products', 'create') && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white border border-[#D4C4A8]/30 overflow-hidden group hover:border-[#D4C4A8]/40 transition-all"
          >
            <div className="aspect-video overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {can('products', 'edit') && (
                  <button onClick={() => openEdit(product)} className="w-7 h-7 rounded-lg bg-[#2C1E14]/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#6B4E3D]/80 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {can('products', 'delete') && (
                  <button onClick={() => deleteProduct(product.id)} className="w-7 h-7 rounded-lg bg-[#2C1E14]/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#C75B39]/80 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className={cn(
                'absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium',
                product.available ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : 'bg-[#C75B39]/20 text-[#C75B39]'
              )}>
                {product.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[#2C1E14]">{product.name}</h3>
                  <p className="text-xs text-[#8B7355] mt-0.5">{getCategoryName(product.category)}</p>
                </div>
                <p className="text-lg font-bold text-[#6B4E3D]">₹{product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[#8B7355]">Stock: {product.stock}</span>
                <div className="h-1.5 w-20 rounded-full bg-[#EDE5D8]/40 overflow-hidden">
                  <div className="h-full rounded-full bg-[#6B4E3D]" style={{ width: `${Math.min(100, (product.stock / 80) * 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
                <h3 className="text-lg font-bold text-[#2C1E14]">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Product Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} className="w-full px-3 py-2 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Price</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#8B7355] mb-1">Stock</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B7355] mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 border border-[#D4C4A8]/30 text-[#2C1E14] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white/60">{c.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 rounded accent-[#6B4E3D]" />
                  <span className="text-sm text-[#2C1E14]">Available</span>
                </label>
                <button type="submit" className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
