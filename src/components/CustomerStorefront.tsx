import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Sparkles, 
  ArrowRight, 
  Star, 
  ChevronRight, 
  Filter, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  ChevronLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Product, Category, CartItem, Address, Order, User } from '../types';
import ThreeStage from './ThreeStage';

interface CustomerStorefrontProps {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  addresses: Address[];
  orders: Order[];
  currentPath: string;
  searchQuery: string;
  selectedCategory: string;
  user: User | null;
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product, quantity: number, variants: string) => void;
  onUpdateCartQty: (productId: string, variants: string, increment: boolean) => void;
  onRemoveFromCart: (productId: string, variants: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddAddress: (address: Omit<Address, 'id'>) => void;
  onRemoveAddress: (id: string) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => void;
}

export default function CustomerStorefront({
  products,
  categories,
  cart,
  wishlist,
  addresses,
  orders,
  currentPath,
  searchQuery,
  selectedCategory,
  user,
  onNavigate,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onToggleWishlist,
  onAddAddress,
  onRemoveAddress,
  onPlaceOrder
}: CustomerStorefrontProps) {
  
  // Detail Page state
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [detailQty, setDetailQty] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showThreeD, setShowThreeD] = useState(false);

  // Listing Filter states
  const [listCategory, setListCategory] = useState<string>('All');
  const [listPriceMax, setListPriceMax] = useState<number>(1500);

  // Checkout Form states
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'upi' | 'cod'>('credit');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // flat discount
  const [promoApplied, setPromoApplied] = useState(false);

  // Address add visibility
  const [addingAddress, setAddingAddress] = useState(false);

  // Subtotals
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartShipping = cartSubtotal > 0 ? 15.00 : 0;
  const cartTotal = Math.max(0, cartSubtotal + cartShipping - promoDiscount);

  // Parse path to route
  React.useEffect(() => {
    if (currentPath.startsWith('#/products/')) {
      const slug = currentPath.substring('#/products/'.length);
      const prod = products.find(p => p.slug === slug);
      if (prod) {
        setActiveProduct(prod);
        setActiveSlug(slug);
        setActiveImageIdx(0);
        setDetailQty(1);
        setShowThreeD(false);
        // Set default variants
        const defaults: Record<string, string> = {};
        prod.variants.forEach(v => {
          if (v.values.length > 0) defaults[v.name] = v.values[0];
        });
        setSelectedVariants(defaults);
      }
    } else {
      setActiveProduct(null);
      setActiveSlug(null);
    }
  }, [currentPath, products]);

  // Apply simulated promo code
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'APEX20') {
      setPromoDiscount(20.00);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Use APEX20 for $20 off!');
    }
  };

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.fullName || !newAddressForm.street || !newAddressForm.city) return;
    onAddAddress(newAddressForm);
    setNewAddressForm({
      fullName: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States'
    });
    setAddingAddress(false);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigate(`#/auth/login?returnUrl=#/checkout`);
      return;
    }

    const chosenAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    if (!chosenAddress) {
      alert('Please configure a shipping address before completing checkouts.');
      return;
    }

    // Process placing order
    onPlaceOrder({
      customerId: user.id,
      customerName: user.name,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        selectedVariants: item.selectedVariants,
        image: item.product.image,
        sellerId: item.product.sellerId
      })),
      subtotal: cartSubtotal,
      shippingFee: cartShipping,
      total: cartTotal,
      status: 'PaymentReceived',
      paymentMethod: paymentMethod === 'credit' ? 'Credit Card (Simulated)' : paymentMethod === 'upi' ? 'UPI (Simulated)' : 'Cash on Delivery',
      shippingAddress: chosenAddress
    });

    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
    alert('Purchase successfully decrypted! Simulated Order has been synchronized securely.');
    onNavigate('#/account/orders');
  };

  // Helper filter for list view
  const categoryFilteredProducts = products.filter(p => p.isActive && p.approvalStatus === 'Approved')
    .filter(p => listCategory === 'All' || p.category === listCategory)
    .filter(p => p.price <= listPriceMax)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-16rem)]">
      
      {/* 1. HOME VIEW */}
      {(currentPath === '#/' || currentPath === '' || currentPath === '#') && !activeSlug && (
        <div className="flex flex-col gap-12 pb-12">
          
          {/* HERO BANNER SLIDESHOW / CAROUSEL MOCK */}
          <div className="w-full bg-slate-900 text-white rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10" />
            
            {/* Background premium photo */}
            <img 
              src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1200" 
              alt="Promo Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />

            {/* Hero content details */}
            <div className="relative z-20 px-8 py-16 sm:py-24 sm:px-16 max-w-2xl flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300">SECURED MOCK PLATFORM ACTIVE</span>
              </div>
              
              <h2 className="text-4xl sm:text-6xl font-black font-sans tracking-tight leading-none text-slate-100">
                Experience Objects in <span className="text-indigo-400">Dynamic 3D</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Browse our premium high-contrast catalog containing authentic neural tech modules, kinetic sneakers, and aerospace hardshell composites. Checkouts are fully operational.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => onNavigate('#/products')} 
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const firstProd = products.find(p => p.isActive);
                    if (firstProd) onNavigate(`#/products/${firstProd.slug}`);
                  }}
                  className="px-6 py-3 border border-slate-700 bg-slate-900/60 text-white font-semibold rounded-xl text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  View Featured 3D Model
                </button>
              </div>
            </div>
          </div>

          {/* TRUST BADGING AREA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Express Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-1">Guaranteed global dispatch within 24-48 hours with full secure telemetry.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Flexible Returns</h4>
                <p className="text-[11px] text-slate-500 mt-1">No-hassle returns within 30 days of delivery, backed by platform guarantees.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Encrypted Transactions</h4>
                <p className="text-[11px] text-slate-500 mt-1">All payment parameters are verified server-side through cryptographically locked ports.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Verified Merchants</h4>
                <p className="text-[11px] text-slate-500 mt-1">Sellers undergo rigorous admin KYC audits before submissions go live.</p>
              </div>
            </div>
          </div>

          {/* FEATURED CATEGORIES SECTION */}
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50">Select Curated Categories</h3>
                <p className="text-xs text-slate-500 mt-1">Filter premium objects manufactured by authenticated partner brands.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => {
                    setListCategory(cat.name);
                    onNavigate('#/products');
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between h-36"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">{cat.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC HOT DEALS & OFFERS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 p-8 bg-gradient-to-br from-rose-500 to-amber-500 rounded-3xl text-white flex flex-col justify-between h-80 lg:h-auto">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-white/20 px-2 py-1 rounded w-fit">FLASH COOLDOWN ACTIVE</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-4">APEX FLASH DISCOUNT</h3>
                <p className="text-xs mt-2 text-rose-50 opacity-90 leading-relaxed">
                  Apply coupon code <span className="font-mono font-bold bg-black/20 px-1.5 py-0.5 rounded">APEX20</span> at payment review checkout to deduct $20.00 instantly from any order subtotal!
                </p>
              </div>
              <button 
                onClick={() => onNavigate('#/products')}
                className="w-full py-2.5 bg-white text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Claim Flash Offer
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FEATURED / TRENDING PRODUCTS LISTING */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-black tracking-tight">Trending Premium Items</h3>
                <p className="text-xs text-slate-500 mt-1">High demand objects mapped to live visual 3D previews.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.filter(p => p.isActive && p.isFeatured && p.approvalStatus === 'Approved').slice(0, 2).map((p) => (
                  <div 
                    key={p.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col justify-between"
                  >
                    <div className="aspect-video bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center relative cursor-pointer" onClick={() => onNavigate(`#/products/${p.slug}`)}>
                      <img src={p.image} alt={p.name} className="h-full object-contain max-h-[140px] drop-shadow-md group-hover:scale-105 transition-transform" />
                      {p.discountPrice && (
                        <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wider shadow">
                          Discount
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{p.category}</span>
                        <h4 className="text-sm font-bold truncate mt-0.5 text-slate-900 dark:text-slate-100">{p.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 h-8">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                        <div>
                          {p.discountPrice ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs line-through opacity-50 font-mono">${p.price}</span>
                              <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">${p.discountPrice}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-black font-mono">${p.price}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => onNavigate(`#/products/${p.slug}`)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          View 3D Specs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. ALL PRODUCTS LISTING VIEW */}
      {currentPath === '#/products' && !activeSlug && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/* SIDEBAR FILTERS */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Filter Catalog
              </h3>

              {/* Category Filter */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Curated Categories</label>
                <div className="flex flex-col gap-1.5 text-xs">
                  <button 
                    onClick={() => setListCategory('All')}
                    className={`text-left py-1.5 px-2.5 rounded-lg transition-all ${listCategory === 'All' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setListCategory(c.name)}
                      className={`text-left py-1.5 px-2.5 rounded-lg transition-all ${listCategory === c.name ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter Slider */}
              <div className="space-y-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label>Max Price</label>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">${listPriceMax}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1500" 
                  step="50" 
                  value={listPriceMax}
                  onChange={(e) => setListPriceMax(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Simulated reset */}
              <button
                onClick={() => {
                  setListCategory('All');
                  setListPriceMax(1500);
                }}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl mt-6 border border-slate-200 dark:border-slate-800/80 cursor-pointer"
              >
                Reset Filter Settings
              </button>
            </div>
          </div>

          {/* CATALOG GRID */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black tracking-tight">Curated Store Catalog</h3>
                <p className="text-xs text-slate-500 mt-0.5">Found {categoryFilteredProducts.length} approved products.</p>
              </div>
            </div>

            {categoryFilteredProducts.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No Match Found</h4>
                <p className="text-xs text-slate-400 mt-2">Try adjusting filter parameters or search queries.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryFilteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col justify-between"
                  >
                    <div 
                      className="aspect-video bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center relative cursor-pointer"
                      onClick={() => onNavigate(`#/products/${p.slug}`)}
                    >
                      <img src={p.image} alt={p.name} className="h-full object-contain max-h-[140px] drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
                      {p.discountPrice && (
                        <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded shadow">
                          Offer
                        </span>
                      )}
                      
                      {/* Wishlist overlay */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 shadow hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-slate-400 uppercase">{p.category}</span>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span className="text-[10px] font-bold font-mono">{p.rating}</span>
                          </div>
                        </div>
                        <h4 className="text-sm font-bold truncate mt-1 text-slate-900 dark:text-slate-100">{p.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 h-8">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3">
                        <div>
                          {p.discountPrice ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs line-through opacity-40 font-mono">${p.price}</span>
                              <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">${p.discountPrice}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-black font-mono">${p.price}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => onNavigate(`#/products/${p.slug}`)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          View 3D
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. PRODUCT DETAILS VIEW */}
      {activeProduct && (
        <div className="flex flex-col gap-8 pb-12">
          {/* Back breadcrumb */}
          <button 
            onClick={() => onNavigate('#/products')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 w-fit cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Catalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* GALLERY PANEL / WEBGL TOGGLE */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative shadow-md h-[380px] flex items-center justify-center">
                
                {/* Lazy 3D viewer vs standard static display */}
                {showThreeD ? (
                  <ThreeStage modelColor="#6D5DFB" />
                ) : (
                  <img 
                    src={activeProduct.fallbackImages[activeImageIdx] || activeProduct.image} 
                    alt={activeProduct.name} 
                    className="max-h-[280px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* 3D Action overlay button */}
                <button
                  onClick={() => setShowThreeD(!showThreeD)}
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono shadow-md border transition-all flex items-center gap-1.5 cursor-pointer ${showThreeD ? 'bg-indigo-600 border-indigo-500 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showThreeD ? 'Exit interactive 3D' : 'Spin interactive 3D Model'}
                </button>
              </div>

              {/* Gallery selector thumbnails */}
              {!showThreeD && activeProduct.fallbackImages.length > 0 && (
                <div className="flex gap-2">
                  {activeProduct.fallbackImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-16 rounded-xl border-2 p-1.5 bg-white dark:bg-slate-900 transition-all cursor-pointer ${activeImageIdx === idx ? 'border-indigo-600 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'}`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT BUY CONTROLS */}
            <div className="lg:col-span-6 flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <div>
                <span className="text-[10px] font-mono tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-500 dark:text-slate-400 uppercase font-bold">{activeProduct.category}</span>
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight mt-3 text-slate-900 dark:text-slate-50">{activeProduct.name}</h2>
                
                {/* rating stars */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(activeProduct.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono">{activeProduct.rating} Rating</span>
                  <span className="text-xs text-slate-400">• Verified Merchant Store</span>
                </div>
              </div>

              {/* pricing */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                {activeProduct.discountPrice ? (
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">${activeProduct.discountPrice}</span>
                    <span className="text-sm line-through opacity-45 font-mono">${activeProduct.price}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-black font-mono">${activeProduct.price}</span>
                )}
                <span className="text-[10px] text-slate-500 block mt-1">Inclusive of state vat and secure processing taxes.</span>
              </div>

              {/* description */}
              <p className="text-xs lg:text-sm text-slate-500 leading-relaxed">
                {activeProduct.description}
              </p>

              {/* interactive variants */}
              {activeProduct.variants.length > 0 && (
                <div className="space-y-4">
                  {activeProduct.variants.map((v) => (
                    <div key={v.name} className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{v.name}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {v.values.map((val) => (
                          <button
                            key={val}
                            onClick={() => setSelectedVariants({ ...selectedVariants, [v.name]: val })}
                            className={`px-3 py-1.5 text-xs rounded-xl font-semibold border transition-all cursor-pointer ${selectedVariants[v.name] === val ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/15' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* quantity and buy buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Verify Order Quantity:</span>
                  <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-xl">
                    <button 
                      onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                      className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono">{detailQty}</span>
                    <button 
                      onClick={() => setDetailQty(Math.min(activeProduct.stock, detailQty + 1))}
                      className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const variantStr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
                      onAddToCart(activeProduct, detailQty, variantStr || 'Default');
                      alert('Item added into the secure cart!');
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      const variantStr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
                      onAddToCart(activeProduct, detailQty, variantStr || 'Default');
                      onNavigate('#/cart');
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4. SHOPPING CART VIEW */}
      {currentPath === '#/cart' && (
        <div className="flex flex-col gap-6 pb-12">
          <div>
            <h3 className="text-xl font-black tracking-tight">Review Shopping Cart</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track and modify items queued for validation.</p>
          </div>

          {cart.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
              <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 mb-4 animate-bounce" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Your Cart is Empty</h4>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">Browse our futuristic catalog and claim premium sneakers or neural chips first.</p>
              <button 
                onClick={() => onNavigate('#/products')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-xl text-xs mt-6 cursor-pointer"
              >
                Start Browsing Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ITEM TABLE LIST */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {cart.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold truncate text-slate-900 dark:text-slate-100">{item.product.name}</h4>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{item.selectedVariants}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">Price: ${item.product.price}</span>
                      </div>
                    </div>

                    {/* modifiers */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={() => onUpdateCartQty(item.product.id, item.selectedVariants, false)}
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateCartQty(item.product.id, item.selectedVariants, true)}
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* item subtotal */}
                      <span className="text-xs font-black font-mono w-16 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* remove button */}
                      <button 
                        onClick={() => onRemoveFromCart(item.product.id, item.selectedVariants)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* BILL SUMMARY */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 border-slate-100 dark:border-slate-800/80">Order Summary</h4>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cart Subtotal</span>
                    <span className="font-mono font-bold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telemetry Shipping</span>
                    <span className="font-mono font-bold">${cartShipping.toFixed(2)}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-rose-500 font-bold">
                      <span>Promo Applied</span>
                      <span className="font-mono">-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-sm font-black">
                    <span>Grand Total</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo apply field */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">Apply Promo Coupon</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. APEX20" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="px-4 py-1.5 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-800 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Tip: Try APEX20 for $20 flat off!</span>
                </div>

                <button 
                  onClick={() => onNavigate('#/checkout')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest mt-6 cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15"
                >
                  Proceed to Secure Checkout
                </button>

              </div>

            </div>
          )}
        </div>
      )}

      {/* 5. CHECKOUT VIEW */}
      {currentPath === '#/checkout' && (
        <div className="flex flex-col gap-6 pb-12">
          <div>
            <h3 className="text-xl font-black tracking-tight">Secure checkout Terminal</h3>
            <p className="text-xs text-slate-500 mt-0.5">Please review shipping addresses and verify simulated payment channels.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* CHECKOUT STEPPERS */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* SHIPPING ADRESS SECTION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" /> 1. Shipping Address Selection
                  </h4>
                  <button 
                    onClick={() => setAddingAddress(!addingAddress)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {addingAddress ? 'Cancel' : '+ Add New Address'}
                  </button>
                </div>

                {addingAddress ? (
                  <form onSubmit={handleAddNewAddressSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Jane Doe"
                          value={newAddressForm.fullName}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 142 Cyber Square, Level 4"
                          value={newAddressForm.street}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">City</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Neo-Boston"
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">State/Province</label>
                        <input 
                          type="text" 
                          required
                          placeholder="MA"
                          value={newAddressForm.state}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          required
                          placeholder="02108"
                          value={newAddressForm.postalCode}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, postalCode: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Country</label>
                        <input 
                          type="text" 
                          required
                          placeholder="United States"
                          value={newAddressForm.country}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, country: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl cursor-pointer hover:bg-indigo-500"
                    >
                      Save Secure Address
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {addresses.length === 0 ? (
                      <div className="p-4 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs border border-amber-500/20">
                        No shipping address configured. Please add an address to continue.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {addresses.map((addr) => (
                          <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 relative ${selectedAddressId === addr.id ? 'border-indigo-600 bg-indigo-50/15 dark:bg-indigo-950/5' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                          >
                            <input 
                              type="radio" 
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="accent-indigo-600 mt-1"
                            />
                            <div>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">{addr.fullName}</h5>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                              </p>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveAddress(addr.id);
                              }}
                              className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-500 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PAYMENT OPTION SECTION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" /> 2. Unified Payment Channel
                </h4>

                <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`py-2 rounded-lg font-bold transition-all ${paymentMethod === 'credit' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-65'}`}
                  >
                    💳 Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded-lg font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-65'}`}
                  >
                    ⚡ UPI Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 rounded-lg font-bold transition-all ${paymentMethod === 'cod' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-65'}`}
                  >
                    📦 Cash on Delivery
                  </button>
                </div>

                {paymentMethod === 'credit' && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="•••• •••• •••• 4242" 
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="Jane Doe" 
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Expiration Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Secure CVC</label>
                        <input 
                          type="password" 
                          placeholder="•••" 
                          value={cardInfo.cvc}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="pt-2 text-xs opacity-80 leading-relaxed text-slate-500 space-y-2">
                    <p>Provide your virtual payment address claim (VPA) below:</p>
                    <input 
                      type="text" 
                      placeholder="e.g. customer@okaxis" 
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="pt-2 text-xs opacity-80 leading-relaxed text-slate-500">
                    <p>A simulated flat handling surcharge of <strong>$5.00</strong> will apply on delivery verifying logistics safety.</p>
                  </div>
                )}

              </div>

            </div>

            {/* CHECKOUT BILL CARD SUMMARY */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 border-slate-100 dark:border-slate-800/80">Cart Verification Summary</h4>
              
              <div className="space-y-3 max-h-40 overflow-y-auto mb-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="truncate pr-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{item.product.name}</span>
                      <span className="text-[9px] opacity-60">{item.selectedVariants} (Qty: {item.quantity})</span>
                    </div>
                    <span className="font-mono font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-mono font-bold">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-mono font-bold">${cartShipping.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>APEX20 Promo Applied</span>
                    <span className="font-mono">-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-slate-500">
                    <span>COD Surcharge</span>
                    <span className="font-mono font-bold">$5.00</span>
                  </div>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-sm font-black">
                  <span>Grand Total</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    ${(cartTotal + (paymentMethod === 'cod' ? 5 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-505 text-white font-bold rounded-xl text-xs uppercase tracking-widest mt-4 cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15"
              >
                Place Secure Order (${(cartTotal + (paymentMethod === 'cod' ? 5 : 0)).toFixed(2)})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. ACCOUNT PORTAL (Sub-routes included) */}
      {currentPath.startsWith('#/account') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/* SIDER TAB CONTROL */}
          <div className="lg:col-span-3 flex flex-col gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Account Control Shell</h4>
            <button
              onClick={() => onNavigate('#/account')}
              className={`text-left text-xs font-semibold py-2 px-3.5 rounded-xl transition-all cursor-pointer ${currentPath === '#/account' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              👤 Profile Overview
            </button>
            <button
              onClick={() => onNavigate('#/account/orders')}
              className={`text-left text-xs font-semibold py-2 px-3.5 rounded-xl transition-all cursor-pointer ${currentPath === '#/account/orders' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              📦 Order Histories
            </button>
            <button
              onClick={() => onNavigate('#/account/wishlist')}
              className={`text-left text-xs font-semibold py-2 px-3.5 rounded-xl transition-all cursor-pointer ${currentPath === '#/account/wishlist' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              ❤️ Saved Wishlists
            </button>
            <button
              onClick={() => onNavigate('#/account/addresses')}
              className={`text-left text-xs font-semibold py-2 px-3.5 rounded-xl transition-all cursor-pointer ${currentPath === '#/account/addresses' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              📍 Shipping Addresses
            </button>
          </div>

          {/* ACTIVE ACCOUNT CONTENT PORTAL */}
          <div className="lg:col-span-9 flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm">
            
            {/* SUB-VIEW A: CORE PROFILE OVERVIEW */}
            {currentPath === '#/account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Security Profile</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure secure credential claims and contact variables.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border">
                    <span className="opacity-60 block font-mono text-[10px] uppercase">Profile Name</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user?.name || 'Customer Guest'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border">
                    <span className="opacity-60 block font-mono text-[10px] uppercase">Registered Email</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/20 dark:bg-indigo-950/10 border border-dashed text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Identity Status: Decoupled JWT Verified</span>
                  </div>
                  <p className="opacity-75 leading-relaxed">
                    This account holds active claims mapped directly in simulated client states. Role: <strong>{user?.role}</strong>. Secure sessions automatically lock in 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* SUB-VIEW B: ORDER HISTORIES */}
            {currentPath === '#/account/orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Synchronized Order Histories</h3>
                  <p className="text-xs text-slate-400 mt-1">Review active transaction tracking and logistic states.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 text-center border border-dashed rounded-2xl text-slate-400">
                    No orders successfully processed yet. Continue to catalog to checkout.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 bg-slate-50/30 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs border-b pb-3 border-slate-200 dark:border-slate-800/60">
                          <div>
                            <span className="font-mono text-[10px] text-slate-400 uppercase">Order Claim Number</span>
                            <h5 className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{order.orderNumber}</h5>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-slate-400 uppercase">Verification Date</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-300">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-slate-400 uppercase flex items-center gap-1">Status Tracking</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono text-[9px] uppercase font-bold mt-1 inline-block">
                              ● {order.status}
                            </span>
                          </div>
                        </div>

                        {/* order items list */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-950 p-1 flex items-center justify-center">
                                  <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                                </div>
                                <div className="truncate max-w-[200px] sm:max-w-[400px]">
                                  <span className="font-bold block truncate">{item.productName}</span>
                                  <span className="text-[9px] opacity-60 font-mono">{item.selectedVariants} (Qty: {item.quantity})</span>
                                </div>
                              </div>
                              <span className="font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* sum */}
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                          <span className="opacity-60 font-medium">Channel: {order.paymentMethod}</span>
                          <span className="font-semibold">
                            Paid Grand Total: <strong className="font-mono text-slate-900 dark:text-slate-100 text-sm ml-1">${order.total.toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW C: SAVED WISHLIST */}
            {currentPath === '#/account/wishlist' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Saved Wishlist Objects</h3>
                  <p className="text-xs text-slate-400 mt-1">Review items you bookmarked for later consideration.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-12 text-center border border-dashed rounded-2xl text-slate-400">
                    No items saved. Click heart icons on products to add.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.filter(p => wishlist.includes(p.id)).map((p) => (
                      <div 
                        key={p.id} 
                        className="p-4 border rounded-xl flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(`#/products/${p.slug}`)}>
                          <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-950 p-1 flex items-center justify-center">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-xs truncate block max-w-[150px]">{p.name}</span>
                            <span className="font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 block">${p.price}</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => onNavigate(`#/products/${p.slug}`)}
                            className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold cursor-pointer"
                            title="View product details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onToggleWishlist(p.id)}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-slate-400 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW D: ADDRESS BOOK */}
            {currentPath === '#/account/addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Saved Addresses</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage delivery locations verified against security protocols.</p>
                  </div>
                  <button 
                    onClick={() => setAddingAddress(!addingAddress)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs rounded-xl cursor-pointer"
                  >
                    {addingAddress ? 'Cancel' : '+ Add Address'}
                  </button>
                </div>

                {addingAddress ? (
                  <form onSubmit={handleAddNewAddressSubmit} className="space-y-3.5 border-b pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Jane Doe"
                          value={newAddressForm.fullName}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 142 Cyber Square, Level 4"
                          value={newAddressForm.street}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">City</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Neo-Boston"
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">State/Province</label>
                        <input 
                          type="text" 
                          required
                          placeholder="MA"
                          value={newAddressForm.state}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          required
                          placeholder="02108"
                          value={newAddressForm.postalCode}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, postalCode: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-1">Country</label>
                        <input 
                          type="text" 
                          required
                          placeholder="United States"
                          value={newAddressForm.country}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, country: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-850 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl cursor-pointer hover:bg-indigo-505"
                    >
                      Save Secure Address
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-4 border rounded-xl flex justify-between items-start gap-4 bg-slate-50/50">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">{addr.fullName}</h5>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveAddress(addr.id)}
                          className="p-1.5 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-lg cursor-pointer"
                          title="Remove Location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
