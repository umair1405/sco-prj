import React, { useState, useEffect, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import InstagramFeed from './components/InstagramFeed';
import TrustBadges from './components/TrustBadges';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { Sparkles, FilterX } from 'lucide-react';

function Storefront() {
  const { 
    products, 
    activeCategory, 
    searchQuery, 
    setSearchQuery
  } = useStore();

  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (activeCategory !== 'all' && product.category !== activeCategory) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchFabric = product.fabric?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFabric) return false;
        }

        // Size filter
        if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0); // Featured
      });
  }, [products, activeCategory, searchQuery, selectedSize, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Header */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* Category Navigation & Filters */}
      <CategoryNav 
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EADBCE] p-8 shadow-xs my-6">
            <div className="w-16 h-16 bg-[#F4EDE2] text-[#8E704F] rounded-full flex items-center justify-center mx-auto mb-4">
              <FilterX className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#1F1914]">
              No Designs Found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              We couldn't find any products matching your search query or selected size filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSize('All');
              }}
              className="px-6 py-2.5 bg-[#1F1914] text-white text-xs font-bold rounded-full uppercase tracking-wider hover:bg-[#8E704F] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Shoppable Instagram Feed */}
      <InstagramFeed />

      {/* Trust Badges & Verified Reviews */}
      <TrustBadges />

      {/* Footer */}
      <Footer />

      {/* Popups & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

function MainApp() {
  const { isAdminOpen, setIsAdminOpen } = useStore();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname + window.location.hash);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAdminRoute = 
    isAdminOpen || 
    currentPath.startsWith('/admin') || 
    currentPath.startsWith('/merchant') || 
    currentPath.includes('#/admin') || 
    currentPath.includes('#admin');

  const handleBackToStore = () => {
    setIsAdminOpen(false);
    try {
      window.history.pushState({}, '', '/');
    } catch (e) {}
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminRoute) {
    return <AdminPortal onBackToStore={handleBackToStore} />;
  }

  return <Storefront />;
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
