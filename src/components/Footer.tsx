import React from 'react';
import { ShoppingBag, Shield, Mail, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 font-sans pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('#/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-white text-sm font-black uppercase tracking-tight">APEX MARKETPLACE</h2>
              <p className="text-[9px] font-mono opacity-50">PREMIUM OBJECTS</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed max-w-xs text-slate-400">
            Secure decentralized marketplace hosting verified merchant stores, neural processing modules, and performance-enhanced cyber accessories.
          </p>
          <div className="flex gap-3 text-slate-500">
            <Shield className="w-4 h-4 hover:text-white transition-colors" />
            <Mail className="w-4 h-4 hover:text-white transition-colors" />
            <Globe className="w-4 h-4 hover:text-white transition-colors" />
          </div>
        </div>

        {/* Store Navigation links */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('#/products')} className="hover:text-white transition-colors">
                Cyberwear & Apparel
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/products')} className="hover:text-white transition-colors">
                Neural & Electronics
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/products')} className="hover:text-white transition-colors">
                Kinetic Gear & Footwear
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/products')} className="hover:text-white transition-colors">
                Premium Accessories
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care Services */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Support</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('#/account/orders')} className="hover:text-white transition-colors">
                Track Order Status
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/account/addresses')} className="hover:text-white transition-colors">
                Shipping & Addresses
              </button>
            </li>
            <li>
              <span className="opacity-70">Return Policies (Simulated)</span>
            </li>
            <li>
              <span className="opacity-70">SSL Cryptographic Security Info</span>
            </li>
          </ul>
        </div>

        {/* Trust Badging and certification */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Platform Standards</h3>
          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OWASP-SECURED GATEWAY</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All transactions are processed through encrypted mock routing. Storefront items, prices, and merchant records are fully synchronized.
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 Apex Marketplace Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
          <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
        </div>
      </div>
    </footer>
  );
}
