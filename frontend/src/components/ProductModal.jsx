import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SIZE_CHART } from '../data/products';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  ChevronRight,
  Share2
} from 'lucide-react';

export default function ProductModal() {
  const { 
    selectedProductModal, 
    setSelectedProductModal, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    formatPrice
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setSelectedProductModal(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSelectedProductModal(null)}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-[#FAF8F5] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#EADBCE] z-10 my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md z-20 transition-all"
          aria-label="Close product popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-5 sm:p-7">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-[#EADBCE] shadow-sm">
              <img 
                src={product.images[selectedImage] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              
              {/* Product Badge */}
              <div className="absolute top-3 left-3">
                {product.isBestSeller && (
                  <span className="bg-[#1F1914] text-[#EADBCE] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Bestseller Drop
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx 
                        ? 'border-[#B89772] ring-2 ring-[#B89772]/30 scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8E704F]">
                  Senora Signature • {product.category}
                </span>

                <div className="flex items-center gap-1 text-xs font-semibold bg-[#F1E9DC] px-2.5 py-1 rounded-full text-[#1F1914]">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span>{product.rating}</span>
                  <span className="text-gray-500 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1F1914] mt-1.5 leading-tight">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-[#1F1914]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-[#D95353]/10 text-[#D95353] text-xs font-bold px-2 py-0.5 rounded">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-[#5A483B] mt-2.5 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-[#1F1914] uppercase tracking-wider mb-2">
                  Select Shade: <span className="text-[#8E704F] font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((col) => {
                    const isColSelected = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                          isColSelected 
                            ? 'border-[#B89772] bg-white ring-2 ring-[#B89772]/40 text-[#1F1914]' 
                            : 'border-[#DFCBB5] bg-[#FAF8F5] text-[#5A483B] hover:bg-white'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" 
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector + Size Chart trigger */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#1F1914] uppercase tracking-wider">
                    Select Size
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#8E704F] hover:text-[#1F1914] font-semibold flex items-center gap-1 underline underline-offset-2"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Size Chart' : 'Size Guide & Chart'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 h-11 rounded-xl text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-[#1F1914] text-white border-[#1F1914] shadow-md scale-105' 
                            : 'bg-white text-[#4A3B32] border-[#DFCBB5] hover:border-[#B89772]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Chart Modal / Drawer Expansion */}
              {showSizeGuide && (
                <div className="mt-3 p-3.5 bg-white rounded-xl border border-[#DFCBB5] shadow-inner animate-fade-in">
                  <div className="text-xs font-bold text-[#1F1914] mb-2 uppercase tracking-wider">
                    Standard Body Measurement (Inches)
                  </div>
                  <div className="overflow-x-auto text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-[#8E704F]">
                          <th className="py-1">Size</th>
                          <th className="py-1">Bust</th>
                          <th className="py-1">Waist</th>
                          <th className="py-1">Hips</th>
                          <th className="py-1">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_CHART.map((row) => (
                          <tr key={row.size} className="border-b border-gray-100">
                            <td className="py-1 font-bold text-[#1F1914]">{row.size}</td>
                            <td className="py-1">{row.bust}</td>
                            <td className="py-1">{row.waist}</td>
                            <td className="py-1">{row.hip}</td>
                            <td className="py-1">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-[#1F1914] uppercase tracking-wider">Qty:</span>
                <div className="flex items-center bg-white border border-[#DFCBB5] rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-[#F4EDE2] font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-[#1F1914] min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-[#F4EDE2] font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <span className="text-[11px] text-gray-500">
                  {product.stock <= 4 ? `⚡ Only ${product.stock} pieces left` : '✓ In Stock Ready to Ship'}
                </span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#EADBCE] space-y-2.5">
              
              <div className="flex items-center gap-2.5">
                {/* Standard Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-2xl btn-luxury font-bold text-sm flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add To Bag</span>
                </button>

                {/* Wishlist Toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'bg-white border-[#DFCBB5] text-gray-700 hover:bg-[#F4EDE2]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="p-4 rounded-2xl bg-white border border-[#DFCBB5] text-gray-700 hover:bg-[#F4EDE2] transition-all relative"
                  title="Share link"
                >
                  <Share2 className="w-5 h-5" />
                  {isCopied && (
                    <span className="absolute -top-7 right-0 bg-black text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>

            </div>

            {/* Fabric & Trust Guarantees */}
            <div className="pt-3 border-t border-gray-200 text-[11px] text-[#6B5E55] space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8E704F]" />
                <span><strong>Fabric:</strong> {product.fabric}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8E704F]" />
                <span><strong>Shipping:</strong> {product.delivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#8E704F]" />
                <span><strong>Exchange:</strong> Hassle-free 7-day size exchange guarantee</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
