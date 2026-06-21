import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, Trash2, Tag, CreditCard, Banknote, Smartphone, Wallet, Receipt, X, Check, ShoppingCart, ChevronRight, ChevronLeft, Table2, Star, Heart, Megaphone, Coffee } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DbCategory {
  categoryId: number;
  name: string;
  image?: string;
}

interface DbProduct {
  productId: number;
  categoryId: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
  active?: boolean;
}

interface DbTable {
  tableId: number;
  name: string;
  tableNumber: string;
  seats: number;
  activeStatus: boolean;
  floorName?: string;
}

interface DbPaymentMethod {
  methodId: number;
  methodName: string;
  enabled: boolean;
  upiId?: string;
}

interface DbCoupon {
  couponId: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  active: boolean;
}

const getPaymentIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('cash')) return Banknote;
  if (n.includes('card')) return CreditCard;
  if (n.includes('upi')) return Smartphone;
  if (n.includes('wallet')) return Wallet;
  return CreditCard;
};

export function POS() {
  const { user } = useAuth();
  const isCustomer = user?.role === 'customer';

  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [tables, setTables] = useState<DbTable[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<DbPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [promoTab, setPromoTab] = useState<'promos' | 'feedback'>('promos');

  // Feedback states
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [selectedFeedbackOrder, setSelectedFeedbackOrder] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<string>('');
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes, tablesRes, methodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/tables'),
          api.get('/payment-methods')
        ]);
        setCategories(catsRes.data);
        setProducts(prodsRes.data.filter((p: DbProduct) => p.active !== false));
        setTables(tablesRes.data.filter((t: DbTable) => t.activeStatus !== false));
        
        const enabledMethods = methodsRes.data.filter((m: DbPaymentMethod) => m.enabled !== false);
        setPaymentMethods(enabledMethods);
        if (enabledMethods.length > 0) {
          setSelectedPayment(enabledMethods[0].methodName.toLowerCase());
        }
      } catch (err) {
        console.error('Failed to fetch initial POS data', err);
        toast.error('Error loading POS items. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.role === 'customer') {
      const dismissed = sessionStorage.getItem('promo_dismissed');
      if (dismissed !== 'true') {
        setShowPromoPopup(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isCustomer && user?.id) {
      api.get(`/orders/customer/${user.id}`)
        .then((res) => {
          const completed = res.data.filter((o: any) => o.status === 'COMPLETED');
          setCustomerOrders(completed);
          if (completed.length > 0) {
            setSelectedFeedbackOrder(completed[0].orderId.toString());
          }
        })
        .catch((err) => console.error('Failed to load customer orders', err));
    }
  }, [isCustomer, user?.id]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedbackOrder) {
      toast.error('Please select an order to review');
      return;
    }
    setSubmittingFeedback(true);
    try {
      await api.post('/feedback', {
        customerId: parseInt(user?.id || '0'),
        orderId: parseInt(selectedFeedbackOrder),
        rating: rating,
        comments: comments,
      });
      toast.success('Thank you for your valuable feedback! ❤️');
      setComments('');
      setRating(5);
      handleDismissPromo();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDismissPromo = () => {
    setShowPromoPopup(false);
    sessionStorage.setItem('promo_dismissed', 'true');
  };

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [appliedCoupon, setAppliedCoupon] = useState<DbCoupon | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DbTable | null>(null);
  const [showTableSelect, setShowTableSelect] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [upiQrBlobUrl, setUpiQrBlobUrl] = useState('');
  const [upiQrLoading, setUpiQrLoading] = useState(false);

  const [productPage, setProductPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  useEffect(() => {
    setProductPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (productPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, productPage]);

  const addToCart = (product: DbProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.productId.toString());
      if (existing) {
        return prev.map((i) => i.productId === product.productId.toString() ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.productId.toString(),
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=200'
      }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.productId === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountType === 'PERCENTAGE'
      ? subtotal * (appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue;
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal + tax - discount);
  const change = selectedPayment === 'cash' && amountReceived ? parseFloat(amountReceived) - total : 0;

  useEffect(() => {
    if (showCheckout && selectedPayment.toLowerCase().includes('upi')) {
      const fetchUpiQr = async () => {
        setUpiQrLoading(true);
        setUpiQrBlobUrl('');
        try {
          const matchedMethod = paymentMethods.find(m => m.methodName.toLowerCase().includes('upi'));
          const upiId = matchedMethod?.upiId || 'tnraj82442-1@oksbi';
          const upiLink = `upi://pay?pa=${upiId}&pn=CafePOS&am=${total.toFixed(2)}&cu=INR`;
          const res = await api.get(`/qr?text=${encodeURIComponent(upiLink)}`, { responseType: 'blob' });
          const url = URL.createObjectURL(res.data);
          setUpiQrBlobUrl(url);
        } catch (err) {
          console.error('Failed to load UPI QR code', err);
        } finally {
          setUpiQrLoading(false);
        }
      };
      fetchUpiQr();
    }
  }, [showCheckout, selectedPayment, total, paymentMethods]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.get(`/coupons/validate/${couponCode.toUpperCase()}`);
      if (res.data && res.data.active !== false) {
        setAppliedCoupon(res.data);
        setShowCouponInput(false);
        setCouponCode('');
        toast.success(`Coupon ${res.data.code} applied!`);
      } else {
        toast.error('Invalid or expired coupon');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Invalid or expired coupon');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const completeCheckout = async () => {
    // Basic validation
    if (selectedPayment === 'cash') {
      const received = parseFloat(amountReceived);
      if (isNaN(received) || received < total) {
        toast.error('Received amount must be greater than or equal to total price');
        return;
      }
    }

    const orderPayload = {
      customerId: isCustomer ? parseInt(user?.id || '0') : undefined,
      tableId: selectedTable ? selectedTable.tableId : 1,
      userId: isCustomer ? 1 : parseInt(user?.id || '1'),
      items: cart.map((item) => ({
        productId: parseInt(item.productId),
        quantity: item.quantity,
      })),
      orderType: isCustomer ? 'QR' : 'OFFLINE'
    };

    try {
      const orderRes = await api.post('/orders', orderPayload);
      const createdOrder = orderRes.data;
      const orderId = createdOrder.orderId;

      // Trigger kitchen notification
      try {
        await api.post(`/kitchen/send/${orderId}`);
      } catch (kitchenErr) {
        console.error('Failed to send order to kitchen', kitchenErr);
      }

      // Find matched payment method
      const matchedMethod = paymentMethods.find(m => m.methodName.toLowerCase() === selectedPayment.toLowerCase());
      const methodId = matchedMethod ? matchedMethod.methodId : 1;

      // Save Payment Transaction
      const paymentPayload = {
        orderId: orderId,
        methodId: methodId,
        amount: total,
        transactionRef: `TXN-${Date.now()}`,
        paymentStatus: 'SUCCESS'
      };
      await api.post('/payments', paymentPayload);

      setCheckoutComplete(true);

      setTimeout(() => {
        setCart([]);
        setAppliedCoupon(null);
        setShowCheckout(false);
        setCheckoutComplete(false);
        setAmountReceived('');
        setSelectedTable(null);
        toast.success('Payment confirmed and order placed!');

        if (isCustomer) {
          // Pre-populate feedback states and open feedback tab immediately
          setCustomerOrders((prev) => [
            {
              orderId,
              orderNumber: createdOrder.orderNumber || `ORD-${orderId}`,
              totalAmount: total,
            },
            ...prev,
          ]);
          setSelectedFeedbackOrder(orderId.toString());
          setPromoTab('feedback');
          setShowPromoPopup(true);
        }
      }, 2000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to complete checkout');
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-112px)] flex items-center justify-center text-[#8B7355] dark:text-[#A08A75]">
        <div className="flex flex-col items-center gap-2">
          <Coffee className="w-10 h-10 animate-bounce text-[#6B4E3D]" />
          <p className="text-sm font-semibold">Loading POS system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col md:flex-row gap-4">
      {/* Products Section */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20 text-sm transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowTableSelect(true)} className="flex items-center gap-2 px-3 h-10 rounded-xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-sm text-[#6B4E3D] dark:text-[#C75B39] hover:bg-[#6B4E3D]/10 transition-colors">
              <Table2 className="w-4 h-4" />
              {selectedTable ? selectedTable.tableNumber : 'Select Table'}
            </button>
            {isCustomer && (
              <button
                onClick={() => { setPromoTab('promos'); setShowPromoPopup(true); }}
                className="flex items-center gap-2 px-3 h-10 rounded-xl bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/90 transition-all shadow-sm shrink-0"
              >
                <Megaphone className="w-4 h-4 text-white" />
                Offers & Reviews
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 shrink-0">
          <button onClick={() => setSelectedCategory(null)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', selectedCategory === null ? 'bg-[#6B4E3D] text-white animate-pulse' : 'bg-white/60 dark:bg-[#2C1E14]/60 text-[#8B7355] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]')}>All</button>
          {categories.map((cat) => (
            <button key={cat.categoryId} onClick={() => setSelectedCategory(cat.categoryId)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', selectedCategory === cat.categoryId ? 'bg-[#6B4E3D] text-white animate-pulse' : 'bg-white/60 dark:bg-[#2C1E14]/60 text-[#8B7355] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]')}>{cat.name}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#8B7355] dark:text-[#A08A75]">
              <p className="text-sm font-medium">No products found matching filters.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {paginatedProducts.map((product, i) => (
                  <motion.button key={product.productId} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03, duration: 0.2 }} onClick={() => addToCart(product)} className="group relative rounded-xl bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 overflow-hidden hover:border-[#6B4E3D]/30 transition-all text-left shadow-sm flex flex-col h-full">
                    <div className="aspect-square overflow-hidden bg-[#D4C4A8]/10 shrink-0">
                      <img src={product.image || 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-sm font-medium text-[#2C1E14] dark:text-[#F5F0E8] line-clamp-2">{product.name}</p>
                      <p className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-auto pt-1 font-semibold">₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#6B4E3D]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                  <button 
                    onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                    disabled={productPage === 1}
                    className="p-2 rounded-lg bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#6B4E3D] dark:text-[#C75B39] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B4E3D]/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-sm font-medium text-[#8B7355] dark:text-[#A08A75]">
                    <span className="text-[#2C1E14] dark:text-[#F5F0E8]">{productPage}</span>
                    <span>/</span>
                    <span>{totalPages}</span>
                  </div>
                  <button 
                    onClick={() => setProductPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={productPage === totalPages}
                    className="p-2 rounded-lg bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#6B4E3D] dark:text-[#C75B39] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B4E3D]/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-96 flex flex-col bg-white/60 dark:bg-[#2C1E14]/60 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-2xl overflow-hidden shrink-0 shadow-sm transition-colors">
        <div className="p-4 border-b border-[#D4C4A8]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#6B4E3D]" />
              <h3 className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Cart</h3>
            </div>
            <span className="text-sm text-[#8B7355] dark:text-[#A08A75] font-semibold">{cart.length} items</span>
          </div>
          {selectedTable && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[#8B7355] dark:text-[#A08A75]">
              <Table2 className="w-3 h-3" /> Table: {selectedTable.tableNumber} ({selectedTable.floorName || 'Standard'})
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 min-h-[200px]">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-40 text-[#8B7355] dark:text-[#A08A75]">
                <ShoppingCart className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs mt-1">Click products to add</p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div key={item.productId} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-3 p-2 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#4A3428]/30">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C1E14] dark:text-[#F5F0E8] truncate">{item.name}</p>
                    <p className="text-xs text-[#8B7355] dark:text-[#A08A75]">₹{item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 rounded-md bg-[#D4C4A8]/30 dark:bg-[#2C1E14]/30 hover:bg-[#D4C4A8]/50 flex items-center justify-center"><Minus className="w-3 h-3 text-[#2C1E14] dark:text-[#F5F0E8]" /></button>
                    <span className="w-8 text-center text-sm font-medium text-[#2C1E14] dark:text-[#F5F0E8]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 rounded-md bg-[#D4C4A8]/30 dark:bg-[#2C1E14]/30 hover:bg-[#D4C4A8]/50 flex items-center justify-center"><Plus className="w-3 h-3 text-[#2C1E14] dark:text-[#F5F0E8]" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="w-6 h-6 rounded-md hover:bg-red-500/10 flex items-center justify-center text-[#8B7355] hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-[#D4C4A8]/20 dark:border-[#4A3428]/20 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-[#8B7355]" /><span className="text-sm text-[#8B7355] dark:text-[#A08A75]">Coupon</span></div>
            {appliedCoupon ? (
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-[#6B7F59]/20 text-[#6B7F59] font-medium">{appliedCoupon.code}</span>
                <button onClick={() => setAppliedCoupon(null)} className="text-[#C75B39] hover:text-[#C75B39]/80"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <button onClick={() => setShowCouponInput(!showCouponInput)} className="text-sm text-[#6B4E3D] dark:text-[#C75B39] hover:text-opacity-80 font-medium">Add</button>
            )}
          </div>

          <AnimatePresence>
            {showCouponInput && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex gap-2 overflow-hidden">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" className="flex-1 h-8 px-3 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-sm text-[#2C1E14] dark:text-[#F5F0E8] placeholder:text-[#8B7355] focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} />
                <button onClick={applyCoupon} className="px-3 h-8 rounded-lg bg-[#6B4E3D] text-white text-sm font-medium hover:bg-[#6B4E3D]/80 transition-colors">Apply</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5 pt-2 border-t border-[#D4C4A8]/20 dark:border-[#4A3428]/20">
            <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Subtotal</span><span className="text-[#2C1E14] dark:text-[#F5F0E8]">₹{subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Tax (8%)</span><span className="text-[#2C1E14] dark:text-[#F5F0E8]">₹{tax.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Discount</span><span className="text-[#6B7F59]">-₹{discount.toFixed(2)}</span></div>}
            <div className="flex items-center justify-between pt-2 border-t border-[#D4C4A8]/20 dark:border-[#4A3428]/20">
              <span className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">Total</span>
              <span className="font-bold text-xl text-[#6B4E3D] dark:text-[#C75B39] font-display">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {paymentMethods.map((pm) => {
              const Icon = getPaymentIcon(pm.methodName);
              const pmKey = pm.methodName.toLowerCase();
              return (
                <button key={pm.methodId} onClick={() => setSelectedPayment(pmKey)} className={cn('flex flex-col items-center gap-1 py-2 rounded-xl border transition-all', selectedPayment === pmKey ? 'bg-[#6B4E3D]/10 border-[#6B4E3D] text-[#6B4E3D] dark:bg-[#C75B39]/10 dark:border-[#C75B39] dark:text-[#C75B39]' : 'bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border-[#D4C4A8]/20 dark:border-[#4A3428]/20 text-[#8B7355] dark:text-[#A08A75] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]')}>
                  <Icon className="w-5 h-5" /><span className="text-[10px] font-medium truncate w-full text-center px-1">{pm.methodName}</span>
                </button>
              );
            })}
          </div>

          <button onClick={handleCheckout} disabled={cart.length === 0} className={cn('w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm', cart.length > 0 ? 'gradient-coffee text-white hover:opacity-90' : 'bg-[#D4C4A8]/30 text-[#8B7355] cursor-not-allowed')}>
            <Receipt className="w-4 h-4" />Checkout<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Selection Modal */}
      <AnimatePresence>
        {showTableSelect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#FDF5ED] dark:bg-[#1A110B] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-2xl w-full max-w-md p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Select Table</h3>
                <button onClick={() => setShowTableSelect(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center"><X className="w-4 h-4 text-[#8B7355]" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {tables.map((t) => (
                  <button key={t.tableId} onClick={() => { setSelectedTable(t); setShowTableSelect(false); }} className={cn('p-3 rounded-xl border text-center transition-all', selectedTable?.tableId === t.tableId ? 'border-[#6B4E3D] bg-[#6B4E3D]/10 text-[#6B4E3D] dark:border-[#C75B39] dark:bg-[#C75B39]/10 dark:text-[#C75B39]' : 'border-[#D4C4A8]/30 bg-white/50 dark:bg-[#2C1E14]/50 text-[#8B7355] dark:text-[#A08A75] hover:border-[#6B4E3D]/30')}>
                    <p className="text-sm font-medium">{t.tableNumber}</p>
                    <p className="text-[10px] text-[#8B7355] dark:text-[#A08A75]">{t.floorName || 'Cafe'} · {t.seats} seats</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#FDF5ED] dark:bg-[#1A110B] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin">
              {checkoutComplete ? (
                <div className="flex flex-col items-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-16 h-16 rounded-full bg-[#6B7F59]/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-[#6B7F59]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display mb-1">Payment Successful!</h3>
                  <p className="text-sm text-[#8B7355] dark:text-[#A08A75]">Order has been processed</p>
                  {change > 0 && <p className="text-sm text-[#6B7F59] mt-2 font-semibold">Change: ₹{change.toFixed(2)}</p>}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display">Checkout</h3>
                    <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center"><X className="w-4 h-4 text-[#8B7355]" /></button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Items</span><span className="text-[#2C1E14] dark:text-[#F5F0E8]">{cart.reduce((s, i) => s + i.quantity, 0)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Subtotal</span><span className="text-[#2C1E14] dark:text-[#F5F0E8]">₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Tax</span><span className="text-[#2C1E14] dark:text-[#F5F0E8]">₹{tax.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Discount</span><span className="text-[#6B7F59]">-₹{discount.toFixed(2)}</span></div>}
                    <div className="flex items-center justify-between pt-2 border-t border-[#D4C4A8]/20 dark:border-[#4A3428]/20">
                      <span className="font-semibold text-[#2C1E14] dark:text-[#F5F0E8]">Total</span>
                      <span className="font-bold text-xl text-[#6B4E3D] dark:text-[#C75B39] font-display">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Payment</span><span className="text-[#2C1E14] dark:text-[#F5F0E8] capitalize">{selectedPayment}</span></div>
                    {selectedTable && <div className="flex items-center justify-between text-sm"><span className="text-[#8B7355] dark:text-[#A08A75]">Table</span><span className="text-[#2C1E14] dark:text-[#F5F0E8]">{selectedTable.tableNumber}</span></div>}
                  </div>

                  {selectedPayment === 'cash' && (
                    <div className="mb-4">
                      <label className="block text-sm text-[#8B7355] dark:text-[#A08A75] mb-1">Amount Received</label>
                      <input type="number" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} placeholder="Enter amount" className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D]" />
                      {change > 0 && <p className="text-sm text-[#6B7F59] mt-1 font-semibold">Change: ₹{change.toFixed(2)}</p>}
                    </div>
                  )}

                  {selectedPayment.toLowerCase().includes('upi') && (
                    <div className="mb-4 p-4 rounded-xl bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/20 dark:border-[#4A3428]/20 text-center">
                      <p className="text-sm text-[#8B7355] dark:text-[#A08A75] mb-2">Scan QR to pay</p>
                      <div className="w-32 h-32 mx-auto bg-white rounded-xl border border-[#D4C4A8]/30 flex items-center justify-center overflow-hidden">
                        {upiQrLoading ? (
                          <div className="text-xs text-[#8B7355]">Generating QR...</div>
                        ) : upiQrBlobUrl ? (
                          <img src={upiQrBlobUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-[10px] text-[#8B7355] px-2">Failed to load QR code</div>
                        )}
                      </div>
                      <p className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-2 font-mono">
                        UPI ID: {paymentMethods.find(m => m.methodName.toLowerCase().includes('upi'))?.upiId || 'tnraj82442-1@oksbi'}
                      </p>
                    </div>
                  )}

                  <button onClick={completeCheckout} className="w-full h-12 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md">
                    <Check className="w-5 h-5" />Confirm Payment
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Welcoming, Promotions & Feedback Modal */}
      <AnimatePresence>
        {showPromoPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FDF5ED] dark:bg-[#1A110B] border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-[#D4C4A8]/20 pb-3 shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display flex items-center gap-2">
                    Welcome to Cafe POS! <span className="animate-bounce">🎉</span>
                  </h3>
                  <p className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-0.5">Explore hot discounts or leave us feedback</p>
                </div>
                <button
                  onClick={handleDismissPromo}
                  className="w-8 h-8 rounded-lg bg-[#EDE5D8]/50 hover:bg-[#D4C4A8]/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setPromoTab('promos')}
                  className={cn(
                    'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5',
                    promoTab === 'promos'
                      ? 'bg-white dark:bg-[#2C1E14] text-[#6B4E3D] dark:text-[#C75B39] shadow-sm'
                      : 'text-[#8B7355] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
                  )}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  Special Offers
                </button>
                <button
                  onClick={() => setPromoTab('feedback')}
                  className={cn(
                    'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5',
                    promoTab === 'feedback'
                      ? 'bg-white dark:bg-[#2C1E14] text-[#6B4E3D] dark:text-[#C75B39] shadow-sm'
                      : 'text-[#8B7355] hover:text-[#2C1E14] dark:hover:text-[#F5F0E8]'
                  )}
                >
                  <Heart className="w-3.5 h-3.5" />
                  Give Feedback
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto pr-1 py-1 scrollbar-thin">
                {promoTab === 'promos' ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#6B4E3D] to-[#8B7355] text-white shadow-md relative overflow-hidden group">
                      <div className="absolute right-0 bottom-0 opacity-10 translate-y-4 translate-x-4 pointer-events-none transition-transform group-hover:scale-110">
                        <Megaphone className="w-32 h-32" />
                      </div>
                      <span className="text-[10px] bg-[#C9A84C] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">NEW</span>
                      <h4 className="text-lg font-bold font-display mt-2">Welcome Discount!</h4>
                      <p className="text-xs text-white/90 mt-1">Get 20% off on your first order using code below.</p>
                      <div className="flex items-center justify-between bg-white/15 rounded-lg p-2 mt-3 backdrop-blur-sm border border-white/10">
                        <code className="text-sm font-bold tracking-wider select-all">WELCOME20</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('WELCOME20');
                            toast.success('Coupon code WELCOME20 copied!');
                          }}
                          className="text-xs bg-white text-[#6B4E3D] px-2.5 py-1 rounded-md font-semibold hover:bg-[#FDF5ED] transition-colors"
                        >
                          Copy Code
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#2C1E14]/40 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 shadow-sm relative overflow-hidden">
                      <span className="text-[10px] bg-[#6B7F59]/20 text-[#6B7F59] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">ACTIVE</span>
                      <h4 className="text-base font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display mt-2">Summer Coffee Festival ☀️</h4>
                      <p className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-1">Buy 2 get 1 free on all cold coffees! Promotion automatically applied during checkout.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#2C1E14]/40 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 shadow-sm relative overflow-hidden">
                      <span className="text-[10px] bg-[#C75B39]/20 text-[#C75B39] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">LIMITED TIME</span>
                      <h4 className="text-base font-bold text-[#2C1E14] dark:text-[#F5F0E8] font-display mt-2">Happy Hour Special 🍰</h4>
                      <p className="text-xs text-[#8B7355] dark:text-[#A08A75] mt-1">Get 50% off on all pastries after 4:00 PM. Treat yourself today!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.length === 0 ? (
                      <div className="text-center py-6 text-[#8B7355] dark:text-[#A08A75]">
                        <Heart className="w-10 h-10 mx-auto opacity-30 mb-2 animate-pulse text-[#C75B39]" />
                        <p className="text-sm font-semibold">No past completed orders found.</p>
                        <p className="text-xs mt-1">Please complete an order to leave feedback for it!</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitFeedback} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] mb-1">Select Order to Review</label>
                          <select
                            value={selectedFeedbackOrder}
                            onChange={(e) => setSelectedFeedbackOrder(e.target.value)}
                            required
                            className="w-full h-10 px-3 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D] bg-transparent"
                          >
                            {customerOrders.map((o) => (
                              <option key={o.orderId} value={o.orderId.toString()} className="bg-[#FDF5ED] dark:bg-[#1A110B]">
                                Order #{o.orderNumber || o.orderId} - ₹{o.totalAmount?.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] mb-1">Rating</label>
                          <div className="flex items-center gap-1.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    'w-7 h-7',
                                    star <= rating
                                      ? 'fill-[#C9A84C] text-[#C9A84C]'
                                      : 'text-[#D4C4A8] dark:text-[#4A3428]'
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#8B7355] dark:text-[#A08A75] mb-1">Your Comments</label>
                          <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Tell us what you loved or how we can improve..."
                            rows={3}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-[#EDE5D8]/30 dark:bg-[#2C1E14]/30 border border-[#D4C4A8]/30 dark:border-[#4A3428]/30 text-[#2C1E14] dark:text-[#F5F0E8] text-sm focus:outline-none focus:ring-1 focus:ring-[#6B4E3D] resize-none placeholder:text-[#8B7355]/60"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingFeedback}
                          className="w-full h-11 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                        >
                          {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
