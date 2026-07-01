/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChevronRight, 
  Layers, 
  FileText, 
  Code2, 
  Database, 
  ShieldAlert, 
  Cpu, 
  Check, 
  Copy, 
  Moon, 
  Sun, 
  ShoppingCart, 
  Eye, 
  Trash2, 
  Shield, 
  Sparkles, 
  Filter, 
  RefreshCw, 
  Star,
  ArrowRight,
  Search,
  Grid,
  Settings,
  User,
  Plus,
  Minus,
  Info,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { codeTemplates, CodeFile } from './code-templates';
import ThreeStage from './components/ThreeStage';

// Product Catalog Data reflecting starter categories & products
interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  stock: number;
  isFeatured: boolean;
  category: string;
  image: string;
  fallbackImages: string[];
  variants: { name: string; values: string[] }[];
}

const mockProducts: MockProduct[] = [
  {
    id: "prod-1",
    name: "Nebula Quantum Sneakers",
    slug: "nebula-quantum-sneakers",
    description: "Futuristic footwear with pressurized cybernetic gel soles, adaptive fit threading, and integrated ambient step glows.",
    price: 189.99,
    discountPrice: 159.99,
    rating: 4.9,
    stock: 24,
    isFeatured: true,
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Size", values: ["US 8", "US 9", "US 10", "US 11"] },
      { name: "Cyber Accent", values: ["Primary Accent", "Secondary Accent", "Stealth Gray"] }
    ]
  },
  {
    id: "prod-2",
    name: "Apex ANC Holographic Earbuds",
    slug: "apex-anc-holographic-earbuds",
    description: "Premium sound engineered with custom physical active-noise canceling modules, carbon-nanotube dynamic drivers, and magnetic docks.",
    price: 249.99,
    rating: 4.8,
    stock: 12,
    isFeatured: true,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Enclosure", values: ["Chambered Steel", "Anodized Slate"] }
    ]
  },
  {
    id: "prod-3",
    name: "Carbon Series Hardshell Pack",
    slug: "carbon-series-hardshell-pack",
    description: "Waterproof aerospace-grade composite polymer shell backpack with integrated TSA locks, discrete storage, and USB-C dynamic passthrough.",
    price: 129.99,
    discountPrice: 110.00,
    rating: 4.7,
    stock: 40,
    isFeatured: false,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Capacity", values: ["20L Standard", "30L Extended"] }
    ]
  },
  {
    id: "prod-4",
    name: "Lunar Chronos Mechanical Dial",
    slug: "lunar-chronos-mechanical-dial",
    description: "Heavy aerospace alloy automatic movement mechanical watch with custom sapphire window face and lightweight links.",
    price: 599.99,
    rating: 5.0,
    stock: 5,
    isFeatured: true,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Strap", values: ["Mesh Link Steel", "Obsidian Leather"] }
    ]
  },
  {
    id: "prod-5",
    name: "AeroSphere Smart Room Purifier",
    slug: "aerosphere-smart-room-purifier",
    description: "Aesthetic modular dual-fan HEPA room air purifier. Features dynamic carbon filters and soundless sleep cycles.",
    price: 320.00,
    discountPrice: 289.99,
    rating: 4.6,
    stock: 15,
    isFeatured: false,
    category: "Home",
    image: "https://images.unsplash.com/photo-1585338114002-95955040f2f8?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1585338114002-95955040f2f8?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Housing", values: ["Satin Ivory", "Soot Gray"] }
    ]
  }
];

interface CartItem {
  product: MockProduct;
  quantity: number;
  selectedVariants: string;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'blueprint' | 'showroom' | 'setup'>('blueprint');
  
