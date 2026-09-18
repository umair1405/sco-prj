import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  QrCode,
  Copy,
  Check
} from 'lucide-react';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    cartTotal, 
    discountAmount, 
    shippingCost, 
    formatPrice, 
    placeOrder
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const order = placeOrder({
        customer: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'
      });

      setCompletedOrder(order);
      setIsProcessing(false);
    }, 1200);
  };

  const copyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard?.writeText(completedOrder.orderId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => !completedOrder && setIsCheckoutOpen(false)}
      ></div>

      <div className="relative bg-[#FAF8F5] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#EADBCE] z-10 my-auto">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#EADBCE] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8E704F]" />
            <h2 className="font-serif-luxury font-bold text-lg text-[#1F1914]">
              {completedOrder ? 'Order Confirmed!' : 'Secure Express Checkout'}
            </h2>
          </div>
          
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success Screen */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#8E704F] uppercase tracking-widest">Thank you for your order</span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1F1914] mt-1">
                Your Senora &amp; Co Drop is Reserved!
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                We've received your order and our artisan team in Kozhikode has begun packaging your luxury pieces.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-white p-5 rounded-2xl border border-[#DFCBB5] text-left space-y-3 shadow-sm max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[11px] text-gray-500 uppercase">Order Reference</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#1F1914]">{completedOrder.orderId}</span>
                    <button 
                      onClick={copyOrderId}
                      className="text-gray-400 hover:text-black p-1 text-xs"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-500 uppercase">Amount</span>
                  <p className="text-sm font-bold text-[#8E704F]">{formatPrice(completedOrder.total)}</p>
                </div>
              </div>

              <div className="text-xs text-[#5A483B] space-y-1">
                <p><strong>Recipient:</strong> {completedOrder.customer.name} ({completedOrder.customer.phone})</p>
                <p><strong>Deliver To:</strong> {completedOrder.address.street}, {completedOrder.address.city}, {completedOrder.address.pincode}</p>
                <p><strong>Payment:</strong> {completedOrder.paymentMethod}</p>
              </div>

              {/* Items in order */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                {completedOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{it.product.name} (x{it.quantity})</span>
                    <span className="font-semibold">{formatPrice(it.product.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 max-w-lg mx-auto pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-3.5 px-6 rounded-xl btn-luxury font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-md"
              >
                <span>Print / Save Order Receipt</span>
              </button>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full py-3 px-6 rounded-xl bg-white border border-[#DFCBB5] text-xs font-bold text-[#1F1914] hover:bg-[#F4EDE2] transition-colors uppercase tracking-wider"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-7 space-y-6">
            
            {/* 1. Contact & Delivery Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E704F]">
                <span>1. Contact &amp; Shipping Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Aysha Rahiman"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1914] mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="order-updates@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1914] mb-1">Street Address, Villa / Apartment *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="House #12, Rose Villa, Beach Road"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Calicut"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="Kerala"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F1914] mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="673001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-white border border-[#DFCBB5] rounded-xl focus:ring-1 focus:ring-[#B89772] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="space-y-3 pt-4 border-t border-[#EADBCE]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E704F]">
                <span>2. Payment Option</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#B89772] bg-white ring-2 ring-[#B89772]/30 shadow-sm'
                      : 'border-[#DFCBB5] bg-white hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-[#8E704F]" />
                  <span className="text-xs font-bold block text-[#1F1914]">UPI / QR</span>
                  <span className="text-[10px] text-gray-500">GPay, PhonePe</span>
                </button>

                {/* Cards Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#B89772] bg-white ring-2 ring-[#B89772]/30 shadow-sm'
                      : 'border-[#DFCBB5] bg-white hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#8E704F]" />
                  <span className="text-xs font-bold block text-[#1F1914]">Cards</span>
                  <span className="text-[10px] text-gray-500">Visa, Master</span>
                </button>

                {/* COD Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#B89772] bg-white ring-2 ring-[#B89772]/30 shadow-sm'
                      : 'border-[#DFCBB5] bg-white hover:bg-gray-50'
                  }`}
                >
                  <Truck className="w-5 h-5 mx-auto mb-1 text-[#8E704F]" />
                  <span className="text-xs font-bold block text-[#1F1914]">Cash on Delivery</span>
                  <span className="text-[10px] text-gray-500">Pay on delivery</span>
                </button>
              </div>

              {/* Payment Details Subview */}
              {paymentMethod === 'upi' && (
                <div className="p-3.5 bg-white rounded-xl border border-[#DFCBB5] space-y-2 text-xs">
                  <p className="font-semibold text-gray-700">Choose Instant UPI App:</p>
                  <div className="flex gap-2">
                    {['gpay', 'phonepe', 'paytm'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase ${
                          upiApp === app 
                            ? 'bg-[#1F1914] text-white border-[#1F1914]' 
                            : 'bg-[#FAF8F5] border-[#DFCBB5] text-gray-600'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-emerald-700 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant UPI verification &amp; priority dispatch active.</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-3.5 bg-white rounded-xl border border-[#DFCBB5] space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4123 •••• •••• 9821" 
                      className="w-full p-2 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="p-2 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="CVV" 
                      className="p-2 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-[#F4EDE2] rounded-2xl border border-[#DFCBB5] space-y-2 text-xs text-[#5A483B]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1F1914] pt-2 border-t border-[#DFCBB5]">
                <span>Total Amount Payable:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl btn-luxury font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Secure Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirm Order &amp; Reserve Pieces ({formatPrice(cartTotal)})</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
