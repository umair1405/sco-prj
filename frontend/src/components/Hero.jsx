import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const HERO_MEDIA = [
  // 1st Photo -> Seraphina Pleated Maxi (onepice/1)
  { 
    type: 'image', 
    src: '/products/onepice/1/729660722_18094774553578472_7927858063859501886_n.jpg',
    duration: 2500,
    productId: 'sen-op-1',
    title: 'Seraphina Pleated Maxi',
    category: 'One-Piece',
    price: '₹3,199'
  },
  // Video 1 -> Leopard Print Dress (onepice/3 - Celeste Bohemian Flare One-Piece)
  { 
    type: 'video', 
    src: '/videos/video-1.mp4',
    duration: 7000,
    productId: 'sen-op-3',
    title: 'Celeste Bohemian Flare One-Piece',
    category: 'One-Piece',
    price: '₹3,000'
  },
  // Video 2 -> Aurelia Co-ord Set (top-bottom/1)
  { 
    type: 'video', 
    src: '/videos/video-2.mp4',
    duration: 5500,
    productId: 'sen-tb-1',
    title: 'Aurelia Blue Printed Co-ord Set',
    category: 'Top & Bottom',
    price: '₹2,899'
  },
  // Video 3 -> Noor Velvet Abaya (Abayas/9)
  { 
    type: 'video', 
    src: '/videos/video-3.mp4',
    duration: 6500,
    productId: 'sen-ab-9',
    title: 'Noor Embroidered Velvet Abaya',
    category: 'Abayas',
    price: '₹3,499'
  },
  // Video 4 -> Blush Rose Co-ord (top-bottom/11)
  { 
    type: 'video', 
    src: '/videos/video-4.mp4',
    duration: 7000,
    productId: 'sen-tb-11',
    title: 'Blush Rose Contemporary Co-ord',
    category: 'Top & Bottom',
    price: '₹3,099'
  },
  // Video 5 -> Amira Satin Slip Gown (onepice/13)
  { 
    type: 'video', 
    src: '/videos/video-5.mp4',
    duration: 6000,
    productId: 'sen-op-13',
    title: 'Amira Satin Slip Maxi Gown',
    category: 'One-Piece',
    price: '₹3,399'
  },
  // Video 6 -> Zahra Silk Kaftan Abaya (Abayas/10)
  { 
    type: 'video', 
    src: '/videos/video-6.mp4',
    duration: 5500,
    productId: 'sen-ab-10',
    title: 'Zahra Silk Drape Kaftan Abaya',
    category: 'Abayas',
    price: '₹2,999'
  }
];

export default function Hero() {
  const { setActiveCategory, WHATSAPP_NUMBER, products, setSelectedProductModal } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length);
  };

  // Dynamic slideshow timing & video playback control
  useEffect(() => {
    const currentItem = HERO_MEDIA[currentIndex];

    if (currentItem.type === 'video') {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
      // Safety fallback timer if onEnded doesn't trigger
      const fallbackTimer = setTimeout(() => {
        nextSlide();
      }, currentItem.duration || 6500);
      return () => clearTimeout(fallbackTimer);
    } else {
      // Pause video when on image slide
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (_) {}
      }
      // Timer for image slide
      const timer = setTimeout(() => {
        nextSlide();
      }, currentItem.duration || 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(pct);
    }
  };

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
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EDE2] to-[#FAF8F5] pt-6 pb-12 lg:pt-10 lg:pb-16">
      
      {/* Decorative luxury gradient blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#EADBC8]/40 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-[#FCD2D2]/30 blur-2xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#DFCBB5] text-[#8E704F] text-xs font-bold tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
              <span>THE AUTUMN / WINTER '26 COUTURE DROP</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-[#1F1914] leading-[1.15] tracking-tight">
              Elegance Tailored for the <span className="italic font-normal gold-text-gradient">Modern Woman</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#5A483B] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore exquisite silk satin co-ords, royal embroidered abayas, and flowy designer silhouettes. Handcrafted for unforgettable moments.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button 
                onClick={handleExplore}
                className="w-full sm:w-auto px-10 py-4 text-sm font-bold tracking-wider uppercase rounded-full btn-luxury flex items-center justify-center gap-2.5 group shadow-lg"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-[#DFCBB5]/70 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1F1914]">100%</span>
                <span className="text-[11px] text-[#6B5E55] font-medium leading-tight">Premium Silk &amp; Velvet</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1F1914]">24-48h</span>
                <span className="text-[11px] text-[#6B5E55] font-medium leading-tight">Express Dispatch</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1F1914]">5,000+</span>
                <span className="text-[11px] text-[#6B5E55] font-medium leading-tight">Happy Instagram DMs</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Editorial Showcase with 1st Photo + All 6 Videos + Lookbook */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-sm lg:max-w-md animate-float">
              
              {/* Luxury ambient backlight halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/30 via-[#EADBC8]/40 to-[#B89772]/30 rounded-3xl blur-xl opacity-75 pulse-glow pointer-events-none"></div>

              {/* Auto-Sliding Showcase Card */}
              <div 
                onClick={handleExploreCurrentItem}
                className="w-full relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] cursor-pointer group transform hover:scale-[1.02] transition-all duration-500 bg-[#1A1410]"
              >
                {/* Active Video Player */}
                {currentMedia.type === 'video' && (
                  <video 
                    key={currentMedia.src}
                    ref={videoRef}
                    src={currentMedia.src}
                    playsInline
                    muted
                    defaultMuted
                    autoPlay
                    preload="auto"
                    onTimeUpdate={handleVideoTimeUpdate}
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
                    className="absolute inset-0 w-full h-full object-cover object-center z-10 transition-transform duration-1000 ease-out scale-105"
                  />
                )}

                {/* Elegant dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-20 pointer-events-none"></div>
                

                {/* Bottom Details Overlay */}
                <div className="absolute bottom-5 left-4 right-4 text-white z-30 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#DFCBB5] bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      {currentMedia.type === 'video' ? 'Reel Preview' : 'Auto Lookbook'}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif-luxury font-bold text-white drop-shadow-md">
                    {currentMedia.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                    <span className="text-sm font-bold text-[#F1E9DC]">Starting at {currentMedia.price}</span>
                    <span className="text-xs bg-white text-[#1F1914] px-3.5 py-1.5 rounded-full font-bold shadow-md group-hover:bg-[#EADBC8] transition-colors flex items-center gap-1">
                      <span>View Piece</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Animated Story-style Progress Indicators for all Media */}
                <div className="absolute bottom-0 inset-x-0 flex gap-1 p-1.5 bg-black/60 backdrop-blur-xs z-30">
                  {HERO_MEDIA.map((item, i) => (
                    <div 
                      key={i} 
                      className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden"
                    >
                      {i < currentIndex && (
                        <div className="h-full w-full bg-[#D4AF37] rounded-full"></div>
                      )}
                      {i === currentIndex && (
                        item.type === 'video' ? (
                          <div 
                            className="h-full bg-[#D4AF37] rounded-full transition-all duration-100"
                            style={{ width: `${Math.max(videoProgress, 8)}%` }}
                          ></div>
                        ) : (
                          <div 
                            key={`active-progress-${currentIndex}`}
                            className="h-full bg-[#D4AF37] rounded-full animate-progress-fill"
                          ></div>
                        )
                      )}
                    </div>
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

