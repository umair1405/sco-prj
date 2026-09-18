import React from 'react';
import { TESTIMONIALS } from '../data/products';
import { ShieldCheck, Truck, RefreshCw, MessageSquare, Star, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EDE2] flex items-center justify-center text-[#8E704F]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury font-bold text-sm text-[#1F1914]">Artisanal Quality</h3>
            <p className="text-xs text-[#6B5E55]">Pure Korean silks, Banarasi brocades &amp; velvet textures.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EDE2] flex items-center justify-center text-[#8E704F]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury font-bold text-sm text-[#1F1914]">Express Delivery</h3>
            <p className="text-xs text-[#6B5E55]">Dispatched in 24-48 hours with live tracking updates.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EDE2] flex items-center justify-center text-[#8E704F]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury font-bold text-sm text-[#1F1914]">Size Exchange</h3>
            <p className="text-xs text-[#6B5E55]">Easy 7-day doorstep size replacement assistance.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EDE2] flex items-center justify-center text-[#8E704F]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury font-bold text-sm text-[#1F1914]">Personal Stylist</h3>
            <p className="text-xs text-[#6B5E55]">Bespoke styling advice, fit assistance &amp; concierge care.</p>
          </div>
        </div>

        {/* Customer Reviews Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8E704F] uppercase">Client Love</span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1F1914]">
            Stories from Our Senora Community
          </h2>
          <div className="w-12 h-0.5 bg-[#B89772] mx-auto mt-2"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#B89772] transition-colors"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#4A3B32] italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-[#1F1914] flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </h3>
                  <span className="text-[11px] text-gray-400">{t.location}</span>
                </div>

                <span className="text-[10px] bg-[#FAF8F5] text-[#8E704F] font-semibold px-2 py-1 rounded border border-[#DFCBB5]">
                  {t.outfit}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
