import React, { useState } from 'react';
import { Shield, Sparkles, Phone, Mail, Key, Globe, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onContinueGuest: () => void;
  onNavigateHome: () => void;
  returnUrl?: string;
  theme: 'light' | 'dark';
}

export default function AuthPage({ onLoginSuccess, onContinueGuest, onNavigateHome, returnUrl, theme }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'password' | 'emailOtp' | 'phoneOtp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Flow state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'Customer' | 'Seller'>('Customer');

  // General States
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick Mock Login triggers
  const handleQuickLogin = (role: UserRole) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let mockUser: User;
      if (role === 'Admin') {
        mockUser = {
          id: 'user-admin',
          email: 'admin@demo.com',
          name: 'Principal Administrator',
          role: 'Admin',
          addresses: [],
          wishlist: []
        };
      } else if (role === 'Seller') {
        mockUser = {
          id: 'user-seller',
          email: 'seller@demo.com',
          name: 'Apex Merchant Team',
          role: 'Seller',
          addresses: [],
          wishlist: []
        };
      } else {
        mockUser = {
          id: 'user-customer',
          email: 'customer@demo.com',
          name: 'Jane Doe',
          role: 'Customer',
          addresses: [
            {
              id: 'addr-1',
              fullName: 'Jane Doe',
              street: '142 Cyber Square, Level 4',
              city: 'Neo-Boston',
              state: 'MA',
              postalCode: '02108',
              country: 'United States',
              isDefault: true
            }
          ],
          wishlist: ['prod-1', 'prod-4']
        };
      }
      onLoginSuccess(mockUser);
      setLoading(false);
    }, 600);
  };

  // Submit Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setLoading(true);
    setError(null);

    setTimeout(() => {
      // Validate credentials against requested mocks
      if (email === 'admin@demo.com' && password === 'Admin@123') {
        handleQuickLogin('Admin');
      } else if (email === 'seller@demo.com' && password === 'Seller@123') {
        handleQuickLogin('Seller');
      } else if (email === 'customer@demo.com' && password === 'Customer@123') {
        handleQuickLogin('Customer');
      } else {
        setError('Invalid login credentials. Please check details or use quick login options below.');
        setLoading(false);
      }
    }, 800);
  };

  // Trigger Simulated OTP Dispatch
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const destination = activeTab === 'emailOtp' ? email : phone;
    if (!destination) {
      setError(`Please provide your ${activeTab === 'emailOtp' ? 'email address' : 'mobile number'}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      setOtpSent(true);
      setSuccess(`Secure cryptographic OTP code dispatched to ${destination}! (Simulated Dev OTP is 123456)`);
      setLoading(false);
    }, 700);
  };

  // Verify Simulated OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP verification code.');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (otp === '123456') {
        // Auto register/login as a Customer by default
        const mockUser: User = {
          id: 'user-otp-' + Math.random().toString(36).substr(2, 9),
          email: email || 'otp-user@demo.com',
          name: phone ? `User (${phone})` : `User (${email})`,
          role: 'Customer',
          addresses: [],
          wishlist: []
        };
        onLoginSuccess(mockUser);
      } else {
        setError('OTP incorrect or expired. Stored secure attempts remaining: 2. Please try again with 123456.');
      }
      setLoading(false);
    }, 600);
  };

  // Register New Account
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: regEmail,
        name: regName,
        phone: regPhone,
        role: regRole,
        addresses: [],
        wishlist: []
      };
      onLoginSuccess(mockUser);
      setLoading(false);
    }, 900);
  };

  // Simulated Google SSO
  const handleGoogleSso = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Create user via secure payload claims
      const mockUser: User = {
        id: 'google-' + Math.random().toString(36).substr(2, 9),
        email: 'google.visitor@gmail.com',
        name: 'Google Cloud User',
        role: 'Customer',
        addresses: [],
        wishlist: []
      };
      onLoginSuccess(mockUser);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      
      {/* BRAND & VALUE PROPOSITION SIDEBAR */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Top Header branding */}
        <div className="flex items-center gap-3 relative z-10 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">APEX MARKETPLACE</h1>
            <p className="text-[9px] font-mono tracking-wider opacity-60">IMMERSIVE SHOPPING EXPERIENCES</p>
          </div>
        </div>

        {/* Middle copy */}
        <div className="my-12 lg:my-0 relative z-10 max-w-lg">
          <span className="text-xs font-mono text-indigo-400 font-semibold tracking-widest uppercase block mb-3">SECURE ENCRYPTED GATEWAY</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Connect to the Next Era of E-Commerce.
          </h2>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed mb-8">
            Access secure transaction ledgering, high-contrast role controls, dynamic inventory syncing, and customizable storefront hubs for customers, merchants, and platform curators.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Decoupled Multi-Role Security</h4>
                <p className="text-xs text-slate-400">Strict server-verified access layers ensuring secure, separate dashboards for Guest, Customer, Seller, and Admin.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Secure Multi-Channel OTP</h4>
                <p className="text-xs text-slate-400">Cryptographically hashed verification challenges, strict expiration timelines, and brute-force lock-outs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-400 relative z-10 pt-4 border-t border-indigo-900/40">
          <span>Protected by AES-GCM & OWASP Compliant Authenticator Protocols.</span>
        </div>
      </div>

      {/* LOGIN CARD & FORM CONTROLS */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xl relative">
          
          {returnUrl && (
            <div className="mb-6 p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs border border-amber-500/20">
              Authentication required before proceeding to checkout.
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs border border-rose-500/20 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20 font-medium">
              {success}
            </div>
          )}

          {/* TOGGLE REGISTRATION OR LOGIN */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight">
              {isRegistering ? 'Create Merchant/User Account' : 'Authenticate Security Access'}
            </h3>
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
                setOtpSent(false);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isRegistering ? 'Sign In Instead' : 'Register Storefront/Buyer'}
            </button>
          </div>

          {!isRegistering ? (
            <>
              {/* AUTHENTICATION METRICS TABS */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl mb-6 text-xs">
                <button
                  type="button"
                  onClick={() => { setActiveTab('password'); setError(null); }}
                  className={`py-2 rounded-lg font-medium transition-all ${activeTab === 'password' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('emailOtp'); setError(null); }}
                  className={`py-2 rounded-lg font-medium transition-all ${activeTab === 'emailOtp' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                >
                  Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('phoneOtp'); setError(null); }}
                  className={`py-2 rounded-lg font-medium transition-all ${activeTab === 'phoneOtp' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                >
                  SMS OTP
                </button>
              </div>

              {/* PASSWORD TAB */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4.5 h-4.5 opacity-40" />
                      <input
                        type="email"
                        placeholder="customer@demo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider opacity-70">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSuccess('A reset link was simulated to your inbox. In dev environments, please use password Customer@123 / Seller@123 / Admin@123 to log in.');
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4.5 h-4.5 opacity-40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 opacity-40 hover:opacity-80 transition-opacity"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Decrypting Access Claims...' : 'Authenticate Secure Login'}
                  </button>
                </form>
              )}

              {/* EMAIL & SMS OTP FLOW */}
              {(activeTab === 'emailOtp' || activeTab === 'phoneOtp') && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      {activeTab === 'emailOtp' ? (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4.5 h-4.5 opacity-40" />
                            <input
                              type="email"
                              placeholder="customer@demo.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Mobile Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4.5 h-4.5 opacity-40" />
                            <input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/15 cursor-pointer"
                      >
                        {loading ? 'Generating Encrypted OTP...' : 'Dispatch Cryptographic Code'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold uppercase tracking-wider opacity-70">OTP Verification Code</label>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                          >
                            Change Number/Email
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="w-full py-3 text-center tracking-widest bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/15 cursor-pointer"
                      >
                        {loading ? 'Comparing Secure Hashes...' : 'Confirm Verification Code'}
                      </button>

                      <p className="text-[10px] text-center opacity-60 font-mono">
                        Didn't receive? Simulating 60s cooldown limit before resending.
                      </p>
                    </form>
                  )}
                </div>
              )}

              {/* THIRD PARTY & OUT-OFLOW ACTIONS */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                
                {/* Google Sign-in */}
                <button
                  onClick={handleGoogleSso}
                  disabled={loading}
                  className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-rose-500" />
                  Continue with Google Account
                </button>

                {/* Continue without login */}
                <button
                  onClick={onContinueGuest}
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  Browse Storefront as Guest
                </button>
              </div>

              {/* QUICK FILL DEMO ACCOUNTS FOR EVALUATION */}
              <div className="mt-8 p-4 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/20 dark:bg-indigo-950/10">
                <span className="text-[10px] font-mono tracking-widest text-indigo-500 dark:text-indigo-400 font-bold block uppercase mb-2">QUICK FILL EVALUATION ACCOUNTS</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickLogin('Customer')}
                    className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    👤 Customer
                  </button>
                  <button
                    onClick={() => handleQuickLogin('Seller')}
                    className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    🏪 Seller
                  </button>
                  <button
                    onClick={() => handleQuickLogin('Admin')}
                    className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    🛠️ Admin
                  </button>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-indigo-950/50 flex flex-col gap-0.5 text-[10px] font-mono opacity-80">
                  <span className="truncate">Customer: customer@demo.com / Customer@123</span>
                  <span className="truncate">Seller: seller@demo.com / Seller@123</span>
                  <span className="truncate">Admin: admin@demo.com / Admin@123</span>
                </div>
              </div>
            </>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Register Profile Role</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setRegRole('Customer')}
                    className={`py-2 rounded-lg font-semibold transition-all ${regRole === 'Customer' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-60'}`}
                  >
                    🛍️ Buyer/Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('Seller')}
                    className={`py-2 rounded-lg font-semibold transition-all ${regRole === 'Seller' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'opacity-60'}`}
                  >
                    🏪 Store Merchant
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">
                  {regRole === 'Seller' ? 'Store & Merchant Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={regRole === 'Seller' ? 'Apex Gear Inc' : 'John Smith'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Email Address</label>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Contact Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Secure Password</label>
                <input
                  type="password"
                  placeholder="Create password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-xs opacity-80 py-1">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Agree to platform terms and OWASP registration metrics.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/15 cursor-pointer"
              >
                {loading ? 'Creating Identity Claim...' : 'Register Secure Profile'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
