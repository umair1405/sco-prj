import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  PhoneCall,
  Mail, 
  MapPin, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Footer() {
  const { setActiveCategory, setIsAdminOpen } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#140E0A] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2C2016]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-[#241B14] via-[#35271D] to-[#241B14] p-8 sm:p-10 rounded-3xl border border-[#473628] mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#B89772]/15 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8A97E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Join The Senora Club
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                Unlock 10% Off Your First Couture Drop
              </h3>
              <p className="text-xs sm:text-sm text-[#C4B3A3]">
                Be the first to know about new arrivals, limited festive releases, and secret sales.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Welcome to Senora &amp; Co! Use code <strong>SENORA10</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#140E0A] border border-[#524132] px-4 py-3 rounded-xl text-xs text-white placeholder:text-[#8E7969] focus:outline-none focus:ring-1 focus:ring-[#B89772]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#B89772] hover:bg-[#9E7C58] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all shadow-md flex-shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2C2016]">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="text-2xl font-serif-luxury font-bold tracking-[0.2em] text-white uppercase">
                SENORA &amp; CO
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                Couture • Ready-to-Wear
              </p>
            </div>

            <p className="text-xs text-[#A8988B] leading-relaxed max-w-sm">
              Crafted in Kozhikode (Calicut) with love, shipping worldwide. Curating modern co-ords, luxury modest abayas, and timeless celebration ensembles.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/senora__co"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#241B14] border border-[#3E2E21] flex items-center justify-center text-[#C8A97E] hover:text-white hover:bg-[#E1306C] hover:border-transparent transition-all"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#C8A97E] uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#A8988B]">
              <li>
                <button 
                  onClick={() => { setActiveCategory('top-bottom'); document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Top &amp; Bottom
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('abayas'); document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Abayas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('onepiece'); document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  One-Piece
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('jeans'); document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Jeans &amp; Denim
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#C8A97E] uppercase">
              Assistance
            </h4>
            <ul className="space-y-2 text-xs text-[#A8988B]">
              <li>
                <a href="mailto:support@senoraco.in" className="hover:text-white transition-colors">
                  Customer Support
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth'})}>
                  Size Chart Guide
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Exchange &amp; Returns Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Shipping Information
                </span>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    try { window.history.pushState({}, '', '/admin'); } catch(e){}
                  }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1 text-[#C8A97E] font-medium pt-1"
                >
                  <Lock className="w-3 h-3" />
                  Merchant Portal (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Boutique Locations */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#C8A97E] uppercase">
              Boutique Studio
            </h4>
            <div className="space-y-2.5 text-xs text-[#A8988B]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8A97E] flex-shrink-0 mt-0.5" />
                <span>Kozhikode (Calicut), Kerala, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8A97E] flex-shrink-0" />
                <span>umair142005@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#C8A97E] flex-shrink-0" />
                <span>+91 9152190233 (Mon - Sat, 10am - 8pm)</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & discrete merchant access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6B5F] gap-4">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} SENORA &amp; CO. All Rights Reserved.</p>
            <span>•</span>
            <button
              onClick={() => {
                setIsAdminOpen(true);
                try { window.history.pushState({}, '', '/admin'); } catch(e){}
              }}
              className="text-[#9E8E81] hover:text-[#C8A97E] transition-colors flex items-center gap-1 text-[11px]"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919152190233?text=Hi%20Umair!%20I%20saw%20your%20work%20on%20Senora%20%26%20Co."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#9E8E81] hover:text-[#C8A97E] transition-colors text-xs group"
            >
              <span>Built by <span className="text-[#C8A97E] font-semibold underline underline-offset-2 group-hover:text-white transition-colors">Umair (9152190233)</span></span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
