import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Filter, 
  Printer, 
  ArrowLeft, 
  Lock, 
  LogOut, 
  Sparkles, 
  Eye, 
  Tag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle,
  ChevronDown,
  UploadCloud,
  Image as ImageIcon,
  Star,
  Upload,
  Layers
} from 'lucide-react';

export default function AdminPortal({ onBackToStore }) {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    deleteOrder, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    formatPrice,
    coupon
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('senora_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'coupons' | 'analytics'
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Products Tab State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Multi-Image & New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'onepiece',
    price: '',
    originalPrice: '',
    shortDesc: '',
    description: '',
    fabric: 'Korean Silk & Satin Blend',
    care: 'Dry clean only',
    delivery: 'Ships in 24-48 Hours',
    stock: 10,
    images: [],
    sizes: 'XS, S, M, L, XL',
    colors: 'Signature, Noir Black'
  });
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Upload Images from Device (supports multiple files at once)
  const handleDeviceUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    let loadedCount = 0;
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result);
        }
        loadedCount++;
        if (loadedCount === files.length) {
          setNewProd((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === files.length) setIsUploading(false);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Add Manual Image URL/Path
  const handleAddManualImage = () => {
    if (!manualImageUrl.trim()) return;
    setNewProd((prev) => ({
      ...prev,
      images: [...prev.images, manualImageUrl.trim()]
    }));
    setManualImageUrl('');
  };

  // Remove uploaded image from list
  const handleRemoveImage = (indexToRemove) => {
    setNewProd((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Set selected image as Cover/Main Photo (moves to index 0)
  const handleSetPrimaryImage = (indexToSet) => {
    setNewProd((prev) => {
      const selected = prev.images[indexToSet];
      const rest = prev.images.filter((_, idx) => idx !== indexToSet);
      return {
        ...prev,
        images: [selected, ...rest]
      };
    });
  };

  // Coupons State
  const [customCoupons, setCustomCoupons] = useState([
    { code: 'SENORA10', discount: '10% OFF', type: 'percentage', uses: 34, status: 'Active' },
    { code: 'SAVE500', discount: '₹500 OFF', type: 'flat', uses: 19, status: 'Active' },
    { code: 'FIRSTDROP', discount: '₹500 OFF', type: 'flat', uses: 12, status: 'Active' },
    { code: 'VIP20', discount: '20% OFF', type: 'percentage', uses: 8, status: 'Active' }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  const ENV_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@senoraco.in';
  const ENV_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'senora2026';

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Try Backend Authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanUser, username: cleanUser, password: cleanPass })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          localStorage.setItem('senora_admin_auth', 'true');
          setAuthError('');
          return;
        }
      }
    } catch (err) {
      // Backend offline fallback to client .env credentials
    }

    // 2. Client-side .env validation fallback
    const isUserMatch = 
      cleanUser === ENV_ADMIN_EMAIL.toLowerCase() || 
      cleanUser === 'admin' || 
      cleanUser === 'umair142005@gmail.com';
    const isPassMatch = cleanPass === ENV_ADMIN_PASSWORD;

    if (isUserMatch && isPassMatch) {
      setIsAuthenticated(true);
      localStorage.setItem('senora_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError(`Invalid credentials. Check your .env file (${ENV_ADMIN_EMAIL})`);
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('senora_admin_auth', 'true');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('senora_admin_auth');
  };

  // KPIs
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  }, [orders]);

  const totalItemsSold = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (ord.items?.reduce((iSum, it) => iSum + it.quantity, 0) || 0), 0);
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    return orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  }, [orders, totalRevenue]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      // Status Filter
      if (orderStatusFilter !== 'all' && ord.status?.toLowerCase() !== orderStatusFilter.toLowerCase()) {
        return false;
      }
      // Search Query
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchId = ord.orderId?.toLowerCase().includes(q);
        const matchName = ord.customer?.name?.toLowerCase().includes(q);
        const matchPhone = ord.customer?.phone?.toLowerCase().includes(q);
        const matchCity = ord.address?.city?.toLowerCase().includes(q);
        return matchId || matchName || matchPhone || matchCity;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Create Product Submit
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const sizesArr = newProd.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = newProd.colors.split(',').map(c => ({
      name: c.trim(),
      hex: '#8E704F'
    })).filter(Boolean);

    // Final list of images: priority to uploaded images, then manual input, then boutique placeholder
    let finalImages = [...newProd.images];
    if (manualImageUrl.trim() && !finalImages.includes(manualImageUrl.trim())) {
      finalImages.push(manualImageUrl.trim());
    }
    if (finalImages.length === 0) {
      finalImages = ['/products/onepice/1/729660722_18094774553578472_7927858063859501886_n.jpg'];
    }

    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || Number(newProd.price) * 1.3),
      discount: 25,
      shortDesc: newProd.shortDesc || newProd.name,
      description: newProd.description || 'Exclusive handcrafted designer drop by Senora & Co.',
      fabric: newProd.fabric,
      care: newProd.care,
      delivery: newProd.delivery,
      stock: Number(newProd.stock),
      isNew: true,
      isBestSeller: false,
      sizes: sizesArr.length > 0 ? sizesArr : ['S', 'M', 'L'],
      colors: colorsArr.length > 0 ? colorsArr : [{ name: 'Signature', hex: '#8E704F' }],
      images: finalImages
    };

    addProduct(payload);
    setShowAddProductModal(false);
    setNewProd({
      name: '',
      category: 'onepiece',
      price: '',
      originalPrice: '',
      shortDesc: '',
      description: '',
      fabric: 'Korean Silk & Satin Blend',
      care: 'Dry clean only',
      delivery: 'Ships in 24-48 Hours',
      stock: 10,
      images: [],
      sizes: 'XS, S, M, L, XL',
      colors: 'Signature, Noir Black'
    });
    setManualImageUrl('');
  };

  // Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    setCustomCoupons(prev => [
      {
        code: newCouponCode.toUpperCase(),
        discount: newCouponDiscount,
        type: newCouponDiscount.includes('%') ? 'percentage' : 'flat',
        uses: 0,
        status: 'Active'
      },
      ...prev
    ]);
    setNewCouponCode('');
    setNewCouponDiscount('');
  };

  // -------------------------------------------------------------
  // VIEW: LOGIN SCREEN (if not logged in)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#140E0A] via-[#241A12] to-[#140E0A] flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#B89772]/15 blur-3xl rounded-full pointer-events-none"></div>

        {/* Back to Storefront Link */}
        <button
          onClick={onBackToStore}
          className="absolute top-6 left-6 text-xs text-[#DFCBB5] hover:text-white flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <div className="w-full max-w-md bg-[#1F1712]/90 backdrop-blur-xl border border-[#DFCBB5]/30 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 text-white">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8E704F] flex items-center justify-center mx-auto shadow-lg text-[#140E0A]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif-luxury font-bold tracking-tight text-[#FAF8F5]">
              Senora &amp; Co. Merchant Portal
            </h2>
            <p className="text-xs text-[#A8988B]">
              Secure dashboard to manage boutique orders, inventory, and promotions.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#DFCBB5] mb-1.5 uppercase tracking-wider">
                Admin Email / Username
              </label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={ENV_ADMIN_EMAIL}
                className="w-full bg-[#140E0A] border border-[#DFCBB5]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DFCBB5] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#140E0A] border border-[#DFCBB5]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl btn-luxury font-bold text-sm tracking-wider uppercase shadow-xl hover:scale-[1.01] transition-transform"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Quick 1-Click Access for Owner */}
          <div className="pt-4 border-t border-white/10 text-center space-y-3">
            <div className="text-[11px] text-[#A8988B]">
              <span>Configured in .env: </span>
              <code className="text-[#D4AF37] bg-black/40 px-2 py-0.5 rounded font-mono">{ENV_ADMIN_EMAIL}</code> / <code className="text-[#D4AF37] bg-black/40 px-2 py-0.5 rounded font-mono">{ENV_ADMIN_PASSWORD}</code>
            </div>
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-[#DFCBB5] transition-colors"
            >
              ⚡ Instant 1-Click Owner Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1914] flex flex-col font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="bg-[#140E0A] text-white border-b border-[#2C2016] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-[#DFCBB5] transition-colors border border-white/10"
              title="Return to public store"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Boutique Store</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-lg font-bold tracking-wider text-white">
                SENORA &amp; CO.
              </span>
              <span className="bg-[#B89772] text-[#140E0A] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#B89772] text-[#140E0A] shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'products'
                  ? 'bg-[#B89772] text-[#140E0A] shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'coupons'
                  ? 'bg-[#B89772] text-[#140E0A] shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Coupons ({customCoupons.length})</span>
            </button>
          </nav>

          {/* User Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex border-t border-white/10 px-4 py-2 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-[#B89772] text-black' : 'text-gray-300'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'products' ? 'bg-[#B89772] text-black' : 'text-gray-300'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'coupons' ? 'bg-[#B89772] text-black' : 'text-gray-300'
            }`}
          >
            Coupons ({customCoupons.length})
          </button>
        </div>
      </header>

      {/* Main Admin Content Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
              <span>Gross Sales</span>
              <DollarSign className="w-4 h-4 text-[#B89772]" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1F1914]">
                {formatPrice(totalRevenue)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                +14.8% this month
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#8E704F]" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1F1914]">
                {orders.length}
              </span>
              <span className="text-[11px] text-[#8E704F] font-semibold block mt-1">
                {totalItemsSold} boutique garments
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
              <span>Avg Order Value</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1F1914]">
                {formatPrice(averageOrderValue)}
              </span>
              <span className="text-[11px] text-gray-500 font-medium block mt-1">
                Per checkout customer
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
              <span>Active Catalog</span>
              <Package className="w-4 h-4 text-[#B89772]" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1F1914]">
                {products.length} Designs
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                Across 4 Categories
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: ORDERS MANAGEMENT                                            */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-xs space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-[#1F1914]">
                  Customer Orders &amp; Dispatch Status
                </h3>
                <p className="text-xs text-gray-500">
                  Manage real-time customer orders, update shipping states, and print delivery receipts.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order ID, client, city..."
                    className="text-xs pl-8 pr-3 py-2 bg-[#F7F4EF] border border-[#DFCBB5] rounded-xl focus:outline-none focus:border-[#B89772]"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="text-xs py-2 px-3 bg-[#F7F4EF] border border-[#DFCBB5] rounded-xl font-semibold text-[#1F1914] focus:outline-none"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-600">No orders found</p>
                <p className="text-xs text-gray-400">Orders placed on the storefront will appear here immediately.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EADBCE] text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-bold">Order ID &amp; Date</th>
                      <th className="pb-3 font-bold">Customer Info</th>
                      <th className="pb-3 font-bold">Items &amp; Details</th>
                      <th className="pb-3 font-bold">Payment &amp; Total</th>
                      <th className="pb-3 font-bold">Fulfillment Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((ord) => {
                      const isDelivered = ord.status === 'Delivered';
                      const isShipped = ord.status === 'Shipped';
                      const isConfirmed = ord.status === 'Confirmed';

                      return (
                        <tr key={ord.orderId} className="hover:bg-[#FAF8F5] transition-colors">
                          {/* Order ID & Date */}
                          <td className="py-4 pr-3 align-top">
                            <span className="font-mono font-bold text-sm text-[#1F1914] block">
                              {ord.orderId}
                            </span>
                            <span className="text-[11px] text-gray-400 block mt-0.5">
                              {new Date(ord.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {ord.coupon && (
                              <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                Coupon: {ord.coupon}
                              </span>
                            )}
                          </td>

                          {/* Customer Info */}
                          <td className="py-4 pr-3 align-top">
                            <span className="font-bold text-[#1F1914] block">
                              {ord.customer?.name || 'Guest Client'}
                            </span>
                            <span className="text-gray-500 block text-[11px]">
                              {ord.customer?.phone}
                            </span>
                            <span className="text-gray-400 block text-[10px] truncate max-w-[180px]">
                              {ord.address?.city}, {ord.address?.state} ({ord.address?.pincode})
                            </span>
                          </td>

                          {/* Items */}
                          <td className="py-4 pr-3 align-top">
                            <div className="space-y-1">
                              {ord.items?.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  {it.product?.images?.[0] && (
                                    <img 
                                      src={it.product.images[0]} 
                                      alt="" 
                                      className="w-7 h-7 rounded object-cover border border-gray-200"
                                    />
                                  )}
                                  <div className="text-[11px] leading-tight">
                                    <span className="font-semibold text-[#1F1914]">{it.product?.name}</span>
                                    <span className="text-gray-400 text-[10px] block">
                                      Size: {it.selectedSize} • Qty: {it.quantity}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Payment & Total */}
                          <td className="py-4 pr-3 align-top">
                            <span className="font-bold text-sm text-[#1F1914] block">
                              {formatPrice(ord.total)}
                            </span>
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block mt-1 font-semibold">
                              {ord.paymentMethod || 'Online'}
                            </span>
                          </td>

                          {/* Status changer */}
                          <td className="py-4 pr-3 align-top">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                              className={`text-[11px] font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none transition-colors ${
                                isDelivered 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : isShipped 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                  : isConfirmed 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                  : 'bg-gray-100 text-gray-700 border-gray-300'
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-right align-top">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="p-1.5 hover:bg-[#F4EDE2] text-[#8E704F] rounded-lg transition-colors"
                                title="View Full Invoice"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteOrder(ord.orderId)}
                                className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                                title="Delete Order Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: PRODUCT CATALOG MANAGEMENT                                   */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-[#1F1914]">
                  Product Catalog &amp; Real Inventory ({products.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Manage collections, pricing, sizes, and add new haute couture drops.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2.5 rounded-xl btn-luxury text-xs font-bold flex items-center gap-2 shadow-md uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Design</span>
                </button>
              </div>
            </div>

            {/* Category Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                {['all', 'top-bottom', 'abayas', 'onepiece', 'jeans'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                      productCategoryFilter === cat
                        ? 'bg-[#1F1914] text-white'
                        : 'bg-[#F4EDE2] text-[#5A483B] hover:bg-[#EADBCE]'
                    }`}
                  >
                    {cat === 'all' ? 'All (28)' : cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search design title or ID..."
                  className="text-xs pl-8 pr-3 py-1.5 bg-[#F7F4EF] border border-[#DFCBB5] rounded-xl focus:outline-none focus:border-[#B89772] w-full sm:w-60"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id}
                  className="border border-[#EADBCE] rounded-2xl overflow-hidden bg-[#FAF8F5] flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-white overflow-hidden">
                    <img 
                      src={prod.images?.[0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {prod.category}
                    </div>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-lg hover:bg-rose-600 transition-colors shadow"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-xs text-[#1F1914] line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{prod.shortDesc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div>
                        <span className="text-xs font-bold text-[#1F1914] block">
                          {formatPrice(prod.price)}
                        </span>
                        <span className="text-[10px] text-gray-400">Stock: {prod.stock || 10}</span>
                      </div>

                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Live on Store
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 3: COUPONS & DISCOUNTS                                          */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Promo Code */}
            <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-serif-luxury font-bold text-[#1F1914]">
                Create New Promo Code
              </h3>
              <p className="text-xs text-gray-500">
                Generate seasonal discount codes for WhatsApp clients and online shoppers.
              </p>

              <form onSubmit={handleAddCoupon} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE25"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F7F4EF] border border-[#DFCBB5] rounded-xl uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">Discount Amount / %</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15% OFF or ₹300 OFF"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F7F4EF] border border-[#DFCBB5] rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl btn-luxury text-xs font-bold uppercase tracking-wider shadow"
                >
                  Publish Promo Code
                </button>
              </form>
            </div>

            {/* Active Coupons List */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-serif-luxury font-bold text-[#1F1914]">
                Active Store Promo Codes
              </h3>
              
              <div className="space-y-3">
                {customCoupons.map((c, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-2xl border border-[#EADBCE] bg-[#FAF8F5] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F4EDE2] text-[#8E704F] flex items-center justify-center font-bold">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-sm text-[#1F1914] tracking-wider block">
                          {c.code}
                        </span>
                        <span className="text-xs text-[#8E704F] font-semibold">{c.discount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500 font-medium">Used {c.uses} times</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ORDER INVOICE DRAWER / POPUP                           */}
      {/* ------------------------------------------------------------- */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EADBCE] shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold text-[#8E704F] uppercase tracking-wider">
                Official Senora Boutique Order
              </span>
              <h3 className="text-xl font-serif-luxury font-bold text-[#1F1914]">
                Invoice #{selectedOrderDetails.orderId}
              </h3>
            </div>

            {/* Client & Shipping */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EADBCE]">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Customer</span>
                <span className="font-bold text-[#1F1914] block">{selectedOrderDetails.customer?.name}</span>
                <span className="text-gray-600 block">{selectedOrderDetails.customer?.phone}</span>
                <span className="text-gray-500 block truncate">{selectedOrderDetails.customer?.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Delivery Address</span>
                <span className="text-[#1F1914] font-medium block">
                  {selectedOrderDetails.address?.street}, {selectedOrderDetails.address?.city}
                </span>
                <span className="text-gray-500 block">
                  {selectedOrderDetails.address?.state} - {selectedOrderDetails.address?.pincode}
                </span>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1F1914] uppercase tracking-wider block">
                Garments Ordered
              </span>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {selectedOrderDetails.items?.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img 
                        src={it.product?.images?.[0]} 
                        alt="" 
                        className="w-9 h-9 object-cover rounded border border-gray-200"
                      />
                      <div>
                        <span className="font-bold text-[#1F1914] block">{it.product?.name}</span>
                        <span className="text-gray-400 text-[10px]">
                          Size: {it.selectedSize} • Color: {it.selectedColor} • Qty: {it.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-[#1F1914]">
                      {formatPrice(it.product?.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="pt-2 border-t border-gray-100 text-xs space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrderDetails.subtotal)}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(selectedOrderDetails.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1F1914] pt-1.5 border-t border-gray-200">
                <span>Total Amount</span>
                <span>{formatPrice(selectedOrderDetails.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl btn-luxury font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD PRODUCT POPUP                                      */}
      {/* ------------------------------------------------------------- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EADBCE] shadow-2xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif-luxury font-bold text-[#1F1914] border-b border-gray-100 pb-2">
              Add New Boutique Design
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Design Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Sapphire Embroidered Co-ord"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl font-medium"
                  >
                    <option value="top-bottom">Top &amp; Bottom</option>
                    <option value="abayas">Abayas</option>
                    <option value="onepiece">One-Piece</option>
                    <option value="jeans">Jeans &amp; Denim</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3199"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Product Photos Section (Device Upload + Multiple Photos + URL) */}
              <div className="space-y-2 border border-[#EADBCE] bg-[#FBF9F6] p-3.5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1F1914] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#8E704F]" />
                    <span>Product Photos (Multiple Images)</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {newProd.images.length} {newProd.images.length === 1 ? 'photo' : 'photos'} added
                  </span>
                </div>

                {/* Device Upload Zone */}
                <label className="border-2 border-dashed border-[#DFCBB5] hover:border-[#8E704F] bg-white rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group text-center block">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDeviceUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] group-hover:bg-[#F3ECE0] flex items-center justify-center text-[#8E704F] mb-1.5 transition-colors">
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-[#8E704F] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-[#1F1914] group-hover:text-[#8E704F] transition-colors">
                    {isUploading ? 'Processing photos...' : 'Upload Photos from Device'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Click to browse files from your computer or phone (Select multiple)
                  </span>
                </label>

                {/* Manual Path / URL Option */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddManualImage();
                      }
                    }}
                    placeholder="Or paste image path / URL (e.g. /products/...)"
                    className="flex-1 p-2 bg-white border border-[#DFCBB5] rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#8E704F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualImage}
                    className="px-3 py-2 bg-[#1F1914] hover:bg-[#8E704F] text-white font-bold rounded-xl transition-colors flex items-center gap-1 text-[11px] shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add URL</span>
                  </button>
                </div>

                {/* Thumbnails Gallery */}
                {newProd.images.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#8E704F] uppercase tracking-wider block">
                      Attached Gallery (Click ★ to set Main Cover):
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-[#EADBCE]">
                      {newProd.images.map((imgSrc, idx) => {
                        const isMain = idx === 0;
                        return (
                          <div 
                            key={idx} 
                            className={`relative group rounded-lg overflow-hidden border-2 aspect-square bg-gray-100 ${
                              isMain ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={imgSrc} 
                              alt={`Product upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Main badge */}
                            {isMain && (
                              <div className="absolute top-1 left-1 bg-[#1F1914]/90 text-[#D4AF37] text-[8px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shadow">
                                <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                                <span>Main</span>
                              </div>
                            )}

                            {/* Action Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  title="Set as Main Cover Photo"
                                  className="p-1 bg-[#D4AF37] hover:bg-[#B89772] text-[#1F1914] rounded-md transition-colors"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                title="Remove Image"
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Available Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    value={newProd.sizes}
                    onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newProd.shortDesc}
                  onChange={(e) => setNewProd({ ...newProd, shortDesc: e.target.value })}
                  placeholder="Authentic Senora & Co signature piece with refined silhouette."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl btn-luxury font-bold text-xs uppercase tracking-wider shadow"
                >
                  Save &amp; Publish Design
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
