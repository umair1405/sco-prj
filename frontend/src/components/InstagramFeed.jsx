import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Heart, 
  MessageCircle, 
  ShoppingBag, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ChevronDown,
  Eye
} from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function InstagramFeed() {
  const { products, setSelectedProductModal, formatPrice } = useStore();

  const [lookbookFilter, setLookbookFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);

  // Filter products for lookbook
  const filteredLooks = useMemo(() => {
    if (lookbookFilter === 'all') return products;
    return products.filter(p => p.category === lookbookFilter);
  }, [products, lookbookFilter]);

  const displayedLooks = filteredLooks.slice(0, visibleCount);

  const filterTabs = [
    { id: 'all', label: 'All Looks' },
    { id: 'top-bottom', label: 'Top & Bottom' },
    { id: 'abayas', label: 'Abayas' },
    { id: 'onepiece', label: 'One-Piece' },
    { id: 'jeans', label: 'Jeans' },
  ];

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#8E704F] text-xs font-bold tracking-[0.25em] uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Exclusive Boutique Edits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1F1914]">
              Signature Lookbook &amp; New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
              Explore handcrafted co-ords, luxury abayas, one-piece gowns &amp; denim with live rates and 1-click ordering
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('collection-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white border border-[#DFCBB5] text-[#1F1914] hover:bg-[#1F1914] hover:text-white transition-all shadow-sm flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-[#8E704F]" />
            <span>Explore All Designs</span>
          </button>
        </div>

        {/* Filter Pills for Lookbook */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6">
          {filterTabs.map((tab) => {
            const isActive = lookbookFilter === tab.id;
            const count = tab.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setLookbookFilter(tab.id);
                  setVisibleCount(8);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1F1914] text-white shadow-md'
                    : 'bg-white text-[#5A483B] border border-[#DFCBB5] hover:bg-[#F4EDE2]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#382C22] text-[#EADBCE]' : 'bg-[#F4EDE2] text-[#8E704F]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lookbook Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedLooks.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductModal(product)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#EADBCE] hover:border-[#B89772] transition-all duration-300 hover:shadow-luxury-hover flex flex-col cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Top Brand Tag Pill */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/60 backdrop-blur-md text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold flex items-center gap-1 sm:gap-1.5 z-10 shadow">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
                  <span>Senora Edit</span>
                </div>

                {/* Multiple Images Indicator Badge */}
                {product.images.length > 1 && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full z-10 shadow">
                    +{product.images.length}
                  </div>
                )}

                {/* Hover Shoppable Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-3 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductModal(product);
                    }}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-[#1F1914] text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>View Look</span>
                  </button>
                </div>
              </div>

              {/* Product Info & Rate Section */}
              <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-2.5 sm:space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                    <span className="font-bold text-[#8E704F] uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-[#FAF8F5] border border-[#DFCBB5] text-gray-600 px-1.5 sm:px-2 py-0.5 rounded font-semibold truncate max-w-[80px]">
                      {product.sizes.slice(0, 2).join(', ')}
                    </span>
                  </div>

                  <h3 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#1F1914] group-hover:text-[#8E704F] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#6B5E55] line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed">
                    {product.shortDesc || product.description}
                  </p>
                </div>

                {/* Rate & Buy Actions */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-semibold block">Rate</span>
                    <div className="flex items-baseline gap-1 sm:gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-[#1F1914]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductModal(product);
                    }}
                    className="p-1.5 sm:p-2 bg-[#1F1914] hover:bg-[#8E704F] text-white rounded-lg sm:rounded-xl shadow transition-colors flex items-center gap-1 text-[10px] sm:text-xs font-semibold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredLooks.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-[#DFCBB5] hover:border-[#1F1914] text-[#1F1914] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all group"
            >
              <span>Explore More Looks ({filteredLooks.length - visibleCount} more)</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
