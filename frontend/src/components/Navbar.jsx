import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  PhoneCall, 
  ChevronDown,
  Lock
} from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Navbar() {
  const { 
    cart, 
    wishlist, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory,
    currency,
    setCurrency,
    setIsAdminOpen
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'all', label: 'All Collections' },
    { id: 'abayas', label: 'Abayas' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'onepiece', label: 'One-Piece' },
    { id: 'top-bottom', label: 'Top & Bottom' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#1B1510] text-[#E8D9C5] text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-between border-b border-[#382C22]">
        <div className="hidden md:flex items-center space-x-4 text-[11px] opacity-80">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Worldwide Shipping Available
          </span>
          <span>•</span>
          <span>Kozhikode, Kerala & Global Boutique</span>
        </div>

        <div className="mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>USE CODE <strong className="text-white underline font-bold tracking-widest">SENORA10</strong> FOR 10% OFF YOUR FIRST DROP</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[11px]">
          {/* Currency Switcher */}
          <div className="flex items-center gap-1 bg-[#2C231B] px-2 py-0.5 rounded border border-[#47392C]">
            <span className="text-[#C8A97E]">Curr:</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="INR" className="bg-[#1B1510]">INR (₹)</option>
              <option value="AED" className="bg-[#1B1510]">AED (د.إ)</option>
              <option value="USD" className="bg-[#1B1510]">USD ($)</option>
            </select>
          </div>

          <a 
            href="https://www.instagram.com/senora__co" 
            target="_blank" 
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1 text-[#C8A97E]"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@senora__co</span>
          </a>

          <button
            onClick={() => {
              setIsAdminOpen(true);
              try { window.history.pushState({}, '', '/admin'); } catch(e){}
            }}
            className="hover:text-white transition-colors flex items-center gap-1 text-[#D4AF37] font-semibold bg-[#2A1F17] px-2 py-0.5 rounded border border-[#5C4533] ml-1"
          >
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 border-b ${
        isScrolled 
          ? 'glass-panel shadow-sm border-[#EADBCE]' 
          : 'bg-[#FAF8F5]/95 backdrop-blur-md border-[#EADBCE]/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Trigger & Search Icon */}
            <div className="flex items-center gap-3 lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#2A1F17] hover:bg-[#F1E9DC] rounded-full transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#2A1F17] hover:bg-[#F1E9DC] rounded-full transition-colors"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => { setActiveCategory('all'); window.scrollTo({ top: 0, behavior: 'smooth'}); }}>
              <div className="text-2xl sm:text-3xl font-serif-luxury font-bold tracking-[0.25em] text-[#1F1914] uppercase">
                SENORA &amp; CO
              </div>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#8E704F] font-semibold -mt-0.5">
                Couture • Ready-to-Wear
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = activeCategory === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveCategory(link.id);
                      const el = document.getElementById('collection-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`text-sm tracking-wider uppercase font-medium transition-all py-1 relative ${
                      isActive 
                        ? 'text-[#8E704F] font-bold' 
                        : 'text-[#4A3B32] hover:text-[#1F1914]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B89772] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Bar Input (Desktop) */}
              <div className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search silk, co-ords, abaya..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-60 pl-9 pr-4 py-1.5 text-xs bg-[#F4EDE2]/80 border border-[#DFCBB5] rounded-full focus:outline-none focus:ring-1 focus:ring-[#B89772] focus:bg-white transition-all text-[#2A1F17] placeholder:text-[#9A8779]"
                />
                <Search className="w-4 h-4 absolute left-3 text-[#9A8779] pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={() => {
                  const el = document.getElementById('collection-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 relative text-[#2A1F17] hover:bg-[#F1E9DC] rounded-full transition-colors group"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${wishlist.length > 0 ? 'fill-[#D95353] text-[#D95353]' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D95353] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 relative bg-[#1F1914] text-white hover:bg-[#8E704F] rounded-full transition-all shadow-md group"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#140E0A] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-extrabold shadow-sm animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Expansion */}
          {searchOpen && (
            <div className="pb-3 pt-1 md:hidden animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dresses, co-ords, abayas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-[#DFCBB5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B89772] text-[#2A1F17]"
                />
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A8779]" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-2.5 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          <div className="relative w-4/5 max-w-xs bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#EADBCE]">
                <div>
                  <div className="text-xl font-serif-luxury font-bold tracking-widest text-[#1F1914]">
                    SENORA &amp; CO
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-[#8E704F] font-semibold">
                    Calicut • Dubai • Online
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Currency on Mobile */}
              <div className="py-4 border-b border-[#EADBCE] flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Currency</span>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-white border border-[#DFCBB5] text-xs font-semibold py-1 px-2.5 rounded-lg text-[#1F1914]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              {/* Mobile Links */}
              <div className="py-4 space-y-1">
                <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Categories</div>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveCategory(link.id);
                      setMobileMenuOpen(false);
                      const el = document.getElementById('collection-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === link.id
                        ? 'bg-[#E4D5C1] text-[#1F1914] font-bold'
                        : 'text-[#4A3B32] hover:bg-[#F1E9DC]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EADBCE] space-y-2">
              <a 
                href="https://www.instagram.com/senora__co" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#E1306C] rounded-xl shadow"
              >
                <InstagramIcon className="w-4 h-4" />
                Follow on Instagram
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                  try { window.history.pushState({}, '', '/admin'); } catch(e){}
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[#D4AF37] bg-[#1F1914] rounded-xl shadow border border-[#5C4533]"
              >
                <Lock className="w-3.5 h-3.5" />
                Merchant Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
