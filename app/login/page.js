'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { Mail, Lock, Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      const role = result.user.role;
      if (role === 'donor') router.push('/dashboard');
      else if (role === 'ngo') router.push('/ngo');
      else if (role === 'volunteer') router.push('/volunteer');
      else if (role === 'admin') router.push('/admin');
      else router.push('/');
    } else {
      setError(result.error);
    }
  };

  const demoAccounts = [
    { label: 'Donor', email: 'rajesh@restaurant.com', password: 'password123' },
    { label: 'NGO', email: 'ananya@ngo.org', password: 'password123' },
    { label: 'Volunteer', email: 'vikram@volunteer.com', password: 'password123' },
    { label: 'Admin', email: 'admin@foodbridge.org', password: 'admin123' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative text-center max-w-md">
          <div className="w-20 h-20 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-slate-300 leading-relaxed">
            Your next food rescue is just a login away. Continue making a difference in your community.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-800">FoodBridge</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign In</h1>
          <p className="text-slate-500 mb-8">Enter your credentials to access your account.</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gradient-brand text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700">Sign Up</Link>
          </p>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.label}
                  onClick={() => { setEmail(demo.email); setPassword(demo.password); }}
                  className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
