import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const HERO_MEDIA = [
  // 1st Photo -> Seraphina Pleated Maxi (onepice/1)
  { 
    type: 'image', 
    src: '/products/onepice/1/729660722_18094774553578472_7927858063859501886_n.jpg',
    duration: 3500,
    productId: 'sen-op-1',
    title: 'Seraphina Pleated Maxi',
    category: 'One-Piece',
    price: '₹3,199'
  },
  // Video 1 -> Leopard Print Dress (onepice/3 - Celeste Bohemian Flare One-Piece)
  { 
    type: 'video', 
    src: '/videos/video-1.mp4',
    productId: 'sen-op-3',
    title: 'Celeste Bohemian Flare One-Piece',
    category: 'One-Piece',
    price: '₹3,000'
  },
  // Video 2 -> Aurelia Co-ord Set (top-bottom/1)
  { 
    type: 'video', 
    src: '/videos/video-2.mp4',
    productId: 'sen-tb-1',
    title: 'Aurelia Blue Printed Co-ord Set',
    category: 'Top & Bottom',
    price: '₹2,899'
  },
  // Video 3 -> Noor Velvet Abaya (Abayas/9)
  { 
    type: 'video', 
    src: '/videos/video-3.mp4',
    productId: 'sen-ab-9',
    title: 'Noor Embroidered Velvet Abaya',
    category: 'Abayas',
    price: '₹3,499'
  },
  // Video 4 -> Blush Rose Co-ord (top-bottom/11)
  { 
    type: 'video', 
    src: '/videos/video-4.mp4',
    productId: 'sen-tb-11',
    title: 'Blush Rose Contemporary Co-ord',
    category: 'Top & Bottom',
    price: '₹3,099'
  },
  // Video 5 -> Amira Satin Slip Gown (onepice/13)
  { 
    type: 'video', 
    src: '/videos/video-5.mp4',
    productId: 'sen-op-13',
    title: 'Amira Satin Slip Maxi Gown',
    category: 'One-Piece',
    price: '₹3,399'
  },
  // Video 6 -> Zahra Silk Kaftan Abaya (Abayas/10)
  { 
    type: 'video', 
    src: '/videos/video-6.mp4',
    productId: 'sen-ab-10',
    title: 'Zahra Silk Drape Kaftan Abaya',
    category: 'Abayas',
    price: '₹2,999'
  }
];

export default function Hero() {
  const { setActiveCategory, products, setSelectedProductModal } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_MEDIA.length) % HERO_MEDIA.length);
  };

  // Auto-move: image advances on timer; video starts smoothly and advances on ended
  useEffect(() => {
    const currentItem = HERO_MEDIA[currentIndex];

    if (currentItem.type === 'video') {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.defaultMuted = true;
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    } else {
      if (videoRef.current) {
        try { videoRef.current.pause(); } catch (_) {}
      }
      const timer = setTimeout(() => {
        nextSlide();
      }, currentItem.duration || 3500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleVideoEnded = () => {
    nextSlide();
  };

  const handleExplore = () => {
    setActiveCategory('all');
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreCurrentItem = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const item = HERO_MEDIA[currentIndex];
    let found = null;
    if (item.productId) {
      found = products.find(p => p.id === item.productId);
    }
    if (!found && item.category) {
      const cat = item.category === 'Top & Bottom' ? 'top-bottom' : item.category.toLowerCase().replace(/[^a-z]/g, '');
      found = products.find(p => p.category === cat);
    }
    if (found) {
      setSelectedProductModal(found);
    } else {
      setActiveCategory('all');
      const el = document.getElementById('collection-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentMedia = HERO_MEDIA[currentIndex];

  return (
    <div className="relative bg-gradient-to-b from-[#FAF8F5] via-[#F4EDE2] to-[#FAF8F5] pt-6 pb-12 lg:pt-10 lg:pb-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/80 border border-[#DFCBB5] text-[#8E704F] text-[10px] sm:text-xs font-bold tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
              <span>THE AUTUMN / WINTER '26 DROP</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#1F1914] leading-[1.2] tracking-tight break-words">
              Elegance Tailored for the <span className="italic font-normal gold-text-gradient block sm:inline">Modern Woman</span>
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-base text-[#5A483B] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore exquisite silk satin co-ords, royal embroidered abayas, and flowy designer silhouettes. Handcrafted for unforgettable moments.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <button 
                onClick={handleExplore}
                className="w-full sm:w-auto px-6 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full btn-luxury flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-4 sm:pt-6 border-t border-[#DFCBB5]/70 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-base sm:text-xl lg:text-2xl font-serif-luxury font-bold text-[#1F1914]">100%</span>
                <span className="text-[10px] sm:text-[11px] text-[#6B5E55] font-medium leading-tight">Premium Fabrics</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-base sm:text-xl lg:text-2xl font-serif-luxury font-bold text-[#1F1914]">24-48h</span>
                <span className="text-[10px] sm:text-[11px] text-[#6B5E55] font-medium leading-tight">Express Dispatch</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-base sm:text-xl lg:text-2xl font-serif-luxury font-bold text-[#1F1914]">5,000+</span>
                <span className="text-[10px] sm:text-[11px] text-[#6B5E55] font-medium leading-tight">Happy Clients</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Performance Visual Showcase */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-sm lg:max-w-md">
              
              {/* Smooth Showcase Card */}
              <div 
                onClick={handleExploreCurrentItem}
                className="w-full relative rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white aspect-[4/5] cursor-pointer bg-[#1A1410]"
              >
                {/* Active Video Player (Native Hardware Accelerated & Smooth Auto-advance) */}
                {currentMedia.type === 'video' && (
                  <video 
                    key={currentMedia.src}
                    ref={videoRef}
                    src={currentMedia.src}
                    playsInline
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    muted
                    defaultMuted
                    autoPlay
                    preload="metadata"
                    onEnded={handleVideoEnded}
                    className="absolute inset-0 w-full h-full object-cover object-center z-10"
                  />
                )}

                {/* Active Image Layer */}
                {currentMedia.type === 'image' && (
                  <img 
                    key={currentMedia.src}
                    src={currentMedia.src} 
                    alt={currentMedia.title} 
                    className="absolute inset-0 w-full h-full object-cover object-center z-10"
                  />
                )}

                {/* Dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none"></div>

                {/* Bottom Details Overlay */}
                <div className="absolute bottom-5 left-4 right-4 text-white z-30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#DFCBB5] bg-black/50 px-2 py-0.5 rounded">
                      {currentMedia.type === 'video' ? 'Reel Preview' : 'Lookbook'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-white drop-shadow">
                    {currentMedia.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                    <span className="text-xs sm:text-sm font-bold text-[#F1E9DC]">Starting at {currentMedia.price}</span>
                    <span className="text-xs bg-white text-[#1F1914] px-3 py-1 sm:py-1.5 rounded-full font-bold shadow flex items-center gap-1">
                      <span>View Piece</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Clean Progress Indicators (Tap to jump to any reel) */}
                <div className="absolute bottom-0 inset-x-0 flex gap-1 p-1 bg-black/60 z-30">
                  {HERO_MEDIA.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(i);
                      }}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i === currentIndex ? 'bg-[#D4AF37]' : 'bg-white/30'
                      }`}
                    ></button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

