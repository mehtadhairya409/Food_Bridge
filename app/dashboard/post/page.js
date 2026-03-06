'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useDonations } from '@/lib/context/DonationContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import {
  Utensils, Users, Clock, MapPin, Camera, FileText, ArrowLeft,
  Check, Leaf, Drumstick
} from 'lucide-react';

export default function PostDonationPage() {
  const { user, loading } = useAuth();
  const { addDonation } = useDonations();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    foodName: '',
    quantity: '',
    servings: '',
    foodType: 'veg',
    expiryHours: 4,
    pickupAddress: '',
    instructions: '',
    image: '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'donor')) router.push('/login');
  }, [user, loading, router]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const donation = addDonation({
      donorId: user.id,
      donorName: user.organization || user.name,
      foodName: form.foodName,
      quantity: form.quantity,
      servings: parseInt(form.servings) || 0,
      foodType: form.foodType,
      expiryTime: new Date(Date.now() + form.expiryHours * 60 * 60 * 1000).toISOString(),
      pickupAddress: form.pickupAddress || user.address,
      lat: user.lat || 12.9716,
      lng: user.lng || 77.5946,
      image: form.image || '/food/generic.jpg',
      instructions: form.instructions,
    });

    addNotification({
      userId: user.id,
      type: 'donation_posted',
      title: 'Donation Posted!',
      message: `Your donation of ${form.foodName} is now live. Nearby NGOs will be notified.`,
    });

    setFormLoading(false);
    setSubmitted(true);
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md">
          <div className="w-20 h-20 gradient-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Donation Posted! 🎉</h2>
          <p className="text-slate-500 mb-8">
            Your food donation is now live. Nearby NGOs and volunteers will be notified immediately.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setForm({ foodName: '', quantity: '', servings: '', foodType: 'veg', expiryHours: 4, pickupAddress: '', instructions: '', image: '' }); }}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition">
              Post Another
            </button>
            <button onClick={() => router.push('/dashboard')}
              className="px-6 py-3 gradient-brand text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition">
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Post Surplus Food</h1>
        <p className="text-slate-500 mb-8">Share your surplus food and help feed someone in need today.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Food Name *</label>
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={form.foodName} onChange={(e) => update('foodName', e.target.value)} required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                placeholder="e.g., Vegetable Biryani" />
            </div>
          </div>

          {/* Quantity & Servings */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity *</label>
              <input type="text" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                placeholder="e.g., 15 kg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Servings (people) *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="number" value={form.servings} onChange={(e) => update('servings', e.target.value)} required min={1}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  placeholder="50" />
              </div>
            </div>
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Food Type *</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => update('foodType', 'veg')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition ${
                  form.foodType === 'veg' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                <Leaf className="w-5 h-5" /> Vegetarian
              </button>
              <button type="button" onClick={() => update('foodType', 'non-veg')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition ${
                  form.foodType === 'non-veg' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                <Drumstick className="w-5 h-5" /> Non-Vegetarian
              </button>
            </div>
          </div>

          {/* Expiry Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" /> Food will be fresh for *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((h) => (
                <button key={h} type="button" onClick={() => update('expiryHours', h)}
                  className={`py-3 rounded-xl border-2 font-medium text-sm transition ${
                    form.expiryHours === h ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {h} hours
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Pickup Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea value={form.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} required rows={2}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                placeholder="Full address for pickup" />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Food Image URL (optional)</label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="url" value={form.image} onChange={(e) => update('image', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                placeholder="https://example.com/food-image.jpg" />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Special Instructions</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea value={form.instructions} onChange={(e) => update('instructions', e.target.value)} rows={3}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                placeholder="e.g., Please bring containers. Keep warm." />
            </div>
          </div>

          <button type="submit" disabled={formLoading}
            className="w-full py-4 gradient-brand text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2 text-lg disabled:opacity-60">
            {formLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Utensils className="w-5 h-5" /> Post Donation</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
