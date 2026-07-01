import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  Layers, 
  ShoppingBag, 
  ListOrdered, 
  Sparkles, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Trash2, 
  Eye, 
  FileText,
  UserCheck,
  Edit2
} from 'lucide-react';
import { Product, Order, Category, User, SellerProfile, Banner } from '../types';

interface AdminPortalProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  sellers: SellerProfile[];
  banners: Banner[];
  onNavigate: (path: string) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onUpdateSellerStatus: (id: string, status: 'Active' | 'Suspended' | 'PendingApproval') => void;
  onUpdateOrderStatus: (id: string, status: 'PaymentReceived' | 'Processing' | 'Shipped' | 'Delivered') => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onRemoveCategory: (id: string) => void;
  onUpdateBannerStatus: (id: string, isActive: boolean) => void;
}

export default function AdminPortal({
  products,
  categories,
  orders,
  users,
  sellers,
  banners,
  onNavigate,
  onUpdateProduct,
  onUpdateSellerStatus,
  onUpdateOrderStatus,
  onAddCategory,
  onRemoveCategory,
  onUpdateBannerStatus
}: AdminPortalProps) {
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'sellers' | 'approvals' | 'categories' | 'products' | 'orders' | 'banners' | 'reports' | 'settings'>('dashboard');

  // Interactive rejection state
  const [rejectingProductId, setRejectingProductId] = useState<string | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');

  // Category state
  const [newCatForm, setNewCatForm] = useState({ name: '', description: '' });

  // Compute platform-wide metrics
  const platformRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingProductsCount = products.filter(p => p.approvalStatus === 'PendingReview').length;
  const pendingSellersCount = sellers.filter(s => s.status === 'PendingApproval').length;

  const handleProductApprove = (id: string) => {
    onUpdateProduct(id, { approvalStatus: 'Approved', isActive: true });
    alert('Product specification approved and published live onto customer storefront catalog.');
  };

  const handleProductRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingProductId || !rejectionFeedback.trim()) return;

    onUpdateProduct(rejectingProductId, { 
      approvalStatus: 'Rejected', 
      isActive: false,
      rejectionFeedback: rejectionFeedback 
    });

    alert('Product specification flagged as Rejected. Feedback synchronized back to the seller.');
    setRejectingProductId(null);
    setRejectionFeedback('');
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatForm.name) return;
    onAddCategory({
      name: newCatForm.name,
      description: newCatForm.description,
      slug: newCatForm.name.toLowerCase().replace(/ /g, '-'),
      iconName: 'Layers'
    });
    setNewCatForm({ name: '', description: '' });
    alert('Category taxonomy successfully indexed.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 font-sans items-start">
      
      {/* 1. ADMIN PANEL NAVIGATION SIDEBAR */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3 shadow-sm shrink-0">
        <div className="flex items-center gap-3 border-b pb-4 border-slate-100 dark:border-slate-800/80 px-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Apex Suite</h4>
            <span className="text-[10px] font-mono tracking-widest text-purple-500 font-bold uppercase block mt-0.5">
              ● PLATFORM ADMIN
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 mt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'dashboard' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <ShieldAlert className="w-4 h-4" /> Global Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'users' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Users className="w-4 h-4" /> User Management
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'sellers' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Briefcase className="w-4 h-4" /> Seller Portfolios
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'approvals' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'} relative`}
          >
            <UserCheck className="w-4 h-4" /> Seller KYC Approvals
            {pendingSellersCount > 0 && (
              <span className="absolute right-3 bg-purple-600 text-white font-mono text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center scale-90">
                {pendingSellersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'categories' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Layers className="w-4 h-4" /> Categories Map
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'products' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'} relative`}
          >
            <ShoppingBag className="w-4 h-4" /> Product KYC Audits
            {pendingProductsCount > 0 && (
              <span className="absolute right-3 bg-purple-600 text-white font-mono text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center scale-90">
                {pendingProductsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'orders' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <ListOrdered className="w-4 h-4" /> Platform Orders
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'banners' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Sparkles className="w-4 h-4" /> Hero Banners
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'reports' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <BarChart3 className="w-4 h-4" /> Metric Reports
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`text-left py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${activeTab === 'settings' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
          >
            <Settings className="w-4 h-4" /> Global Settings
          </button>
        </nav>
      </div>

      {/* 2. ACTIVE VIEW DETAILS */}
      <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm min-h-[400px]">
        
        {/* TAB 1: GLOBAL CONTROL DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">Apex Core telemetry</h3>
              <p className="text-xs text-slate-500 mt-1">Platform-wide overview tracking merchant audits and secure escrow flows.</p>
            </div>

            {/* Metrics grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-semibold">
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">PLATFORM SALES REVENUE</span>
                <span className="font-mono font-black text-lg text-slate-800 dark:text-white">${platformRevenue.toFixed(2)}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">TOTAL REGISTERED USERS</span>
                <span className="font-mono font-black text-lg text-slate-800 dark:text-white">{users.length} Claims</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">PENDING PRODUCT AUDITS</span>
                <span className="font-mono font-black text-lg text-purple-600 dark:text-purple-400">{pendingProductsCount} Items</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border flex flex-col justify-between h-24">
                <span className="opacity-60 font-mono text-[10px] uppercase">SELLER KYC APPLICATIONS</span>
                <span className="font-mono font-black text-lg text-purple-600 dark:text-purple-400">{pendingSellersCount} Stores</span>
              </div>
            </div>

            {/* Platform audit alerts */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3">Critical Action Items</h4>
              
              <div className="space-y-2.5 font-semibold">
                {pendingProductsCount > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                      <span>{pendingProductsCount} product spec audits are awaiting platform verification before storefront release.</span>
                    </div>
                    <button onClick={() => setActiveTab('products')} className="text-xs font-bold underline whitespace-nowrap">Audit Now</button>
                  </div>
                )}

                {pendingSellersCount > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                      <span>{pendingSellersCount} store registration KYC documents are awaiting review.</span>
                    </div>
                    <button onClick={() => setActiveTab('approvals')} className="text-xs font-bold underline whitespace-nowrap">Review KYC</button>
                  </div>
                )}

                {pendingProductsCount === 0 && pendingSellersCount === 0 && (
                  <div className="p-6 text-center border border-dashed rounded-xl text-slate-400 font-normal">
                    ✓ All queues fully processed. Platform operational without pending review logs.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Identity Claims Register</h3>
              <p className="text-xs text-slate-500 mt-1">Review active JWT credentials and role configurations.</p>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 border-b text-[10px] font-mono text-slate-400 uppercase">
                    <th className="p-4 font-bold">User</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Configured Role</th>
                    <th className="p-4 font-bold">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-4 font-mono text-[11px]">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                          u.role === 'Admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                          u.role === 'Seller' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-emerald-500">● Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SELLER PORTFOLIO REGISTRY */}
        {activeTab === 'sellers' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Merchant Portfolio Register</h3>
              <p className="text-xs text-slate-500 mt-1">Review active store parameters and configure merchant access suspensions.</p>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 border-b text-[10px] font-mono text-slate-400 uppercase">
                    <th className="p-4 font-bold">Store Brand</th>
                    <th className="p-4 font-bold">Contact Phone</th>
                    <th className="p-4 font-bold">Rating Log</th>
                    <th className="p-4 font-bold">State</th>
                    <th className="p-4 font-bold text-right font-bold">Access Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                      <td className="p-4">
                        <span className="text-slate-800 dark:text-slate-100 font-bold block">{s.storeName}</span>
                        <span className="text-[10px] opacity-65 font-normal leading-relaxed">{s.description}</span>
                      </td>
                      <td className="p-4 font-mono">{s.phone}</td>
                      <td className="p-4 font-mono text-amber-500">★ {s.rating}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                          s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          s.status === 'Suspended' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {s.status === 'Active' ? (
                          <button
                            onClick={() => {
                              onUpdateSellerStatus(s.id, 'Suspended');
                              alert('Merchant portal access suspended.');
                            }}
                            className="px-2 py-1 bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 font-bold rounded cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onUpdateSellerStatus(s.id, 'Active');
                              alert('Merchant portal access restored.');
                            }}
                            className="px-2 py-1 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 font-bold rounded cursor-pointer"
                          >
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SELLER KYC APPLICATIONS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Seller Registration KYC Review</h3>
              <p className="text-xs text-slate-500 mt-1">Verify business coordinates and approve new store listings.</p>
            </div>

            <div className="space-y-4">
              {sellers.filter(s => s.status === 'PendingApproval').map((s) => (
                <div key={s.id} className="p-5 border rounded-2xl bg-slate-50/30 space-y-4 font-semibold">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 uppercase">STORE APPLICATION</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{s.storeName}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[9px] uppercase font-bold">
                      ● Pending Audit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-500">
                    <div>
                      <p>Company description: <strong className="text-slate-700 dark:text-slate-300 font-sans">{s.description}</strong></p>
                    </div>
                    <div>
                      <p>Payout ACH email: <strong className="text-slate-700 dark:text-slate-300 font-mono">{s.payoutEmail}</strong></p>
                      <p>Merchant Contact: <strong className="text-slate-700 dark:text-slate-300 font-mono">{s.phone}</strong></p>
                    </div>
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2.5">
                    <button
                      onClick={() => {
                        onUpdateSellerStatus(s.id, 'Suspended');
                        alert('Seller application rejected and marked Suspended.');
                      }}
                      className="px-3.5 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15 rounded-xl font-bold cursor-pointer"
                    >
                      Reject KYC
                    </button>
                    <button
                      onClick={() => {
                        onUpdateSellerStatus(s.id, 'Active');
                        alert('Seller application approved! Merchant store is now fully operational.');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Approve & Activate Store
                    </button>
                  </div>
                </div>
              ))}

              {sellers.filter(s => s.status === 'PendingApproval').length === 0 && (
                <div className="p-12 text-center border border-dashed rounded-xl text-slate-400">
                  No seller profiles currently awaiting KYC documents review.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: TAXONOMY CATEGORIES MAP */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Category Taxonomy Map</h3>
              <p className="text-xs text-slate-500 mt-1">Publish new storefront categories or delete inactive nodes.</p>
            </div>

            {/* inline add form */}
            <form onSubmit={handleAddCategorySubmit} className="p-4 border rounded-xl bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-end font-semibold">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bio-Wearable Chips"
                  value={newCatForm.name}
                  onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-800 text-slate-900 focus:outline-none"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Brief Description</label>
                <input 
                  type="text" 
                  placeholder="Specify brief taxonomy details..."
                  value={newCatForm.description}
                  onChange={(e) => setNewCatForm({ ...newCatForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-800 text-slate-900 focus:outline-none"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg cursor-pointer">
                Index Category
              </button>
            </form>

            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50/30 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors font-semibold">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">{c.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{c.description}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete taxonomy node? All mapped products will default to uncategorized.')) onRemoveCategory(c.id);
                    }}
                    className="p-1.5 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PRODUCT KYC AUDITS (Approve/Reject) */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn text-xs font-semibold">
            <div>
              <h3 className="text-base font-black tracking-tight">Product KYC Moderation</h3>
              <p className="text-xs text-slate-500 mt-1">Audit merchant submissions against platform standard quality parameters.</p>
            </div>

            {/* Modal for rejection feedback input */}
            {rejectingProductId && (
              <form onSubmit={handleProductRejectSubmit} className="p-4 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 space-y-3">
                <div>
                  <h5 className="font-bold">Flag Product Submission as Rejected</h5>
                  <p className="text-[11px] opacity-85 mt-1">Specify detailed audit logs explaining why this spec sheets failed quality checks.</p>
                </div>
                <textarea 
                  required
                  rows={2}
                  placeholder="e.g. Image asset resolution does not match; specification details require clarity."
                  value={rejectionFeedback}
                  onChange={(e) => setRejectionFeedback(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-850 text-slate-900 text-xs focus:outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setRejectingProductId(null)} 
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-500 font-bold"
                  >
                    Submit Rejection Log
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {products.filter(p => p.approvalStatus === 'PendingReview').map((p) => (
                <div key={p.id} className="p-4 rounded-xl border bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-slate-100 p-1 flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 uppercase">{p.category}</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 block leading-relaxed mt-0.5">{p.description}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setRejectingProductId(p.id)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 rounded-xl font-bold cursor-pointer"
                    >
                      Reject Submission
                    </button>
                    <button
                      onClick={() => handleProductApprove(p.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Approve & Publish Live
                    </button>
                  </div>
                </div>
              ))}

              {products.filter(p => p.approvalStatus === 'PendingReview').length === 0 && (
                <div className="p-12 text-center border border-dashed rounded-xl text-slate-400">
                  ✓ Excellent. All product submission queues are fully processed.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: PLATFORM ORDERS CONTROL */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Platform Transaction Registers</h3>
              <p className="text-xs text-slate-500 mt-1">Review customer transactions and dispatch logistical stages.</p>
            </div>

            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-5 border rounded-2xl bg-slate-50/30 space-y-4 font-semibold">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 uppercase">CLAIM NUMBER</span>
                      <h5 className="font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">{o.orderNumber}</h5>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono text-[9px] uppercase font-bold">
                        ● {o.status}
                      </span>
                      
                      {/* Status select controller */}
                      <select
                        value={o.status}
                        onChange={(e) => {
                          onUpdateOrderStatus(o.id, e.target.value as any);
                          alert(`Simulated Order status updated to ${e.target.value}.`);
                        }}
                        className="px-2 py-1 bg-white border rounded text-[10px] focus:outline-none"
                      >
                        <option value="PaymentReceived">PaymentReceived</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{i.productName} <strong className="font-mono opacity-50">(Qty: {i.quantity})</strong></span>
                        <span className="font-mono">${(i.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <p>Customer Name: <strong className="text-slate-800 dark:text-slate-100">{o.customerName}</strong></p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Destination: {o.shippingAddress.street}, {o.shippingAddress.city}</p>
                    </div>
                    <p className="text-right">Paid Total: <strong className="font-mono text-slate-900 dark:text-white text-sm ml-1">${o.total.toFixed(2)}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: HERO BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-black tracking-tight">Storefront Hero Sliders</h3>
              <p className="text-xs text-slate-500 mt-1">Configure promotional advertising widgets published live on storefront pages.</p>
            </div>

            <div className="space-y-4 font-semibold">
              {banners.map((b) => (
                <div key={b.id} className="p-4 border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={b.imageUrl} alt={b.title} className="w-16 h-10 object-cover rounded-md" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{b.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{b.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={b.isActive ? 'text-emerald-500' : 'text-slate-400'}>
                      {b.isActive ? '● Active Sliders' : '○ Hidden'}
                    </span>
                    <button
                      onClick={() => {
                        onUpdateBannerStatus(b.id, !b.isActive);
                        alert(`Banner visibility patched!`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${b.isActive ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-purple-600 text-white hover:bg-purple-500'}`}
                    >
                      {b.isActive ? 'Deactivate' : 'Publish Live'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: METRIC REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn text-xs font-semibold text-slate-500">
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">Core Metric Reports</h3>
              <p className="text-xs text-slate-500 mt-1">Platform-wide statistics and revenue curves.</p>
            </div>

            {/* Custom SVG bar graph to display telemetry revenue beautifully without installing charting bloats */}
            <div className="p-6 border rounded-xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Simulated Revenue Curves</h4>
              
              <div className="h-40 flex items-end gap-3.5 pt-4">
                {[
                  { label: 'Mon', val: 120 },
                  { label: 'Tue', val: 240 },
                  { label: 'Wed', val: 180 },
                  { label: 'Thu', val: 320 },
                  { label: 'Fri', val: 450 },
                  { label: 'Sat', val: 620 },
                  { label: 'Sun', val: 510 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-purple-600">${item.val * 4}</span>
                    <div 
                      style={{ height: `${(item.val / 620) * 80}%` }} 
                      className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-lg group-hover:opacity-90 transition-opacity shadow shadow-indigo-500/15 cursor-pointer"
                    />
                    <span className="font-mono text-[9px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === 'settings' && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('Platform configuration profiles committed!');
            }}
            className="space-y-5 animate-fadeIn text-xs font-semibold"
          >
            <div>
              <h3 className="text-base font-black tracking-tight">Platform Configurations</h3>
              <p className="text-xs text-slate-500 mt-1">Adjust global settings mapped in live transaction state.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Global Tax Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                  defaultValue="18.0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase opacity-60 mb-1">Escrow Merchant Surcharge (%)</label>
                <input 
                  type="number" 
                  step="0.5"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-850 dark:border-slate-800 focus:outline-none font-mono"
                  defaultValue="5.0"
                />
              </div>
            </div>

            <button type="submit" className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer">
              Commit Parameters
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
