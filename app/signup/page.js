'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { Mail, Lock, User, Phone, MapPin, Building2, Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';

const ROLES = [
  { value: 'donor', label: 'Food Donor', desc: 'Restaurants, hotels, event organizers', icon: '🍽️', color: 'border-brand-500 bg-brand-50' },
  { value: 'ngo', label: 'NGO / Receiver', desc: 'NGOs, charities, food banks', icon: '🏛️', color: 'border-accent-500 bg-accent-50' },
  { value: 'volunteer', label: 'Volunteer', desc: 'Help deliver food to those in need', icon: '🤝', color: 'border-purple-500 bg-purple-50' },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: '', organization: '', type: '',
  });

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = signup(form);
    setLoading(false);

    if (result.success) {
      const role = result.user.role;
      if (role === 'donor') router.push('/dashboard');
      else if (role === 'ngo') router.push('/ngo');
      else if (role === 'volunteer') router.push('/volunteer');
      else router.push('/');
    } else {
      setError(result.error);
    }
  };

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
          <h2 className="text-3xl font-bold text-white mb-4">Join the Movement</h2>
          <p className="text-slate-300 leading-relaxed">
            Be part of a community that turns surplus food into smiles. Every registration brings us closer to zero hunger.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
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

          <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-500 mb-6">Step {step} of 2 — {step === 1 ? 'Choose your role' : 'Fill in your details'}</p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'gradient-brand' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'gradient-brand' : 'bg-slate-200'}`} />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => {
                    updateForm('role', role.value);
                    updateForm('type', role.label);
                    setStep(2);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    form.role === role.value ? role.color + ' border-2' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-3xl">{role.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">{role.label}</p>
                    <p className="text-xs text-slate-500">{role.desc}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateForm('password', e.target.value)} required minLength={6}
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="+91 98765 43210" />
                </div>
              </div>

              {form.role !== 'volunteer' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={form.organization} onChange={(e) => updateForm('organization', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="Organization name" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea value={form.address} onChange={(e) => updateForm('address', e.target.value)} rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none" placeholder="Your address" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 gradient-brand text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
