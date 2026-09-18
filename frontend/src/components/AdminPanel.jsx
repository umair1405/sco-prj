import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  Trash2, 
  Check, 
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function AdminPanel() {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    addProduct, 
    deleteProduct, 
    orders,
    formatPrice 
  } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new product
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'coords',
    price: '',
    originalPrice: '',
    shortDesc: '',
    description: '',
    fabric: 'Premium Satin Silk',
    care: 'Dry clean only',
    delivery: 'Ships in 24-48 Hours',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    sizes: 'XS, S, M, L, XL',
    colors: 'Champagne Gold, Noir Black'
  });

  if (!isAdminOpen) return null;

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const sizesArr = newProd.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = newProd.colors.split(',').map(c => ({
      name: c.trim(),
      hex: '#8E704F'
    })).filter(Boolean);

    const productPayload = {
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || newProd.price * 1.3),
      discount: newProd.originalPrice ? Math.round(((newProd.originalPrice - newProd.price) / newProd.originalPrice) * 100) : 20,
      shortDesc: newProd.shortDesc || newProd.name,
      description: newProd.description || 'Exclusive luxury piece by Senora & Co.',
      fabric: newProd.fabric,
      care: newProd.care,
      delivery: newProd.delivery,
      stock: Number(newProd.stock),
      isNew: true,
      isBestSeller: false,
      sizes: sizesArr.length > 0 ? sizesArr : ['S', 'M', 'L'],
      colors: colorsArr.length > 0 ? colorsArr : [{ name: 'Classic', hex: '#000000' }],
      images: [newProd.imageUrl]
    };

    addProduct(productPayload);
    setShowAddModal(false);
    setNewProd({
      name: '',
      category: 'coords',
      price: '',
      originalPrice: '',
      shortDesc: '',
      description: '',
      fabric: 'Premium Satin Silk',
      care: 'Dry clean only',
      delivery: 'Ships in 24-48 Hours',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      sizes: 'XS, S, M, L, XL',
      colors: 'Champagne Gold, Noir Black'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setIsAdminOpen(false)}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 z-10 my-auto flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#8E704F] uppercase">Boutique Management</span>
            <h2 className="text-xl font-serif-luxury font-bold text-[#1F1914]">
              Senora &amp; Co Admin Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex bg-[#F4EDE2] p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'products' ? 'bg-white text-[#1F1914] shadow-xs' : 'text-gray-600'
                }`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'orders' ? 'bg-white text-[#1F1914] shadow-xs' : 'text-gray-600'
                }`}
              >
                Orders ({orders.length})
              </button>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1F1914]">Product Inventory</h3>
                  <p className="text-xs text-gray-500">Live products visible on the storefront.</p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1914] text-white text-xs font-bold rounded-xl hover:bg-[#8E704F] transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add Product Modal Drawer */}
              {showAddModal && (
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#DFCBB5] space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DFCBB5]">
                    <h4 className="font-serif-luxury font-bold text-base text-[#1F1914]">Add New Catalog Drop</h4>
                    <button onClick={() => setShowAddModal(false)} className="text-xs text-gray-500 hover:text-black">
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Celestial Silk Abaya"
                        value={newProd.name}
                        onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Category</label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({...newProd, category: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      >
                        <option value="coords">Co-ord Sets</option>
                        <option value="modest">Modest &amp; Abayas</option>
                        <option value="dresses">Dresses &amp; Gowns</option>
                        <option value="festive">Festive &amp; Ethnic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Selling Price (INR ₹) *</label>
                      <input 
                        type="number"
                        required
                        placeholder="2999"
                        value={newProd.price}
                        onChange={(e) => setNewProd({...newProd, price: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Original Price (INR ₹)</label>
                      <input 
                        type="number"
                        placeholder="3999"
                        value={newProd.originalPrice}
                        onChange={(e) => setNewProd({...newProd, originalPrice: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                      <input 
                        type="url"
                        placeholder="https://..."
                        value={newProd.imageUrl}
                        onChange={(e) => setNewProd({...newProd, imageUrl: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Available Sizes (comma separated)</label>
                      <input 
                        type="text"
                        placeholder="XS, S, M, L, XL"
                        value={newProd.sizes}
                        onChange={(e) => setNewProd({...newProd, sizes: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stock Count</label>
                      <input 
                        type="number"
                        value={newProd.stock}
                        onChange={(e) => setNewProd({...newProd, stock: e.target.value})}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 border rounded-xl font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#1F1914] text-white rounded-xl font-bold hover:bg-[#8E704F]"
                      >
                        Publish to Store
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Product List Table */}
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#8E704F] border-b border-gray-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3 flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <span className="text-[10px] text-gray-400">ID: {p.id}</span>
                          </div>
                        </td>
                        <td className="p-3 uppercase font-semibold text-gray-600">{p.category}</td>
                        <td className="p-3 font-bold text-gray-900">{formatPrice(p.price)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock <= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#1F1914]">Customer Orders Received</h3>
                <p className="text-xs text-gray-500">Real-time online orders and invoices.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto opacity-50" />
                  <p className="text-xs">No orders placed yet in this session.</p>
                  <p className="text-[11px] text-gray-500">Test the checkout flow on the store to see order entries appear here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.orderId} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#DFCBB5] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#1F1914]">{ord.orderId}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {ord.status}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#8E704F]">{formatPrice(ord.total)}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <strong>Customer:</strong> {ord.customer.name} ({ord.customer.phone})
                        </div>
                        <div>
                          <strong>Address:</strong> {ord.address.city}, {ord.address.pincode}
                        </div>
                        <div>
                          <strong>Payment:</strong> {ord.paymentMethod}
                        </div>
                        <div>
                          <strong>Items:</strong> {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
