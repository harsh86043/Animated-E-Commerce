import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  Sliders, 
  ClipboardList, 
  Wallet, 
  RefreshCcw, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Ban,
  ArrowUpRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { Product, Order, SellerProfile, User } from '../types';

interface SellerPortalProps {
  user: User | null;
  sellerProfile: SellerProfile | null;
  products: Product[];
  orders: Order[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onUpdateStoreProfile: (profile: Partial<SellerProfile>) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'sellerId' | 'approvalStatus' | 'isActive'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function SellerPortal({
  user,
  sellerProfile,
  products,
  orders,
  currentPath,
  onNavigate,
  onUpdateStoreProfile,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}: SellerPortalProps) {
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'profile' | 'payouts' | 'returns'>('dashboard');

  // New product form visibility and inputs
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: undefined as number | undefined,
    stock: 10,
    category: 'Cyberwear & Apparel',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    variantsStr: 'Size: S, M, L; Neon Filament: Cyber Cyan, Stealth Orange'
  });

  // Filter seller's products and orders
  const sellerId = sellerProfile?.id || 'seller-1';
  const sellerProducts = products.filter(p => p.sellerId === sellerId);
  
  // A seller order is any order that contains one or more items of this seller
  const sellerOrders = orders.filter(o => o.items.some(i => i.sellerId === sellerId));

  // Compute metrics
  const totalSalesVal = sellerOrders.reduce((sum, o) => {
    const sellerItems = o.items.filter(i => i.sellerId === sellerId);
    const orderSellerSum = sellerItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    return sum + orderSellerSum;
  }, 0);

