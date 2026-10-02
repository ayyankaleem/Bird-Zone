import React, { useState } from 'react';
import { Bird, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Key, Info } from 'lucide-react';
import { api, AdminUser } from '../../services/api';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onNavigateToStorefront: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateToStorefront }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(email.trim(), password);
      onLoginSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: 'owner' | 'staff') => {
    if (role === 'owner') {
      setEmail('admin@birdzone.pk');
      setPassword('BirdZone@Wapda2026!');
    } else {
      setEmail('staff@birdzone.pk');
      setPassword('Staff@Wapda2026!');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#153D2C] via-[#103023] to-[#0A2016] flex flex-col justify-center items-center p-4 relative font-sans text-stone-200">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#3C8053]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#E9BE69]/15 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white text-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-100 relative z-10">
        
        {/* Card Header */}
        <div className="bg-[#153D2C] px-8 pt-8 pb-7 text-white text-center relative border-b border-[#235841]">
          <div className="w-14 h-14 rounded-2xl bg-[#3C8053] flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Bird className="w-8 h-8 text-[#E9BE69]" />
          </div>
          <h1 className="text-xl font-bold font-['Montserrat'] tracking-tight">
            Bird Zone <span className="text-[#E9BE69]">Wapda Town</span>
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Store Management & Administration Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Failed</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@birdzone.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#3C8053] focus:ring-1 focus:ring-[#3C8053] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#3C8053] focus:ring-1 focus:ring-[#3C8053] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3C8053]" />
                <span>JWT Secure Session</span>
              </div>
              <span className="text-[11px] text-stone-400">Lahore, PK</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white font-semibold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-2">
              <Info className="w-3.5 h-3.5 text-[#3C8053]" />
              <span>Initial Configured Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('owner')}
                className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-bold block text-stone-900 text-[11px]">Owner Account</span>
                <span className="text-[10px] text-stone-500 block truncate">admin@birdzone.pk</span>
                <span className="text-[9px] text-[#3C8053] font-semibold">Auto-fill &rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('staff')}
                className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-bold block text-stone-900 text-[11px]">Staff Account</span>
                <span className="text-[10px] text-stone-500 block truncate">staff@birdzone.pk</span>
                <span className="text-[9px] text-[#3C8053] font-semibold">Auto-fill &rarr;</span>
              </button>
            </div>
          </div>

          {/* Back to storefront link */}
          <div className="mt-4 text-center">
            <button
              onClick={onNavigateToStorefront}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer font-medium"
            >
              &larr; Return to Customer Storefront
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <p className="mt-6 text-xs text-stone-400">
        © {new Date().getFullYear()} Bird Zone Wapda Town · Commercial Area Phase 1, Lahore
      </p>
    </div>
  );
};
