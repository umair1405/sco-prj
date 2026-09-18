import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

const WHATSAPP_NUMBER = '919895000000'; // Boutique WhatsApp number
const API_BASE = '/api';

export const StoreProvider = ({ children }) => {
  // Products state (loads all 28 real products with latest prices and mappings)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('senora_products_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem('senora_products_v4', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('senora_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('senora_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('senora_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    
    // Default initial sample boutique orders for admin visibility
    const initialOrders = [
      {
        orderId: 'SNC-849201',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[10], // Seraphina Pleated Maxi
            quantity: 1,
            selectedSize: 'M',
            selectedColor: 'Signature'
          }
        ],
        subtotal: 3199,
        discount: 320,
        shipping: 0,
        total: 2879,
        coupon: 'SENORA10',
        customer: {
          name: 'Aysha Fatima',
          phone: '+91 98471 23456',
          email: 'aysha.f@gmail.com'
        },
        address: {
          street: 'Hill Palace Road, Flat 4B',
          city: 'Kozhikode',
          state: 'Kerala',
          pincode: '673001'
        },
        paymentMethod: 'UPI (GPAY)',
        status: 'Confirmed'
      },
      {
        orderId: 'SNC-731904',
        date: new Date(Date.now() - 3600000 * 26).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[0], // Aurelia Blue Printed Co-ord Set
            quantity: 1,
            selectedSize: 'S',
            selectedColor: 'Noir Black'
          },
          {
            product: INITIAL_PRODUCTS[11], // Celeste Bohemian Flare
            quantity: 1,
            selectedSize: 'S',
            selectedColor: 'Signature'
          }
        ],
        subtotal: 5899,
        discount: 500,
        shipping: 0,
        total: 5399,
        coupon: 'SAVE500',
        customer: {
          name: 'Dr. Reem Hameed',
          phone: '+91 97455 89012',
          email: 'reem.hameed@outlook.com'
        },
        address: {
          street: 'Beach Road, Villa 12',
          city: 'Kannur',
          state: 'Kerala',
          pincode: '670001'
        },
        paymentMethod: 'Credit/Debit Card',
        status: 'Shipped'
      },
      {
        orderId: 'SNC-618492',
        date: new Date(Date.now() - 3600000 * 50).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[8], // Noor Embroidered Velvet Abaya
            quantity: 1,
            selectedSize: 'L',
            selectedColor: 'Signature'
          }
        ],
        subtotal: 3499,
        discount: 0,
        shipping: 0,
        total: 3499,
        coupon: null,
        customer: {
          name: 'Noufina K.P.',
          phone: '+91 94470 11223',
          email: 'noufina.kp@gmail.com'
        },
        address: {
          street: 'Kallai Road, Noor Villa',
          city: 'Kozhikode',
          state: 'Kerala',
          pincode: '673003'
        },
        paymentMethod: 'Cash on Delivery',
        status: 'Delivered'
      }
    ];
    localStorage.setItem('senora_orders', JSON.stringify(initialOrders));
    return initialOrders;
  });

  // Fetch live products from backend on mount (if available)
  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data?.length > 0) {
            setProducts(result.data);
          }
        }
      } catch (err) {
        // Fallback to local data if running purely client-side
        console.log('Using client product catalog cache');
      }
    };
    fetchBackendProducts();
  }, []);

  // Navigation & Modal states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Currency
  const [currency, setCurrency] = useState('INR'); // INR, AED, USD
  const currencyRates = {
    INR: { symbol: '₹', rate: 1 },
    AED: { symbol: 'AED ', rate: 0.044 },
    USD: { symbol: '$', rate: 0.012 }
  };

  // Coupon state
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Persist storage
  useEffect(() => {
    localStorage.setItem('senora_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('senora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('senora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('senora_orders', JSON.stringify(orders));
  }, [orders]);

  // Currency format helper
  const formatPrice = (inrPrice) => {
    const current = currencyRates[currency] || currencyRates.INR;
    const converted = Math.round(inrPrice * current.rate);
    return `${current.symbol}${converted.toLocaleString()}`;
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingCost = cart.length === 0 ? 0 : isFreeShipping ? 0 : 149;

  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * coupon.value) / 100);
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, cartSubtotal);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  // Cart Actions
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    const itemKey = `${product.id}-${size}-${color}`;

    setCart(prev => {
      const existing = prev.find(item => item.itemKey === itemKey);
      if (existing) {
        return prev.map(item =>
          item.itemKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { itemKey, product, selectedSize: size, selectedColor: color, quantity }];
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemKey, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.itemKey === itemKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemKey) => {
    setCart(prev => prev.filter(item => item.itemKey !== itemKey));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Apply Coupon
  const applyCoupon = async (code) => {
    const clean = code.trim().toUpperCase();

    // Try backend API validation first
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean })
      });
      if (res.ok) {
        const result = await res.json();
        setCoupon(result.data);
        setCouponError('');
        return true;
      }
    } catch (e) {
      // Fallback to local coupon validation
    }

    if (clean === 'SENORA10') {
      setCoupon({ code: 'SENORA10', value: 10, type: 'percent', label: '10% OFF Special Boutique Discount' });
      setCouponError('');
      return true;
    } else if (clean === 'FIRSTDROP' || clean === 'SAVE500') {
      setCoupon({ code: 'FIRSTDROP', value: 500, type: 'fixed', label: '₹500 OFF First Order' });
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try SENORA10 for 10% off.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  // Create & Place Order
  const placeOrder = (orderDetails) => {
    const newOrder = {
      orderId: 'SNC-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      total: cartTotal,
      coupon: coupon ? coupon.code : null,
      customer: orderDetails.customer,
      address: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      status: 'Confirmed'
    };

    // Save locally
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);

    // Sync with backend API asynchronously
    try {
      fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(() => {});
    } catch (e) {}

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B89772', '#E88B84', '#1F1914', '#FFE6E6']
      });
    } catch (e) {
      console.log('Confetti trigger', e);
    }

    return newOrder;
  };

  // WhatsApp 1-Click Order Link Generators
  const getWhatsAppProductUrl = (product, size, color) => {
    const selectedS = size || product.sizes[0];
    const selectedC = color || product.colors[0]?.name || 'Standard';
    const text = `Hi Senora & Co! ✨ I would like to order:
🛍️ *${product.name}*
🏷️ Price: ₹${product.price}
📏 Size: ${selectedS}
🎨 Color: ${selectedC}
🔗 Link: ${window.location.origin}/#${product.id}

Please confirm availability and sharing delivery details!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppCartUrl = (customerName = '', city = '') => {
    if (cart.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;

    const itemsSummary = cart
      .map((item, idx) => `${idx + 1}. *${item.product.name}* (Size: ${item.selectedSize}, Color: ${item.selectedColor}, Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`)
      .join('\n');

    const text = `Hello Senora & Co! 🌸 I would like to place an order from your website:

${itemsSummary}

💰 *Subtotal*: ₹${cartSubtotal}
🎁 *Discount*: ₹${discountAmount}
📦 *Total Payable*: ₹${cartTotal}
👤 *Customer*: ${customerName || 'Direct Shopper'} ${city ? `(${city})` : ''}

Please send payment instructions / UPI confirmation!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  // Admin Actions
  const addProduct = (newProduct) => {
    const id = 'sen-' + Date.now().toString().slice(-4);
    const product = { ...newProduct, id, rating: 5.0, reviewsCount: 0 };
    setProducts(prev => [product, ...prev]);

    // Async sync to backend
    try {
      fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      }).catch(() => {});
    } catch (e) {}
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch (e) {}
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('senora_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => {
      const updated = prev.filter(o => o.orderId !== orderId);
      localStorage.setItem('senora_orders', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProductModal,
        setSelectedProductModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        currency,
        setCurrency,
        formatPrice,
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
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
