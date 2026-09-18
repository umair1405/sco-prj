import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { Sparkles, Layers, ShieldCheck, Heart, Crown, SlidersHorizontal } from 'lucide-react';

const categoryImages = {
  'all': '/products/top-bottom/1/SaveClip.App_814223380_18075465614719284_814104323377549430_n.jpg',
  'top-bottom': '/products/top-bottom/1/SaveClip.App_814223380_18075465614719284_814104323377549430_n.jpg',
  'abayas': '/products/Abayas/6/800165808_18107329256622769_8870637643014862685_n.jpg',
  'onepiece': '/products/onepice/1/729660722_18094774553578472_7927858063859501886_n.jpg',
  'jeans': '/products/jeans/1/768931860_18064452122727259_3002315743992306731_n.jpg',
};

export default function CategoryNav({ selectedSize, setSelectedSize, sortBy, setSortBy }) {
  const { activeCategory, setActiveCategory, products } = useStore();

  const getIcon = (id) => {
    switch (id) {
      case 'top-bottom': return <Layers className="w-4 h-4" />;
      case 'abayas': return <ShieldCheck className="w-4 h-4" />;
      case 'onepiece': return <Heart className="w-4 h-4" />;
      case 'jeans': return <Sparkles className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div id="collection-section" className="pt-12 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-xs font-bold tracking-[0.25em] text-[#8E704F] uppercase">Curated Catalog</span>
        <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1F1914]">
          Shop By Category
        </h2>
        <div className="w-12 h-0.5 bg-[#B89772] mx-auto mt-2"></div>
      </div>

      {/* Visual Category Cards Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = cat.id === 'all' 
            ? products.length 
            : products.filter(p => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group relative rounded-xl overflow-hidden text-left transition-all duration-300 border ${
                isSelected 
                  ? 'border-[#B89772] ring-2 ring-[#B89772]/40 shadow-lg scale-[1.02]' 
                  : 'border-[#EADBCE] hover:border-[#B89772]/70 shadow-sm'
              }`}
            >
              {/* Category Image Background */}
              <div className="h-28 sm:h-36 w-full relative overflow-hidden bg-[#EAE2D6]">
                <img 
                  src={categoryImages[cat.id]} 
                  alt={cat.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 transition-opacity ${
                  isSelected ? 'bg-black/50' : 'bg-black/35 group-hover:bg-black/45'
                }`}></div>

                {/* Tag / Counter */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#1F1914] px-2 py-0.5 rounded-full">
                  {count} Designs
                </div>

                {/* Bottom Label */}
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-light text-[#EADBC8] uppercase tracking-wider mb-0.5">
                    {getIcon(cat.id)}
                    <span className="text-[10px]">Collection</span>
                  </div>
                  <h3 className="font-serif-luxury font-bold text-sm leading-tight drop-shadow-sm">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#EADBCE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Size Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-[#6B5E55] uppercase tracking-wider whitespace-nowrap mr-1">
            Filter Size:
          </span>
          {sizes.map((size) => {
            const isSizeActive = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isSizeActive
                    ? 'bg-[#1F1914] text-white shadow-sm'
                    : 'bg-[#F4EDE2] text-[#4A3B32] hover:bg-[#E4D5C1]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <span className="text-xs font-bold text-[#6B5E55] uppercase tracking-wider">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium bg-[#F4EDE2] border border-[#DFCBB5] rounded-lg px-3 py-1.5 text-[#1F1914] focus:outline-none focus:ring-1 focus:ring-[#B89772] cursor-pointer"
          >
            <option value="featured">Featured &amp; Bestselling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated ★</option>
          </select>
        </div>

      </div>

    </div>
  );
}
