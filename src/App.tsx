import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BookingModal } from './components/BookingModal';
import { ProposalViewerModal } from './components/ProposalViewerModal';
import { CareGuideSection } from './components/CareGuideSection';
import { DeliverySection } from './components/DeliverySection';
import { ReviewsSection } from './components/ReviewsSection';
import { StoreLocationSection } from './components/StoreLocationSection';
import { Footer } from './components/Footer';

// Admin Panel Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProductManagement } from './components/admin/ProductManagement';
import { CategoryManagement } from './components/admin/CategoryManagement';
import { OrderManagement } from './components/admin/OrderManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { CouponManagement } from './components/admin/CouponManagement';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { StoreSettings } from './components/admin/StoreSettings';
import { TeamManagement } from './components/admin/TeamManagement';
import { AuditLogView } from './components/admin/AuditLogView';

import { PRODUCTS as INITIAL_PRODUCTS, DELIVERY_ZONES as INITIAL_ZONES } from './data/products';
import { Product, CartItem, DeliveryZone, OrderConfirmation } from './types';
import { api, AdminUser, StoreSettingsData, DBCategoryData, OrderData } from './services/api';
import { Search, SlidersHorizontal, MessageCircle, Bird, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation Mode: 'storefront' | 'admin'
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'storefront';
  });

  // Admin State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<OrderData | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Storefront Dynamic Data (Synced from Database)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>([
    'All',
    'Exotic Birds',
    'Cages & Aviaries',
    'Feed & Nutrition',
    'Toys & Perches',
  ]);
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(INITIAL_ZONES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Storefront Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('birdzone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check Admin Session on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (api.getToken()) {
          const user = await api.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (err) {
        api.setToken(null);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  // Sync route with URL history
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setViewMode('admin');
      } else {
        setViewMode('storefront');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch Live Storefront Data from Database
  const fetchStorefrontData = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        api.getProducts({ admin: 'false', limit: '100' }).catch(() => null),
        api.getCategories().catch(() => null),
        api.getSettings().catch(() => null),
      ]);

      if (prodRes && prodRes.products?.length > 0) {
        // Map database products to storefront Product shape
        const mappedProds: Product[] = prodRes.products.map((p) => ({
          id: p.id!,
          name: p.name,
          nameUrdu: p.nameUrdu || '',
          category: (p.categoryName as any) || 'Exotic Birds',
          price: p.salePrice || p.regularPrice,
          originalPrice: p.salePrice ? p.regularPrice : undefined,
          rating: 4.9,
          reviewsCount: 35,
          image: p.mainImage,
          inStock: p.stockQuantity > 0,
          stockCount: p.stockQuantity,
          sku: p.sku,
          description: p.description,
          features: [
            p.shortDescription || p.name,
            p.origin ? `Origin: ${p.origin}` : 'Health guaranteed',
            p.handTamed ? 'Hand-tamed & family friendly' : 'Verified health check',
          ].filter(Boolean),
          careTips: p.careInstructions,
          diet: p.diet,
          dimensions: p.dimensions,
          origin: p.origin,
          isFeatured: p.isFeatured,
        }));
        setProducts(mappedProds);
      }

      if (catRes && catRes.length > 0) {
        const catNames = ['All', ...catRes.map((c) => c.name)];
        setCategories(catNames);
      }

      if (setRes) {
        setStoreSettings(setRes);
        if (setRes.delivery?.zones?.length > 0) {
          setDeliveryZones(setRes.delivery.zones);
          setSelectedZone(setRes.delivery.zones[0]);
        }
      }
    } catch (err) {
      console.error('Failed to sync live storefront data:', err);
    }
  };

  useEffect(() => {
    fetchStorefrontData();
  }, [viewMode]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('birdzone_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderCompleted = (_order: OrderConfirmation) => {
    setCartItems([]);
    fetchStorefrontData(); // Refresh stock immediately
  };

  const handleNavigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setViewMode('admin');
  };

  const handleNavigateToStorefront = () => {
    window.history.pushState({}, '', '/');
    setViewMode('storefront');
    fetchStorefrontData();
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameUrdu.includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'featured') {
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // -------------------------------------------------------------
  // RENDER ADMIN PANEL
  // -------------------------------------------------------------
  if (viewMode === 'admin') {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#F8F7F1] flex items-center justify-center text-xs font-semibold text-stone-500">
          Verifying security session...
        </div>
      );
    }

    if (!currentUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => setCurrentUser(user)}
          onNavigateToStorefront={handleNavigateToStorefront}
        />
      );
    }

    return (
      <AdminLayout
        user={currentUser}
        activeTab={adminActiveTab}
        onSelectTab={(tab) => {
          setAdminActiveTab(tab);
          setSelectedAdminOrder(null);
        }}
        onLogout={handleLogout}
        onNavigateToStorefront={handleNavigateToStorefront}
      >
        {adminActiveTab === 'dashboard' && (
          <DashboardOverview
            onNavigateTab={(tab) => {
              setAdminActiveTab(tab);
            }}
            onOpenOrder={(order) => {
              setSelectedAdminOrder(order);
              setAdminActiveTab('orders');
            }}
          />
        )}

        {adminActiveTab === 'products' && <ProductManagement />}

        {adminActiveTab === 'categories' && <CategoryManagement />}

        {adminActiveTab === 'orders' && (
          <OrderManagement
            initialSelectedOrder={selectedAdminOrder}
            onClearInitialOrder={() => setSelectedAdminOrder(null)}
          />
        )}

        {adminActiveTab === 'customers' && <CustomerManagement />}

        {adminActiveTab === 'inventory' && <InventoryManagement />}

        {adminActiveTab === 'coupons' && <CouponManagement />}

        {adminActiveTab === 'reports' && <ReportsAnalytics />}

        {adminActiveTab === 'settings' && <StoreSettings />}

        {adminActiveTab === 'team' && <TeamManagement />}

        {adminActiveTab === 'activity' && <AuditLogView />}
      </AdminLayout>
    );
  }

  // -------------------------------------------------------------
  // RENDER PUBLIC STOREFRONT (Connected to Live Database)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#333333] flex flex-col font-sans selection:bg-[#4CAF50] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenProposal={() => setProposalOpen(true)}
        onOpenBooking={() => setBookingOpen(true)}
        onOpenAdmin={handleNavigateToAdmin}
        announcementText={storeSettings?.content.announcementText}
        whatsappNumber={storeSettings?.general.whatsappNumber}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('shop');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookVisitClick={() => setBookingOpen(true)}
        heading={storeSettings?.content.heroHeading}
        headingUrdu={storeSettings?.content.heroHeadingUrdu}
        subtitle={storeSettings?.content.heroSubtitle}
        heroImage={storeSettings?.content.heroImage}
        whatsappNumber={storeSettings?.general.whatsappNumber}
      />

      {/* E-Commerce Catalog Section */}
      <main id="shop" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        
        {/* Section Title & Kicker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4CAF50] uppercase tracking-wider mb-1.5">
              <Bird className="w-4 h-4" />
              <span>Avian Showcase & Supplies · دکان</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Montserrat'] tracking-tight">
              Featured Birds, Cages & Pet Supplies
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Hand-tamed parakeets, spacious flight aviaries, imported Prestige seed blends, and natural chew toys.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search birds, cages, feed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-md focus:outline-hidden focus:border-[#4CAF50] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs and Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-stone-200">
          
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#153D2C] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <Bird className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="font-bold text-stone-800 text-base">No items found matching your filter</p>
            <p className="text-xs text-stone-500 mt-1">
              Try searching for "cockatiel", "cage", "feed", or select "All" categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Custom Order / WhatsApp banner */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#4CAF50]/10 via-[#FF9800]/10 to-transparent border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-stone-900 font-['Montserrat']">
              Looking for a Specific Bird Mutation or Custom Aviary?
            </h4>
            <p className="text-xs text-stone-600 mt-1 max-w-xl">
              We source certified African Greys, Cockatoos, Conures, Lovebirds, and custom-weld aviary enclosures for Lahore residences.
            </p>
          </div>
          <a
            href={`https://wa.me/${storeSettings?.general.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20Bird%20Zone!%20I%20am%20looking%20for%20a%20special%20bird%20species%20or%20custom%20aviary.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs whitespace-nowrap transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Custom Inquiry on WhatsApp</span>
          </a>
        </div>

      </main>

      {/* Lahore Delivery Zones & Logistics */}
      <DeliverySection />

      {/* Avian Care Guides & Nutrition Tips */}
      <CareGuideSection />

      {/* Verified Customer Reviews */}
      <ReviewsSection />

      {/* Physical Store Location in Wapda Town */}
      <StoreLocationSection onBookVisit={() => setBookingOpen(true)} />

      {/* Footer */}
      <Footer
        onOpenProposal={() => setProposalOpen(true)}
        onOpenBooking={() => setBookingOpen(true)}
      />

      {/* Floating WhatsApp CTA */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${storeSettings?.general.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20Bird%20Zone%20Wapda%20Town!%20I%20have%20an%20inquiry%20regarding%20birds%20and%20supplies.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20ba59] transition-transform hover:scale-105 active:scale-95 group font-medium text-xs cursor-pointer"
          title="Chat with Bird Zone on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="hidden sm:inline font-bold">WhatsApp Us</span>
        </a>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        deliveryZones={deliveryZones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal with Live Backend Database Integration */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        deliveryZones={deliveryZones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* In-Store Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      {/* Technical Proposal Modal */}
      <ProposalViewerModal
        isOpen={proposalOpen}
        onClose={() => setProposalOpen(false)}
      />
    </div>
  );
}
