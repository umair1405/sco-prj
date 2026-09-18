import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Truck, 
  Tag, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    shippingCost,
    isFreeShipping,
    freeShippingThreshold,
    discountAmount,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    formatPrice,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingDifference = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  const handleProceedToOnlineCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#EADBCE]">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EADBCE] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#8E704F]" />
            <h2 className="font-serif-luxury font-bold text-xl text-[#1F1914]">
              Your Shopping Bag
            </h2>
            <span className="bg-[#F1E9DC] text-[#8E704F] text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((t, i) => t + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#F4EDE2] px-5 py-3 border-b border-[#DFCBB5]">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-[#1F1914]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#8E704F]" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Shipping!</span>
              ) : (
                <span>Add <strong>{formatPrice(freeShippingDifference)}</strong> for Free Express Delivery</span>
              )}
            </span>
            <span className="text-[11px] text-gray-600">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                isFreeShipping ? 'bg-emerald-500' : 'bg-[#B89772]'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-[#F1E9DC] rounded-full flex items-center justify-center mx-auto text-[#8E704F]">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="font-serif-luxury text-xl font-bold text-[#1F1914]">Your bag is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our signature silk co-ords and modest abayas tailored for you.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  const el = document.getElementById('collection-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-[#1F1914] text-white rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#8E704F] transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.itemKey}
                className="flex gap-3.5 bg-white p-3.5 rounded-2xl border border-[#EADBCE] shadow-sm relative group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between pr-5">
                      <h3 className="font-serif-luxury font-bold text-sm text-[#1F1914] line-clamp-1">
                        {item.product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#6B5E55] mt-1">
                      <span className="bg-[#FAF8F5] border border-[#DFCBB5] px-2 py-0.5 rounded font-semibold">
                        Size: {item.selectedSize}
                      </span>
                      <span className="bg-[#FAF8F5] border border-[#DFCBB5] px-2 py-0.5 rounded font-semibold">
                        {item.selectedColor}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#1F1914]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#FAF8F5] border border-[#DFCBB5] rounded-lg">
                      <button 
                        onClick={() => updateCartQuantity(item.itemKey, -1)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:text-black font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-[#1F1914] min-w-[1.2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQuantity(item.itemKey, 1)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.itemKey)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary & Checkouts */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#EADBCE] space-y-3.5 shadow-lg">
            
            {/* Coupon Code section */}
            <div>
              {coupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{coupon.code}</strong> applied ({formatPrice(discountAmount)} OFF)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Enter Promo (e.g. SENORA10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-[#FAF8F5] border border-[#DFCBB5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B89772]"
                      />
                      <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F1E9DC] hover:bg-[#E4D5C1] text-[#8E704F] text-xs font-bold rounded-xl border border-[#DFCBB5] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5A483B] pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F1914]">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Special Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-[#1F1914]">
                  {shippingCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#1F1914] pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="pt-2">
              <button
                onClick={handleProceedToOnlineCheckout}
                className="w-full py-3.5 px-4 rounded-xl btn-luxury font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
              >
                <span>Proceed to Checkout (UPI / Cards / COD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