  const pendingShipmentsCount = sellerOrders.filter(o => o.status === 'Processing' || o.status === 'PaymentReceived').length;

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || productForm.price <= 0) return;

    // Parse variants
    const variants = productForm.variantsStr.split(';').filter(Boolean).map(chunk => {
      const [vName, vals] = chunk.split(':');
      return {
        name: vName.trim(),
        values: vals ? vals.split(',').map(s => s.trim()) : []
      };
    });

    if (editingProduct) {
      // Reverts previously rejected items back to Draft automatically as specified in docs
      const nextStatus = editingProduct.approvalStatus === 'Rejected' ? 'Draft' : editingProduct.approvalStatus;
      onUpdateProduct(editingProduct.id, {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        discountPrice: productForm.discountPrice || undefined,
        stock: productForm.stock,
        category: productForm.category,
        image: productForm.image,
        variants,
        approvalStatus: nextStatus as any,
        isActive: nextStatus === 'Approved'
      });
      alert('Product changes submitted! (reverted to Draft if previously Rejected)');
      setEditingProduct(null);
    } else {
      onAddProduct({
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: productForm.description,
        price: productForm.price,
        discountPrice: productForm.discountPrice || undefined,
        rating: 5.0,
        stock: productForm.stock,
        isFeatured: false,
        category: productForm.category,
        image: productForm.image,
        fallbackImages: [],
        variants
      });
      alert('New product saved in Draft status. Submit for review when ready!');
    }

    setAddingProduct(false);
    // Reset form
    setProductForm({
      name: '',
      description: '',
      price: 0,
      discountPrice: undefined,
      stock: 10,
      category: 'Cyberwear & Apparel',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      variantsStr: 'Size: S, M, L; Neon Filament: Cyber Cyan, Stealth Orange'
    });
  };

  const handleEditTrigger = (prod: Product) => {
    setEditingProduct(prod);
    const varStr = prod.variants.map(v => `${v.name}: ${v.values.join(', ')}`).join('; ');
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice,
      stock: prod.stock,
      category: prod.category,
      image: prod.image,
      variantsStr: varStr
    });
    setAddingProduct(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 font-sans items-start">
      
      {/* SELLER CONTROL SIDEBAR */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3 shadow-sm shrink-0">
        <div className="flex items-center gap-3 border-b pb-4 border-slate-100 dark:border-slate-800/80 px-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">
              {sellerProfile?.storeName || 'My Store'}
            </h4>
            <span className="text-[10px] font-mono tracking-widest text-emerald-500 font-bold uppercase block mt-0.5">
              ● MERCHANT PORTAL
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 mt-2 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('dashboard'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Store className="w-4 h-4" /> Store Dashboard
          </button>
          <button
            onClick={() => { setActiveTab('products'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'products' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Package className="w-4 h-4" /> Products Catalog
          </button>
          <button
            onClick={() => { setActiveTab('inventory'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'inventory' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Sliders className="w-4 h-4" /> Stock & Inventory
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'orders' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <ClipboardList className="w-4 h-4" /> Fulfilment Orders
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'profile' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Sliders className="w-4 h-4" /> Update Store Profile
          </button>
          <button
            onClick={() => { setActiveTab('payouts'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'payouts' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Wallet className="w-4 h-4" /> Payout Accounts
          </button>
          <button
            onClick={() => { setActiveTab('returns'); setAddingProduct(false); }}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'returns' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <RefreshCcw className="w-4 h-4" /> Merchant Returns
          </button>
        </nav>
      </div>

      {/* ACTIVE DISPLAY PANEL */}
      <div className="lg:col-span-9 flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
        
        {/* VIEW 1: MERCHANT DASHBOARD */}
        {activeTab === 'dashboard' && !addingProduct && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">Merchant Telemetry Overview</h3>
              <p className="text-xs text-slate-500 mt-1">Review active store metrics and platform approval records.</p>
            </div>

            {/* Seller profile pending kyc notice */}
            {sellerProfile?.status === 'PendingApproval' && (
              <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <h5 className="font-bold">Store Registration Pending KYC Approval</h5>
                  <p className="opacity-95 leading-relaxed mt-1">
                    Your storefront profile is currently being reviewed by our administration team. Newly added items cannot be published live until your profile undergoes successful approval.
                  </p>
                </div>
              </div>
            )}

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">TOTAL ACCOUNT SALES</span>
                <span className="font-mono font-black text-lg text-slate-800 dark:text-white">${totalSalesVal.toFixed(2)}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">ACTIVE CATALOG COUNT</span>
                <span className="font-mono font-black text-lg text-slate-800 dark:text-white">{sellerProducts.length} Products</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">PENDING SHIPMENTS</span>
                <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">{pendingShipmentsCount} Orders</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">CUSTOMER FEEDBACK</span>
                <span className="font-mono font-black text-lg text-amber-500">★ {sellerProfile?.rating || '5.0'} Avg</span>
              </div>
            </div>

            {/* Recent Seller items and status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Moderation Status Tracking</h4>
                <button 
                  onClick={() => setActiveTab('products')} 
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Manage Catalogue
                </button>
              </div>

              <div className="space-y-3.5">
                {sellerProducts.slice(0, 3).map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border bg-slate-50/40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 p-1 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 block">{p.name}</span>
                        <span className="font-mono opacity-60 text-[10px]">${p.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                        p.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        p.approvalStatus === 'PendingReview' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        p.approvalStatus === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {p.approvalStatus}
                      </span>
                    </div>
                  </div>
                ))}

                {sellerProducts.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No products added to catalog. Add your first item to initiate reviews!
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: PRODUCT MANAGEMENT (Add/Edit) */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            
            {!addingProduct ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black tracking-tight">Active Storefront Catalog</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage, delete, or submit item specifications for administrator KYC approval.</p>
                  </div>
                  <button
                    onClick={() => { setEditingProduct(null); setAddingProduct(true); }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Product
                  </button>
                </div>

                <div className="space-y-4">
                  {sellerProducts.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-slate-100 p-1 flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-100 block">{p.name}</span>
                          <span className="font-mono text-slate-400 mt-0.5 block">${p.price}</span>
                        </div>
                      </div>

                      {/* Info triggers */}
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                            p.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            p.approvalStatus === 'PendingReview' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            p.approvalStatus === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {p.approvalStatus}
                          </span>
                          {p.approvalStatus === 'Rejected' && (
                            <p className="text-[10px] text-rose-500 mt-1 max-w-[150px] truncate">{p.rejectionFeedback || 'Doc check failed'}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {p.approvalStatus === 'Draft' && (
                            <button
                              onClick={() => {
                                onUpdateProduct(p.id, { approvalStatus: 'PendingReview' });
                                alert('Product details submitted securely for administration audit.');
                              }}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Submit Audit
                            </button>
                          )}
                          <button
                            onClick={() => handleEditTrigger(p)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg cursor-pointer"
                            title="Edit Spec"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete product specification permanently?')) onDeleteProduct(p.id);
                            }}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-slate-400 cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {sellerProducts.length === 0 && (
                    <div className="p-12 text-center border border-dashed text-slate-400 rounded-2xl">
                      Your store has no product records. Click Add Product to initiate!
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ADD/EDIT FORM CONTROLS */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-black">
                    {editingProduct ? `Edit Product Specifications (${editingProduct.name})` : 'Create Storefront Product'}
                  </h3>
                  <button 
                    onClick={() => setAddingProduct(false)}
                    className="text-xs font-semibold text-slate-500 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Product Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Nebula Quantum sneakers"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Category Mapping</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                      >
                        <option>Cyberwear & Apparel</option>
                        <option>Neural & Electronics</option>
                        <option>Kinetic Gear & Footwear</option>
                        <option>Premium Accessories</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Description / Spec Details</label>
                    <textarea 
                      required
                      placeholder="Specify dynamic material filaments, biometric sensors, HEPA speeds..."
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        step="0.01"
                        placeholder="189.99"
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Discount Price ($)</label>
                      <input 
                        type="number" 
                        min="1"
                        step="0.01"
                        placeholder="Optional"
                        value={productForm.discountPrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) || undefined })}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Initial Stock</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Product Media Image URL</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Specification Variants Mapping (Semi-Colon separated)</label>
                    <input 
                      type="text" 
                      value={productForm.variantsStr}
                      onChange={(e) => setProductForm({ ...productForm, variantsStr: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Syntax example: Size: S, M, L; Enclosure: Tungsten, Carbon</p>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {editingProduct ? 'Commit Modification Specs' : 'Save as Secure Draft'}
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: INVENTORY STOCK CONTROL */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Real-Time Inventory Stockings</h3>
              <p className="text-xs text-slate-500 mt-1">Instantly verify and patch stock allocations or adjust standard pricing logs.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="p-4 font-bold">Product Specs</th>
                    <th className="p-4 font-bold">Standard Price</th>
                    <th className="p-4 font-bold">Allocation Stock</th>
                    <th className="p-4 font-bold text-right font-bold">Quick Patch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sellerProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                      <td className="p-4 font-semibold flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 p-1 shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="truncate max-w-[180px]">{p.name}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold">${p.price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold font-semibold ${p.stock < 5 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          {p.stock} Units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              onUpdateProduct(p.id, { stock: Math.max(0, p.stock - 5) });
                              alert('Stock allocation decreased by 5 units.');
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded cursor-pointer"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => {
                              onUpdateProduct(p.id, { stock: p.stock + 10 });
                              alert('Stock allocation increased by 10 units.');
                            }}
                            className="px-2 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold rounded cursor-pointer"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: FULFILMENT ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-black tracking-tight">Merchant Order Fulfilments</h3>
              <p className="text-xs text-slate-500 mt-1">Review customer delivery details and trigger packaging stages.</p>
            </div>

            <div className="space-y-4">
              {sellerOrders.map((o) => {
                // Filter items of this order belonging to the seller
                const sellerItems = o.items.filter(i => i.sellerId === sellerId);
                const orderSubtotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                return (
                  <div key={o.id} className="p-5 border rounded-2xl bg-slate-50/30 text-xs space-y-4">
                    <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 uppercase">TELEMETRY ID</span>
                        <h5 className="font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">{o.orderNumber}</h5>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[9px] uppercase font-bold">
                        ● {o.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {sellerItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-semibold">
                          <div className="truncate">
                            <span>{item.productName}</span>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.selectedVariants} (Qty: {item.quantity})</p>
                          </div>
                          <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-semibold text-slate-500">
                      <div>
                        <p className="font-bold">Ship to: {o.shippingAddress.fullName}</p>
                        <p className="text-[10px] opacity-80 leading-relaxed mt-0.5">
                          {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <span>Items Subtotal: <strong className="font-mono text-slate-900 dark:text-white text-sm ml-1">${orderSubtotal.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {sellerOrders.length === 0 && (
                <div className="p-12 text-center border border-dashed rounded-2xl text-slate-400">
                  No orders containing your items have been finalized on checkout yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: STORE PROFILE EDIT */}
        {activeTab === 'profile' && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('Store Profile parameters securely updated!');
            }}
            className="space-y-5 animate-fadeIn text-xs font-semibold"
          >
            <div>
              <h3 className="text-base font-black tracking-tight">Configure Storefront Profile</h3>
              <p className="text-xs text-slate-500 mt-1">Configure user-facing brand metadata and KYC coordinates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={sellerProfile?.storeName || ''}
                  onChange={(e) => onUpdateStoreProfile({ storeName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Registered Contact Number</label>
                <input 
                  type="tel" 
                  value={sellerProfile?.phone || ''}
                  onChange={(e) => onUpdateStoreProfile({ phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Store Brand Description</label>
              <textarea 
                rows={4}
                value={sellerProfile?.description || ''}
                onChange={(e) => onUpdateStoreProfile({ description: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-505 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              Update Store Profile
            </button>
          </form>
        )}

        {/* VIEW 6: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="space-y-6 animate-fadeIn text-xs font-semibold">
            <div>
              <h3 className="text-base font-black tracking-tight">Merchant Payout Settings</h3>
              <p className="text-xs text-slate-500 mt-1">Coordinate bank transfers and monitor historical payout logs.</p>
            </div>

            <div className="p-5 border rounded-xl space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Connected ACH/Bank Email</label>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    value={sellerProfile?.payoutEmail || 'seller@demo.com'}
                    onChange={(e) => onUpdateStoreProfile({ payoutEmail: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none"
                  />
                  <button 
                    onClick={() => alert('Payout routing updated!')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-[11px] text-slate-500">
                <div className="flex justify-between font-mono">
                  <span>Pending Merchant Escrow Balance:</span>
                  <strong className="text-slate-800 dark:text-white">${(totalSalesVal * 0.95).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Simulated Processing Surcharges (5% fee):</span>
                  <strong className="text-rose-500">-${(totalSalesVal * 0.05).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: RETURNS */}
        {activeTab === 'returns' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Active Customer Return Requests</h3>
              <p className="text-xs text-slate-500 mt-1">Review logistic return states and verify RMA barcodes.</p>
            </div>

            <div className="p-8 border border-dashed rounded-xl text-center text-slate-400">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <span>No active merchant return requests filed by customers in this session.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
