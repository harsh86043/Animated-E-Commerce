import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Search, 
  User as UserIcon, 
  Heart, 
  MapPin, 
  LogOut, 
  Moon, 
  Sun, 
  ShieldAlert, 
  Store,
  Compass,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  user: User | null;
  role: UserRole;
  cartCount: number;
  wishlistCount: number;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSearch: (query: string) => void;
}

export default function Header({
  user,
  role,
  cartCount,
  wishlistCount,
  currentPath,
  onNavigate,
  onLogout,
  theme,
  onToggleTheme,
  onSearch
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('#/products');
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <>
      {/* DESKTOP/GENERAL STICKY HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* 1. BRAND LOGO */}
          <div 
            onClick={() => onNavigate('#/')} 
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-slate-50 leading-none">APEX</h1>
              <p className="text-[10px] font-mono tracking-wider opacity-60 mt-0.5">MARKETPLACE</p>
            </div>
          </div>

          {/* 2. LIVE SEARCH BAR */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-md relative hidden md:block"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search premium apparel, bio-chips, kinetic gear..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch} 
                  className="absolute right-3 top-2.5 text-xs opacity-50 hover:opacity-100 font-mono text-slate-400"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* 3. CORE STOREFRONT NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => onNavigate('#/')} 
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer ${currentPath === '#/' ? 'text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-4' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('#/products')} 
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer ${currentPath === '#/products' ? 'text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-4' : ''}`}
            >
              All Catalog
            </button>
          </nav>

          {/* 4. DYNAMIC ROLE-BASED CONTROLS */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* THEME TOGGLE */}
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
            </button>

            {/* WISHLIST (Only active for Customers/Sellers) */}
            {(role === 'Guest' || role === 'Customer') && (
              <button 
                onClick={() => onNavigate('#/account/wishlist')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer relative"
                title="Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center scale-90">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* CART (Always visible for storefront) */}
            {(role === 'Guest' || role === 'Customer') && (
              <button 
                onClick={() => onNavigate('#/cart')}
                className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-all cursor-pointer relative"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* SHORTCUTS FOR ELEVATED ROLES */}
            {role === 'Seller' && (
              <button 
                onClick={() => onNavigate('#/seller/dashboard')}
                className="px-3.5 py-1.5 hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                Seller Portal
              </button>
            )}

            {role === 'Admin' && (
              <button 
                onClick={() => onNavigate('#/admin/dashboard')}
                className="px-3.5 py-1.5 hidden sm:flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Suite
              </button>
            )}

            {/* AUTH ACCOUNT BUTTON */}
            {role === 'Guest' ? (
              <button
                onClick={() => onNavigate('#/auth/login')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {/* User avatar indicator */}
                <button
                  onClick={() => {
                    if (role === 'Customer') onNavigate('#/account');
                    else if (role === 'Seller') onNavigate('#/seller/dashboard');
                    else if (role === 'Admin') onNavigate('#/admin/dashboard');
                  }}
                  className="flex items-center gap-1.5 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium cursor-pointer"
                >
                  <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[80px] truncate hidden sm:inline text-slate-700 dark:text-slate-300">
                    {user?.name.split(' ')[0]}
                  </span>
                </button>

                {/* Direct logout button */}
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Sign Out Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* MOBILE HAMBURGER (Strictly layout helper) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE POP-OVER NAVIGATION MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-4 animate-fadeIn relative z-35">
          {/* SEARCH BAR FOR MOBILE */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 opacity-40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full pl-9 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
            />
          </form>

          {/* MENUS */}
          <div className="flex flex-col gap-2 font-medium text-sm">
            <button 
              onClick={() => { onNavigate('#/'); setMobileMenuOpen(false); }} 
              className={`py-2 px-3 text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 ${currentPath === '#/' ? 'bg-indigo-50/50 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400' : ''}`}
            >
              <Compass className="w-4 h-4" /> Storefront Home
            </button>
            <button 
              onClick={() => { onNavigate('#/products'); setMobileMenuOpen(false); }} 
              className={`py-2 px-3 text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 ${currentPath === '#/products' ? 'bg-indigo-50/50 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400' : ''}`}
            >
              <ShoppingBag className="w-4 h-4" /> All Products
            </button>

            {role === 'Customer' && (
              <>
                <button 
                  onClick={() => { onNavigate('#/account'); setMobileMenuOpen(false); }} 
                  className="py-2 px-3 text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> Personal Account
                </button>
                <button 
                  onClick={() => { onNavigate('#/account/orders'); setMobileMenuOpen(false); }} 
                  className="py-2 px-3 text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Order History
                </button>
              </>
            )}

            {/* ELEVATED ROLES REDIRECTS */}
            {role === 'Seller' && (
              <button 
                onClick={() => { onNavigate('#/seller/dashboard'); setMobileMenuOpen(false); }} 
                className="py-2 px-3 text-left rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold flex items-center gap-2"
              >
                <Store className="w-4 h-4" /> Seller Portal Dashboard
              </button>
            )}

            {role === 'Admin' && (
              <button 
                onClick={() => { onNavigate('#/admin/dashboard'); setMobileMenuOpen(false); }} 
                className="py-2 px-3 text-left rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 font-bold flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Admin Control Suite
              </button>
            )}

            {role !== 'Guest' && (
              <button 
                onClick={() => { onLogout(); setMobileMenuOpen(false); }} 
                className="py-2 px-3 text-left rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 text-slate-500 flex items-center gap-2 border-t border-slate-100 dark:border-slate-900 mt-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out Account
              </button>
            )}
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-45 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around md:hidden shadow-lg shadow-black/10">
        <button 
          onClick={() => onNavigate('#/')} 
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold cursor-pointer ${currentPath === '#/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button 
          onClick={() => onNavigate('#/products')} 
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold cursor-pointer ${currentPath.startsWith('#/products') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Catalog</span>
        </button>
        <button 
          onClick={() => onNavigate('#/cart')} 
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold cursor-pointer relative ${currentPath === '#/cart' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 bg-indigo-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => {
            if (role === 'Guest') onNavigate('#/auth/login');
            else if (role === 'Customer') onNavigate('#/account');
            else if (role === 'Seller') onNavigate('#/seller/dashboard');
            else if (role === 'Admin') onNavigate('#/admin/dashboard');
          }} 
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold cursor-pointer ${currentPath.startsWith('#/account') || currentPath.startsWith('#/seller') || currentPath.startsWith('#/admin') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span>{role === 'Guest' ? 'Sign In' : 'Portal'}</span>
        </button>
      </div>
    </>
  );
}
