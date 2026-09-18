import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    formatPrice, 
    toggleWishlist, 
    wishlist, 
    setSelectedProductModal, 
    addToCart
  } = useStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');

  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
  };

  return (
    <div 
      onClick={() => setSelectedProductModal(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EADBCE] hover:border-[#B89772] transition-all duration-300 hover:shadow-luxury-hover flex flex-col cursor-pointer"
    >
      {/* Product Image Stage */}
      <div 
        className="relative aspect-[3/4] bg-[#F7F3ED] overflow-hidden"
        onMouseEnter={() => product.images.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img 
          src={product.images[currentImageIndex] || product.images[0]} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#1F1914] text-[#EADBCE] text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#B89772] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              New Drop
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-[#D95353] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-[#1F1914] hover:bg-white transition-all shadow-md z-10 group/heart"
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform group-hover/heart:scale-125 ${
            isWishlisted ? 'fill-[#D95353] text-[#D95353]' : 'text-[#4A3B32]'
          }`} />
        </button>

        {/* Floating Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#1F1914] hover:bg-[#8E704F] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between space-y-2.5 sm:space-y-3">
        
        <div>
          {/* Rating & Fabric brief */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#8E704F] mb-1">
            <span className="font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] text-gray-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-[#1F1914]">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-[#1F1914] group-hover:text-[#8E704F] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-[#6B5E55] line-clamp-1 mt-0.5">
            {product.shortDesc}
          </p>
        </div>

        {/* Sizes & Colors Preview */}
        <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
          {/* Available Sizes preview */}
          <div className="flex items-center gap-1 flex-wrap">
            {product.sizes.slice(0, 3).map((s) => (
              <span 
                key={s} 
                className="text-[9px] sm:text-[10px] font-semibold text-[#5A483B] bg-[#F4EDE2] px-1.5 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">+{product.sizes.length - 3}</span>
            )}
          </div>

          {/* Color Dots */}
          <div className="flex items-center -space-x-1">
            {product.colors.map((c, i) => (
              <span 
                key={i} 
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Price & Mobile Actions */}
        <div className="pt-2 border-t border-[#EADBCE] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-[#1F1914]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stock <= 4 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#D95353] block">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Mobile direct Add button */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={handleQuickAdd}
              className="p-2 bg-[#1F1914] text-white rounded-lg shadow"
              title="Add to Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

