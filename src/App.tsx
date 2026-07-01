import React, { useState, useEffect } from 'react';
import { 
  mockProducts, 
  mockCategories, 
  mockSellers, 
  mockBanners, 
  mockOrders, 
  mockUsers 
} from './data';
import { 
  Product, 
  Category, 
  CartItem, 
  Address, 
  Order, 
  User, 
  SellerProfile, 
  Banner, 
  UserRole 
} from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import CustomerStorefront from './components/CustomerStorefront';
import SellerPortal from './components/SellerPortal';
import AdminPortal from './components/AdminPortal';

export default function App() {
  // --- Root State Management ---
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentPath, setCurrentPath] = useState<string>('#/');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain Entity Lists
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [sellers, setSellers] = useState<SellerProfile[]>(mockSellers);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Current session configurations
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('Guest');
  const [currentSellerProfile, setCurrentSellerProfile] = useState<SellerProfile | null>(mockSellers[0]);

  // Customer transactions states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-default',
      fullName: 'Johnathan Doe',
      street: '742 Cyber Link Blvd, Apt 4C',
      city: 'Neo-Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States'
    }
  ]);

  // --- Theme Toggle side-effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // --- Hash-routing Change Listeners ---
  useEffect(() => {
    const handleHashChange = () => {
      // Default empty route hashes to public storefront root
      const hash = window.location.hash || '#/';
      setCurrentPath(hash);
      
      // Ensure smooth window resetting to top on navigation triggers
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger initial on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  // --- Auth Handlers ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);

    if (user.role === 'Seller') {
      const match = sellers.find(s => s.id === 'seller-1') || sellers[0];
      setCurrentSellerProfile(match);
      handleNavigate('#/seller/dashboard');
    } else if (user.role === 'Admin') {
      handleNavigate('#/admin/dashboard');
    } else {
      handleNavigate('#/');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('Guest');
    setCart([]);
    setWishlist([]);
    alert('Logged out securely. All active token claims successfully destroyed.');
    handleNavigate('#/');
  };

  // --- Cart Actions ---
  const handleAddToCart = (product: Product, quantity: number, variants: string) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariants === variants
      );

      if (existingIdx > -1) {
        const copy = [...prevCart];
        copy[existingIdx].quantity += quantity;
        return copy;
      }

      return [...prevCart, { product, quantity, selectedVariants: variants }];
    });
  };

  const handleUpdateCartQty = (productId: string, variants: string, increment: boolean) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId && item.selectedVariants === variants) {
          const nextQty = increment ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      });
    });
  };

  const handleRemoveFromCart = (productId: string, variants: string) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.product.id === productId && item.selectedVariants === variants))
    );
  };

  // --- Wishlist Actions ---
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // --- Address Book Actions ---
  const handleAddAddress = (newAddr: Omit<Address, 'id'>) => {
    const addressWithId: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => [...prev, addressWithId]);
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  // --- Place Order Action ---
  const handlePlaceOrder = (newOrder: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const orderWithDetails: Order = {
      ...newOrder,
      id: `ord-${Date.now()}`,
      orderNumber: `APX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString()
    };

    setOrders(prev => [orderWithDetails, ...prev]);

    // Decrease product stocks accordingly
    setProducts((prevProds) => {
      return prevProds.map((prod) => {
        const matchingItem = newOrder.items.find((i) => i.productId === prod.id);
        if (matchingItem) {
          return { ...prod, stock: Math.max(0, prod.stock - matchingItem.quantity) };
        }
        return prod;
      });
    });

    // Reset shopping cart upon purchase decryption
    setCart([]);
  };

  // --- Seller Actions ---
  const handleUpdateStoreProfile = (updates: Partial<SellerProfile>) => {
    if (currentSellerProfile) {
      const updated = { ...currentSellerProfile, ...updates };
      setCurrentSellerProfile(updated);
      setSellers(prev => prev.map(s => s.id === updated.id ? updated : s));
    }
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'sellerId' | 'approvalStatus' | 'isActive'>) => {
    const freshProduct: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      sellerId: currentSellerProfile?.id || 'seller-1',
      approvalStatus: 'Draft',
      isActive: false
    };
    setProducts(prev => [freshProduct, ...prev]);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- Admin Actions ---
  const handleUpdateSellerStatus = (id: string, status: 'Active' | 'Suspended' | 'PendingApproval') => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (currentSellerProfile?.id === id) {
      setCurrentSellerProfile(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleUpdateOrderStatus = (id: string, status: 'PaymentReceived' | 'Processing' | 'Shipped' | 'Delivered') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const indexedCat: Category = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, indexedCat]);
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateBannerStatus = (id: string, isActive: boolean) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive } : b));
  };

  // --- Storefront vs Admin vs Seller layout mapping ---
  const isAuthRoute = currentPath.startsWith('#/auth');
  const isSellerRoute = currentPath.startsWith('#/seller');
  const isAdminRoute = currentPath.startsWith('#/admin');

  // Route security gate: redirects unprivileged users
  useEffect(() => {
    if (isSellerRoute && currentRole !== 'Seller') {
      alert('Security violation: Seller authentication claims required.');
      handleNavigate('#/auth/login');
    }
    if (isAdminRoute && currentRole !== 'Admin') {
      alert('Security violation: Administrative authority claims required.');
      handleNavigate('#/auth/login');
    }
  }, [currentPath, currentRole]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* GLOBAL NAVBAR HEADER */}
      <Header 
        user={currentUser}
        role={currentRole}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        onSearch={setSearchQuery}
      />

      {/* CORE CONTAINER PORTAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 select-none">
        
        {/* Route switcher */}
        {isAuthRoute && (
          <AuthPage 
            onLoginSuccess={handleLogin}
            onContinueGuest={() => handleNavigate('#/')}
            onNavigateHome={() => handleNavigate('#/')}
            theme={theme}
          />
        )}

        {isSellerRoute && currentRole === 'Seller' && (
          <SellerPortal 
            user={currentUser}
            sellerProfile={currentSellerProfile}
            products={products}
            orders={orders}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onUpdateStoreProfile={handleUpdateStoreProfile}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {isAdminRoute && currentRole === 'Admin' && (
          <AdminPortal 
            products={products}
            categories={categories}
            orders={orders}
            users={users}
            sellers={sellers}
            banners={banners}
            onNavigate={handleNavigate}
            onUpdateProduct={handleUpdateProduct}
            onUpdateSellerStatus={handleUpdateSellerStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            onUpdateBannerStatus={handleUpdateBannerStatus}
          />
        )}

        {!isAuthRoute && !isSellerRoute && !isAdminRoute && (
          <CustomerStorefront 
            products={products}
            categories={categories}
            cart={cart}
            wishlist={wishlist}
            addresses={addresses}
            orders={orders}
            currentPath={currentPath}
            searchQuery={searchQuery}
            selectedCategory="All"
            user={currentUser}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onToggleWishlist={handleToggleWishlist}
            onAddAddress={handleAddAddress}
            onRemoveAddress={handleRemoveAddress}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

      </main>

      {/* GLOBAL FOOTER */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