  // Showcase Navigation States
  const [showroomTab, setShowroomTab] = useState<'home' | 'products' | 'detail' | 'cart' | 'checkout'>('home');
  const [selectedProduct, setSelectedProduct] = useState<MockProduct>(mockProducts[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Cart Signal-feel States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedVariantsState, setSelectedVariantsState] = useState<Record<string, string>>({
    "Size": "US 9",
    "Cyber Accent": "Primary Accent",
    "Enclosure": "Chambered Steel",
    "Capacity": "20L Standard",
    "Strap": "Mesh Link Steel",
    "Housing": "Satin Ivory"
  });

  // Code Explorer States
  const [selectedFile, setSelectedFile] = useState<CodeFile>(codeTemplates[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Progressive enhancement simulations
  const [webglEnabled, setWebglEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);

  // Address inputs for simulated validation
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    fullName: '',
    paymentMethod: 'credit'
  });
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  const handleCopyCode = (file: CodeFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFile(file.path);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleAddToCart = (product: MockProduct, qty: number = 1) => {
    // Compile chosen variant strings
    const selectedStrings = product.variants
      .map(v => `${v.name}: ${selectedVariantsState[v.name] || v.values[0]}`)
      .join(', ');

    const existing = cart.find(
      item => item.product.id === product.id && item.selectedVariants === selectedStrings
    );

    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id && item.selectedVariants === selectedStrings
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: qty, selectedVariants: selectedStrings }]);
    }
    
    // Jump to Cart summary to display responsiveness
    setShowroomTab('cart');
  };

  const updateCartQty = (productId: string, selectedVariants: string, increment: boolean) => {
    setCart(cart.map(item => {
      if (item.product.id === productId && item.selectedVariants === selectedVariants) {
        const nextQty = increment ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, nextQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, selectedVariants: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.selectedVariants === selectedVariants)));
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + 15.00 : 0; // standard $15 shipping fee

  // Theme variable injections matching precise design tokens
  const activeColors = theme === 'light' ? {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    mutedText: '#64748B',
    border: '#E2E8F0',
    primaryAccent: '#6D5DFB',
    primaryHover: '#5848E5',
    secondaryAccent: '#00B8D9',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
  } : {
    background: '#06070D',
    surface: '#10131F',
    surfaceElevated: '#171B2E',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    mutedText: '#94A3B8',
    border: '#293044',
    primaryAccent: '#8B7CFF',
    primaryHover: '#A398FF',
    secondaryAccent: '#22D3EE',
    success: '#22C55E',
    warning: '#FBBF24',
    error: '#F87171',
  };

  return (
    <div 
      className="min-h-screen font-sans transition-colors duration-300 flex flex-col"
      style={{
        backgroundColor: activeColors.background,
        color: activeColors.textPrimary,
        '--background': activeColors.background,
        '--surface': activeColors.surface,
        '--surface-elevated': activeColors.surfaceElevated,
        '--text-primary': activeColors.textPrimary,
        '--text-secondary': activeColors.textSecondary,
        '--muted-text': activeColors.mutedText,
        '--border': activeColors.border,
        '--primary-accent': activeColors.primaryAccent,
        '--primary-hover': activeColors.primaryHover,
        '--secondary-accent': activeColors.secondaryAccent,
        '--success': activeColors.success,
        '--warning': activeColors.warning,
        '--error': activeColors.error,
      } as React.CSSProperties}
    >
      {/* GLOBAL BANNER */}
      <div className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white px-4 py-2 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
          <span>PRODUCTION-READY STARTER TEMPLATE ENGINE ACTIVE</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>ANGULAR 21 + .NET 10 CLEAN ARCHITECTURE</span>
          <span>● WEBGL PROGRESSIVE BOOT</span>
        </div>
      </div>

      {/* PRIMARY HEADER */}
      <header className="border-b transition-colors duration-300 flex items-center justify-between px-6 py-4 sticky top-0 z-40 bg-[var(--surface)]/80 backdrop-blur-md" style={{ borderColor: activeColors.border }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: activeColors.primaryAccent }}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-sans text-[var(--text-primary)]">
              Showroom 3D
            </h1>
            <p className="text-[10px] font-mono tracking-wider uppercase opacity-60">Full-Stack Architecture Hub</p>
          </div>
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="flex items-center gap-2 bg-[var(--surface-elevated)] p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'blueprint' 
                ? 'bg-[var(--surface)] shadow-sm text-[var(--primary-accent)]' 
                : 'opacity-60 hover:opacity-100 text-[var(--text-secondary)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">1. Architectural Blueprint</span>
            <span className="sm:hidden">1. Blueprint</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('showroom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'showroom' 
                ? 'bg-[var(--surface)] shadow-sm text-[var(--primary-accent)]' 
                : 'opacity-60 hover:opacity-100 text-[var(--text-secondary)]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">2. Immersive Showroom</span>
            <span className="sm:hidden">2. Showroom</span>
          </button>

          <button 
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'setup' 
                ? 'bg-[var(--surface)] shadow-sm text-[var(--primary-accent)]' 
                : 'opacity-60 hover:opacity-100 text-[var(--text-secondary)]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">3. Database & CLI Setup</span>
            <span className="sm:hidden">3. Setup</span>
          </button>
        </div>

        {/* TOP RIGHT CONTROLS */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-all text-[var(--text-secondary)]"
            title="Toggle Visual Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* CORE LAYOUT WRAPPER */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        
        {/* TAB 1: ARCHITECTURE BLUEPRINT EXPLORER */}
        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT DETAILS: ARCHITECTURE SPECS */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[var(--surface)] rounded-2xl p-6 border transition-all shadow-sm" style={{ borderColor: activeColors.border }}>
                <div className="flex items-center gap-2 text-[var(--primary-accent)] mb-3">
                  <Cpu className="w-5 h-5 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Engineering Blueprint</span>
                </div>
                <h3 className="text-xl font-bold font-sans mb-3 text-[var(--text-primary)]">Recommended Clean Architecture</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  The back-end utilizes a decoupling paradigm where domain logic resides purely in the core entity structures, database storage is mapped via Entity Framework Core 10, and controllers are strictly microservices exposing DTO-based API contracts.
                </p>

                <div className="space-y-3.5 pt-4 border-t" style={{ borderColor: activeColors.border }}>
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide">Domain-Driven Separation</h4>
                      <p className="text-xs text-[var(--muted-text)]">Decoupled entities isolated from infrastructure logic.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide">Normalized Schemas</h4>
                      <p className="text-xs text-[var(--muted-text)]">Optimized indexing for product slugs, orders, and sessions.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide">Progressive Angular 3D</h4>
                      <p className="text-xs text-[var(--muted-text)]">Three.js is lazy-loaded, running outside change detection.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DIRECTORY EXPLORER */}
              <div className="bg-[var(--surface)] rounded-2xl p-5 border transition-all shadow-sm" style={{ borderColor: activeColors.border }}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider mb-3 opacity-60">Starter Directory Structure</h4>
                
                <div className="space-y-1 text-xs font-mono overflow-y-auto max-h-[300px]">
                  {/* Backend Tree */}
                  <div className="text-[var(--primary-accent)] font-semibold flex items-center gap-1.5 py-0.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Ecommerce.sln (C# Back-End)</span>
                  </div>
                  
                  {codeTemplates.filter(f => f.path.startsWith('backend')).map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left pl-5 py-1.5 rounded hover:bg-[var(--background)] transition-all flex items-center justify-between group ${
                        selectedFile.path === file.path ? 'bg-[var(--surface-elevated)] text-[var(--primary-accent)] font-semibold border-l-2' : 'text-[var(--text-secondary)] opacity-80'
                      }`}
                      style={selectedFile.path === file.path ? { borderLeftColor: activeColors.primaryAccent } : {}}
                    >
                      <span className="truncate">├─ {file.name}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}

                  {/* Frontend Tree */}
                  <div className="text-[var(--secondary-accent)] font-semibold flex items-center gap-1.5 py-0.5 pt-3">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Ecommerce.Angular (Front-End)</span>
                  </div>
                  {codeTemplates.filter(f => f.path.startsWith('frontend')).map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left pl-5 py-1.5 rounded hover:bg-[var(--background)] transition-all flex items-center justify-between group ${
                        selectedFile.path === file.path ? 'bg-[var(--surface-elevated)] text-[var(--primary-accent)] font-semibold border-l-2' : 'text-[var(--text-secondary)] opacity-80'
                      }`}
                      style={selectedFile.path === file.path ? { borderLeftColor: activeColors.primaryAccent } : {}}
                    >
                      <span className="truncate">├─ {file.name}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS: CODE FILE VIEWER */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-[#0c0d14] rounded-2xl overflow-hidden border border-slate-800 text-slate-300 shadow-xl">
                
                {/* EDITOR HEADER */}
                <div className="bg-[#141521] border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">/ {selectedFile.path}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {selectedFile.language}
                    </span>
                    <button
                      onClick={() => handleCopyCode(selectedFile)}
                      className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                      title="Copy code to clipboard"
                    >
                      {copiedFile === selectedFile.path ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* EDITOR FILE EXPLANATION */}
                <div className="bg-[#12131e] px-5 py-3 border-b border-slate-800/60 flex items-start gap-2.5 text-xs">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">{selectedFile.batch}</span>
                    <span className="text-slate-400">{selectedFile.description}</span>
                  </div>
                </div>

                {/* CODE AREA */}
                <div className="p-5 overflow-x-auto font-mono text-xs leading-relaxed max-h-[550px] text-emerald-300/95 bg-[#090a10]">
                  <pre>{selectedFile.code}</pre>
                </div>
              </div>

              {/* ARCHITECTURAL COMPLIANCE FLAGS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[var(--surface)] border p-4 rounded-xl flex gap-3" style={{ borderColor: activeColors.border }}>
                  <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold">SQL Injection Guarded</h5>
                    <p className="text-[11px] text-[var(--muted-text)]">EF Core Parameterization isolates variables dynamically.</p>
                  </div>
                </div>
                <div className="bg-[var(--surface)] border p-4 rounded-xl flex gap-3" style={{ borderColor: activeColors.border }}>
                  <Cpu className="w-5 h-5 text-cyan-500 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold">NgZone Render Separation</h5>
                    <p className="text-[11px] text-[var(--muted-text)]">Three.js updates reside strictly outside CD dirty-checking loops.</p>
                  </div>
                </div>
                <div className="bg-[var(--surface)] border p-4 rounded-xl flex gap-3" style={{ borderColor: activeColors.border }}>
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold">Responsive 3D Fallback</h5>
                    <p className="text-[11px] text-[var(--muted-text)]">Accessible HTML/CSS renders instantly if WebGL fails.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMMERSIVE LIVE SHOWROOM MOCKUP */}
        {activeTab === 'showroom' && (
          <div className="flex flex-col gap-6">
            
            {/* TOGGLE OPTIONS BAR */}
            <div className="bg-[var(--surface)] p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm" style={{ borderColor: activeColors.border }}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-[var(--text-secondary)]">WebGL Status:</span>
                  <button 
                    onClick={() => setWebglEnabled(!webglEnabled)}
                    className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
                      webglEnabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}
                  >
                    {webglEnabled ? 'Active (Auto 3D)' : 'Disabled (Fallback mode)'}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-[var(--text-secondary)]">Connection Type:</span>
                  <button 
                    onClick={() => setSlowConnection(!slowConnection)}
                    className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
                      slowConnection ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                    }`}
                  >
                    {slowConnection ? 'Slow 3G (Force Fallback)' : 'Broadband (Optimize)'}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-[var(--text-secondary)]">Reduced Motion:</span>
                  <button 
                    onClick={() => setReducedMotion(!reducedMotion)}
                    className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
                      reducedMotion ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                    }`}
                  >
                    {reducedMotion ? 'Enabled (No Animate)' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* DEMO STORE NAVIGATOR */}
              <div className="flex items-center gap-1.5 self-start md:self-auto">
                <span className="text-xs font-mono opacity-60 mr-2">Page View:</span>
                {(['home', 'products', 'detail', 'cart', 'checkout'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setShowroomTab(sub);
                      if (sub === 'detail') setSelectedProduct(mockProducts[0]);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      showroomTab === sub 
                        ? 'bg-[var(--primary-accent)] text-white' 
                        : 'bg-[var(--surface-elevated)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-secondary)]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE PREVIEW CONTAINER */}
            <div className="border rounded-3xl overflow-hidden transition-all shadow-xl bg-[var(--surface)]" style={{ borderColor: activeColors.border }}>
              
              {/* INTERACTIVE DEMO VIEWS */}
              {showroomTab === 'home' && (
                <div className="flex flex-col">
                  {/* HERO SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12 items-center bg-gradient-to-br from-[var(--surface)] via-[var(--surface-elevated)] to-[var(--background)]">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-[var(--surface)] w-fit" style={{ borderColor: activeColors.border }}>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">The Future of Interactive Commerce</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tight leading-tight">
                        Experience Premium Objects in <span className="text-[var(--primary-accent)]">Dynamic 3D</span>
                      </h2>

                      <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
                        A robust, responsive showcase. Feel the premium depth of our physical model catalog. Renders using WebGL triggers on demand—fully progressive.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <button 
                          onClick={() => setShowroomTab('products')} 
                          className="px-6 py-3 rounded-xl font-semibold text-sm text-white flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                          style={{ backgroundColor: activeColors.primaryAccent }}
                        >
                          Explore Showcase
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedProduct(mockProducts[0]);
                            setShowroomTab('detail');
                          }}
                          className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-[var(--surface)] font-semibold text-sm hover:bg-[var(--surface-elevated)] transition-colors"
                        >
                          View Featured Model
                        </button>
                      </div>
                    </div>

                    {/* LAZY LOADED 3D HERO CONTAINER */}
                    <div className="lg:col-span-5 h-[350px] relative rounded-2xl overflow-hidden border bg-[var(--surface)] shadow-md group" style={{ borderColor: activeColors.border }}>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-emerald-500 text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                          Lazy stage
                        </span>
                      </div>

                      {/* We display WebGL component based on state */}
                      {webglEnabled && !slowConnection ? (
                        <ThreeStage modelColor={activeColors.primaryAccent} autoRotate={!reducedMotion} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900/5 dark:bg-white/5">
                          <img 
                            src={mockProducts[0].image} 
                            alt={mockProducts[0].name} 
                            className="w-44 h-44 object-contain drop-shadow-2xl mb-4 transition-transform group-hover:scale-105 duration-500" 
                          />
                          <span className="text-xs font-semibold">{mockProducts[0].name}</span>
                          <span className="text-[10px] opacity-60">Fallback Rendering Active</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FEATURED BENEFITS BAR */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-y" style={{ borderColor: activeColors.border }}>
                    <div className="flex gap-3.5 items-start">
                      <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] text-[var(--primary-accent)]">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">WebGL Auto-Detect</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Zero bundle overhead. 3D assets stream as standalone modules.</p>
                      </div>
                    </div>
                    <div className="flex gap-3.5 items-start">
                      <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] text-[var(--primary-accent)]">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">Instant Checkout</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Lightweight cart checkout with absolute zero render jitter.</p>
                      </div>
                    </div>
                    <div className="flex gap-3.5 items-start">
                      <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] text-[var(--primary-accent)]">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">Audit-Safe Logging</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Back-end snapshotted item prices preserve legal integrity.</p>
                      </div>
                    </div>
                    <div className="flex gap-3.5 items-start">
                      <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] text-[var(--primary-accent)]">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">Secure Session State</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Robust JWT placeholders and anonymous customer cart binders.</p>
                      </div>
                    </div>
                  </div>

                  {/* CATALOG FOCUS SNEAKPEEK */}
                  <div className="p-6 md:p-10 flex flex-col gap-6 bg-[var(--surface-elevated)]/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold font-sans">Featured Showroom</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Ready-to-deploy clean responsive HTML elements</p>
                      </div>
                      <button 
                        onClick={() => setShowroomTab('products')} 
                        className="text-xs font-semibold text-[var(--primary-accent)] flex items-center gap-1 hover:underline"
                      >
                        All Categories
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockProducts.filter(p => p.isFeatured).map((p) => (
                        <div 
                          key={p.id} 
                          className="bg-[var(--surface)] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                          style={{ borderColor: activeColors.border }}
                        >
                          <div className="relative aspect-video bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center p-4">
                            <img src={p.image} alt={p.name} className="h-full object-contain max-h-[140px] drop-shadow-md" />
                            {p.discountPrice && (
                              <div className="absolute top-3 left-3 bg-[var(--error)] text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                Promo
                              </div>
                            )}
                          </div>
                          <div className="p-5 flex flex-col gap-3">
                            <div>
                              <span className="text-[10px] font-mono tracking-wider opacity-60 block uppercase">{p.category}</span>
                              <h4 className="text-sm font-bold font-sans truncate">{p.name}</h4>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 h-8">{p.description}</p>
                            
                            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: activeColors.border }}>
                              <div>
                                {p.discountPrice ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs line-through opacity-50 font-mono">${p.price}</span>
                                    <span className="text-sm font-bold font-mono text-[var(--primary-accent)]">${p.discountPrice}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">${p.price}</span>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setShowroomTab('detail');
                                }}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity"
                                style={{ backgroundColor: activeColors.primaryAccent }}
                              >
                                View Specs
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: PRODUCT LISTING */}
              {showroomTab === 'products' && (
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  {/* FILTER CONTROLS BAR */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: activeColors.border }}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1 uppercase tracking-wider mr-2">
                        <Filter className="w-3.5 h-3.5" /> Filter Category:
                      </span>
                      {['All', 'Sneakers', 'Electronics', 'Accessories', 'Home'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            categoryFilter === cat 
                              ? 'bg-[var(--primary-accent)] text-white shadow-sm' 
                              : 'bg-[var(--surface-elevated)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-secondary)]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="relative max-w-xs w-full">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-40" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-[var(--surface-elevated)] border rounded-xl text-xs focus:outline-none focus:ring-1 transition-all"
                        style={{ borderColor: activeColors.border }}
                      />
                    </div>
                  </div>

                  {/* PRODUCTS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockProducts
                      .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((p) => (
                        <div 
                          key={p.id} 
                          className="bg-[var(--surface)] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                          style={{ borderColor: activeColors.border }}
                        >
                          <div className="relative aspect-video bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center p-4">
                            <img src={p.image} alt={p.name} className="h-full object-contain max-h-[140px] drop-shadow-md" />
                            {p.discountPrice && (
                              <div className="absolute top-3 left-3 bg-[var(--error)] text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                Sale
                              </div>
                            )}
                          </div>
                          
                          <div className="p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono tracking-wider opacity-60 uppercase">{p.category}</span>
                              <div className="flex items-center gap-0.5 text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span className="text-[10px] font-bold font-mono">{p.rating}</span>
                              </div>
                            </div>
                            
                            <h4 className="text-sm font-bold font-sans truncate">{p.name}</h4>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 h-8">{p.description}</p>
                            
                            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: activeColors.border }}>
                              <div>
                                {p.discountPrice ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs line-through opacity-50 font-mono">${p.price}</span>
                                    <span className="text-sm font-bold font-mono text-[var(--primary-accent)]">${p.discountPrice}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">${p.price}</span>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setShowroomTab('detail');
                                }}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white"
                                style={{ backgroundColor: activeColors.primaryAccent }}
                              >
                                View Specs
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 3: PRODUCT DETAIL */}
              {showroomTab === 'detail' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
                  
                  {/* LEFT COLUMN: ACTIVE 3D OR FALLBACK GALLERY */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border bg-slate-50 dark:bg-[#10131F]/50 flex items-center justify-center p-6" style={{ borderColor: activeColors.border }}>
                      
                      {/* WebGL viewer or fallback */}
                      {webglEnabled && !slowConnection ? (
                        <div className="w-full h-full min-h-[300px]">
                          <ThreeStage modelColor={activeColors.primaryAccent} autoRotate={!reducedMotion} />
                        </div>
                      ) : (
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name} 
                          className="w-full h-full object-contain max-h-[300px] drop-shadow-2xl" 
                        />
                      )}

                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono text-slate-300">
                        {webglEnabled && !slowConnection ? '3D Active' : 'Fallback Dial'}
                      </div>
                    </div>

                    {/* MULTI IMAGE THUMBNAILS (FALLBACK GALLERY MOCKUP) */}
                    <div className="grid grid-cols-3 gap-3">
                      {selectedProduct.fallbackImages.map((img, i) => (
                        <div 
                          key={i} 
                          className="aspect-video rounded-xl border p-2 bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-85" 
                          style={{ borderColor: activeColors.border }}
                        >
                          <img src={img} alt="Spec thumbnail" className="h-full object-contain max-h-[60px]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: CATALOG BUYING SPECS */}
                  <div className="lg:col-span-6 flex flex-col gap-5 justify-center">
                    <div>
                      <span className="text-xs font-mono text-[var(--primary-accent)] uppercase tracking-wider font-semibold block mb-1">{selectedProduct.category}</span>
                      <h2 className="text-2xl md:text-3xl font-black font-sans leading-tight">{selectedProduct.name}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span className="text-xs font-bold font-mono">{selectedProduct.rating}</span>
                      </div>
                      <span className="text-xs text-[var(--muted-text)] font-mono">Stock level: {selectedProduct.stock} items remaining</span>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selectedProduct.description}</p>

                    {/* SELECTABLE VARIANTS */}
                    <div className="space-y-4">
                      {selectedProduct.variants.map((variant) => (
                        <div key={variant.name} className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider block opacity-75">{variant.name}</span>
                          <div className="flex flex-wrap gap-2">
                            {variant.values.map((v) => (
                              <button
                                key={v}
                                onClick={() => setSelectedVariantsState(prev => ({ ...prev, [variant.name]: v }))}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  selectedVariantsState[variant.name] === v 
                                    ? 'bg-[var(--primary-accent)] text-white shadow-sm scale-[1.03]' 
                                    : 'bg-[var(--surface-elevated)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-secondary)]'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CART AND BUY ACTIONS */}
                    <div className="pt-4 border-t space-y-3" style={{ borderColor: activeColors.border }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[var(--muted-text)]">Base Retail Price</span>
                        <span className="text-2xl font-black font-mono text-[var(--primary-accent)]">${selectedProduct.price}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleAddToCart(selectedProduct, 1)}
                          className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-md"
                          style={{ backgroundColor: activeColors.primaryAccent }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => {
                            handleAddToCart(selectedProduct, 1);
                            setShowroomTab('checkout');
                          }}
                          className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform hover:scale-102"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: CART PAGE */}
              {showroomTab === 'cart' && (
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold font-sans mb-6">Shopping Cart ({cart.length} items)</h3>
                  
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-[var(--text-secondary)]">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold">Your cart is currently empty</h4>
                      <p className="text-xs text-[var(--muted-text)] mt-1 mb-4">Add interactive products to proceed to checkout simulation.</p>
                      <button 
                        onClick={() => setShowroomTab('products')} 
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                        style={{ backgroundColor: activeColors.primaryAccent }}
                      >
                        Browse Showcase
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* CART ITEMS LIST */}
                      <div className="lg:col-span-8 flex flex-col gap-4">
                        {cart.map((item, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-4 bg-[var(--background)] p-4 rounded-xl border"
                            style={{ borderColor: activeColors.border }}
                          >
                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-contain shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold font-sans truncate">{item.product.name}</h4>
                              <p className="text-[10px] text-cyan-500 font-mono mt-0.5">{item.selectedVariants}</p>
                              <span className="text-xs font-mono font-bold mt-1 block">${item.product.price}</span>
                            </div>

                            {/* QUANTITY AND DELETE ACTIONS */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 border rounded-lg overflow-hidden bg-[var(--surface)]" style={{ borderColor: activeColors.border }}>
                                <button 
                                  onClick={() => updateCartQty(item.product.id, item.selectedVariants, false)}
                                  className="p-1 px-2.5 hover:bg-[var(--surface-elevated)]"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono px-2 font-semibold">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQty(item.product.id, item.selectedVariants, true)}
                                  className="p-1 px-2.5 hover:bg-[var(--surface-elevated)]"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button 
                                onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                                className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* SUMMARY BILL */}
                      <div className="lg:col-span-4 bg-[var(--surface-elevated)]/60 rounded-2xl p-6 border flex flex-col gap-4" style={{ borderColor: activeColors.border }}>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Subtotal Summary</h4>
                        
                        <div className="space-y-2 border-b pb-3 text-xs" style={{ borderColor: activeColors.border }}>
                          <div className="flex justify-between">
                            <span className="opacity-75">Subtotal Items</span>
                            <span className="font-mono font-bold">${cartSubtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-75">Secure Courier Courier</span>
                            <span className="font-mono font-bold">$15.00</span>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm font-bold pt-1">
                          <span>Total due</span>
                          <span className="font-mono text-[var(--primary-accent)]">${cartTotal.toFixed(2)}</span>
                        </div>

                        <button 
                          onClick={() => setShowroomTab('checkout')}
                          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white text-center mt-3 cursor-pointer shadow-md"
                          style={{ backgroundColor: activeColors.primaryAccent }}
                        >
                          Checkout Securely
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 5: CHECKOUT PAGE */}
              {showroomTab === 'checkout' && (
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT: SHIPPING SPEC SHELLS */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setValidationSuccess("Simulated validation successful. Your secure order schema has been registered on the server!");
                      setCart([]);
                    }}
                    className="lg:col-span-8 flex flex-col gap-5 bg-[var(--background)] p-6 rounded-2xl border"
                    style={{ borderColor: activeColors.border }}
                  >
                    <h3 className="text-base font-bold font-sans flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      Checkout Shipping Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">Recipient full name</label>
                        <input 
                          type="text" 
                          required 
                          value={address.fullName}
                          onChange={(e) => setAddress({...address, fullName: e.target.value})}
                          placeholder="e.g. Dr. Ada Lovelace" 
                          className="w-full bg-[var(--surface)] border px-3 py-2 rounded-xl text-xs focus:ring-1 focus:outline-none"
                          style={{ borderColor: activeColors.border }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">Street Address</label>
                        <input 
                          type="text" 
                          required 
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                          placeholder="100 Silicon Boulevard" 
                          className="w-full bg-[var(--surface)] border px-3 py-2 rounded-xl text-xs focus:ring-1 focus:outline-none"
                          style={{ borderColor: activeColors.border }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">City</label>
                        <input 
                          type="text" 
                          required 
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          placeholder="Palo Alto" 
                          className="w-full bg-[var(--surface)] border px-3 py-2 rounded-xl text-xs focus:ring-1 focus:outline-none"
                          style={{ borderColor: activeColors.border }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">State / Province</label>
                        <input 
                          type="text" 
                          required 
                          value={address.state}
                          onChange={(e) => setAddress({...address, state: e.target.value})}
                          placeholder="California" 
                          className="w-full bg-[var(--surface)] border px-3 py-2 rounded-xl text-xs focus:ring-1 focus:outline-none"
                          style={{ borderColor: activeColors.border }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">Zip / Postal Code</label>
                        <input 
                          type="text" 
                          required 
                          value={address.postalCode}
                          onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                          placeholder="94301" 
                          className="w-full bg-[var(--surface)] border px-3 py-2 rounded-xl text-xs focus:ring-1 focus:outline-none"
                          style={{ borderColor: activeColors.border }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">Payment Method</label>
                        <select 
                          value={address.paymentMethod}
                          onChange={(e) => setAddress({...address, paymentMethod: e.target.value})}
                          className="w-full bg-[var(--surface)] border px-3 py-2 rounded-xl text-xs focus:ring-1 focus:outline-none"
                          style={{ borderColor: activeColors.border }}
                        >
                          <option value="credit">Stripe Secure Card Placeholder</option>
                          <option value="paypal">PayPal Ledger Placeholder</option>
                        </select>
                      </div>
                    </div>

                    {validationSuccess && (
                      <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-start gap-2 text-xs border border-emerald-500/20">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Purchase Seed Transmitted!</span>
                          <span>{validationSuccess}</span>
                        </div>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={cart.length === 0 && !validationSuccess}
                      className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white text-center mt-2 disabled:opacity-50"
                      style={{ backgroundColor: activeColors.primaryAccent }}
                    >
                      {validationSuccess ? 'Order Logged' : 'Submit Secured Checkout'}
                    </button>
                  </form>

                  {/* RIGHT: BILL PREVIEW */}
                  <div className="lg:col-span-4 bg-[var(--surface)] p-6 rounded-2xl border flex flex-col gap-4" style={{ borderColor: activeColors.border }}>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Checkout Order Summary</h4>

                    <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">
                      {cart.length === 0 && !validationSuccess ? (
                        <span className="text-xs text-[var(--muted-text)]">No pending items.</span>
                      ) : validationSuccess ? (
                        <div className="text-xs text-emerald-500 flex items-center gap-1">
                          <FileCheck className="w-4 h-4" /> Secured order generated!
                        </div>
                      ) : (
                        cart.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="truncate max-w-[150px] opacity-80">{item.product.name} (x{item.quantity})</span>
                            <span className="font-mono font-bold shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {!validationSuccess && cart.length > 0 && (
                      <div className="space-y-2 border-t pt-3 text-xs" style={{ borderColor: activeColors.border }}>
                        <div className="flex justify-between">
                          <span className="opacity-75">Subtotal Items</span>
                          <span className="font-mono font-bold">${cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-1">
                          <span>Total due</span>
                          <span className="font-mono text-[var(--primary-accent)]">${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STEP-BY-STEP SETUP GUIDE */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* INSTRUCTIONS */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-[var(--surface)] p-6 rounded-2xl border flex flex-col gap-4" style={{ borderColor: activeColors.border }}>
                <h3 className="text-lg font-bold font-sans">Full-Stack Solution Setup & Orchestration</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Execute these terminal operations inside your target environments to spin up the SQL Server schemas and local Angular developer server.
                </p>

                {/* COMMAND BLOCK 1 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-accent)] block">1. ASP.NET 10 Web API Core Initialization</span>
                  <div className="bg-[#0c0d14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto relative group">
                    <pre>{`# Navigate to back-end solution directory
cd backend/

# Restore NuGet dependencies
dotnet restore

# Run Entity Framework core migrations to generate localized databases
dotnet ef database update --project Ecommerce.Infrastructure --startup-project Ecommerce.Api

# Start the Web API Swagger listener
dotnet run --project Ecommerce.Api`}</pre>
                  </div>
                </div>

                {/* COMMAND BLOCK 2 */}
                <div className="space-y-2 pt-4 border-t" style={{ borderColor: activeColors.border }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary-accent)] block">2. Angular standalone frontend Setup</span>
                  <div className="bg-[#0c0d14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 overflow-x-auto">
                    <pre>{`# Navigate to client directory
cd frontend/

# Install workspace dependencies (Three.js, styling tokens, Lucide icons)
npm install

# Start development livereload server
ng serve -o`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* DB Normalization details */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[var(--surface)] p-6 rounded-2xl border flex flex-col gap-4" style={{ borderColor: activeColors.border }}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-accent)]">Normalized relational database schema</h4>
                
                <div className="space-y-3.5 text-xs text-[var(--text-secondary)]">
                  <div className="border-l-2 pl-3 py-0.5" style={{ borderLeftColor: activeColors.primaryAccent }}>
                    <span className="font-bold block text-[var(--text-primary)]">Products & Categories (1:N)</span>
                    <span className="text-[11px]">Enables rapid sorting metrics and search-friendly indexing.</span>
                  </div>
                  <div className="border-l-2 pl-3 py-0.5" style={{ borderLeftColor: activeColors.primaryAccent }}>
                    <span className="font-bold block text-[var(--text-primary)]">Orders & OrderItems (1:N)</span>
                    <span className="text-[11px]">Captures snapshotted unit pricing at transaction date for financial safety.</span>
                  </div>
                  <div className="border-l-2 pl-3 py-0.5" style={{ borderLeftColor: activeColors.primaryAccent }}>
                    <span className="font-bold block text-[var(--text-primary)]">Anonymous Cart Sessions</span>
                    <span className="text-[11px]">Binds cart items to session UUID, transferring seamlessly upon secure Customer Login.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t py-6 px-6 text-center text-xs text-[var(--muted-text)]" style={{ borderColor: activeColors.border }}>
        <p>Production Starter Template Engine © 2026. Codebase files generated perfectly onto local storage. Export via AI Studio ZIP tool.</p>
      </footer>
    </div>
  );
}
