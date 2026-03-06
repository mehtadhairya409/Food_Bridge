'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useDonations } from '@/lib/context/DonationContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { getTimeRemaining, getFreshnessLevel, getStatusConfig, formatTimeAgo } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { generateQRData } from '@/lib/utils';
import {
  Package, CheckCircle, Truck, Clock, MapPin, Users,
  TrendingUp, Utensils, HandHeart, Star, QrCode, X
} from 'lucide-react';

export default function NGODashboard() {
  const { user, loading } = useAuth();
  const { donations, claimDonation, acceptDonation, markCollected, markDelivered } = useDonations();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [tab, setTab] = useState('available');
  const [qrModal, setQrModal] = useState(null);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'ngo' && user.role !== 'donor'))) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const available = donations.filter((d) => d.status === 'available');
  const claimed = donations.filter((d) => d.claimedBy === user.id);
  const myActive = donations.filter((d) => d.claimedBy === user.id && ['requested', 'accepted'].includes(d.status));
  const myCompleted = donations.filter((d) => d.claimedBy === user.id && ['collected', 'delivered'].includes(d.status));

  const handleClaim = (donationId) => {
    claimDonation(donationId, user.id);
    addNotification({ userId: user.id, type: 'claim', title: 'Donation Claimed', message: 'You have claimed a food donation. The donor will be notified.' });
  };

  const handleAccept = (donationId) => {
    acceptDonation(donationId);
    addNotification({ userId: user.id, type: 'accepted', title: 'Pickup Accepted', message: 'Donation accepted for pickup.' });
  };

  const handleCollect = (donationId) => {
    markCollected(donationId);
    addNotification({ userId: user.id, type: 'collected', title: 'Food Collected!', message: 'Food has been collected successfully.' });
  };

  const handleDeliver = (donationId) => {
    markDelivered(donationId);
    addNotification({ userId: user.id, type: 'delivered', title: 'Food Delivered! 🎉', message: 'Food has been delivered to people in need.' });
  };

  const tabItems = [
    { id: 'available', label: 'Available', count: available.length, icon: Package },
    { id: 'active', label: 'My Active', count: myActive.length, icon: Truck },
    { id: 'completed', label: 'Completed', count: myCompleted.length, icon: CheckCircle },
  ];

  const currentList = tab === 'available' ? available : tab === 'active' ? myActive : myCompleted;

  const stats = [
    { icon: HandHeart, label: 'Total Collections', value: claimed.length, color: 'bg-brand-500' },
    { icon: Users, label: 'People Served', value: user.peopleServed || claimed.reduce((s, d) => s + (d.servings || 0), 0), color: 'bg-accent-500' },
    { icon: Truck, label: 'Active Pickups', value: myActive.length, color: 'bg-blue-500' },
    { icon: TrendingUp, label: 'Delivered', value: myCompleted.length, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">NGO Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage food collections and distributions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
        {tabItems.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${tab === t.id ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Donation Cards */}
      {currentList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No donations in this category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map((donation, i) => {
            const freshness = getFreshnessLevel(donation.expiryTime);
            const timeLeft = getTimeRemaining(donation.expiryTime);
            const status = getStatusConfig(donation.status);

            return (
              <motion.div key={donation.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{donation.foodName}</h3>
                    <p className="text-sm text-slate-500">{donation.donorName}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color} uppercase`}>{status.label}</span>
                </div>

                {/* Freshness */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {timeLeft.text}</span>
                    <span className={`font-medium ${freshness.level === 'critical' ? 'text-red-500' : 'text-emerald-600'}`}>{freshness.label}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${freshness.color}`} style={{ width: `${freshness.percentage}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> {donation.servings} servings · {donation.quantity}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> <span className="truncate">{donation.pickupAddress}</span></div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {donation.status === 'available' && (
                    <button onClick={() => handleClaim(donation.id)} className="flex-1 py-2 gradient-brand text-white text-sm font-medium rounded-xl hover:opacity-90 transition">
                      Claim Donation
                    </button>
                  )}
                  {donation.status === 'requested' && donation.claimedBy === user.id && (
                    <button onClick={() => handleAccept(donation.id)} className="flex-1 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition">
                      Accept Pickup
                    </button>
                  )}
                  {donation.status === 'accepted' && donation.claimedBy === user.id && (
                    <>
                      <button onClick={() => handleCollect(donation.id)} className="flex-1 py-2 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition">
                        Mark Collected
                      </button>
                      <button onClick={() => setQrModal(donation.id)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition">
                        <QrCode className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {donation.status === 'collected' && donation.claimedBy === user.id && (
                    <button onClick={() => handleDeliver(donation.id)} className="flex-1 py-2 bg-teal-500 text-white text-sm font-medium rounded-xl hover:bg-teal-600 transition">
                      Mark Delivered ✓
                    </button>
                  )}
                  {donation.status === 'delivered' && (
                    <div className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Delivered
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setQrModal(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative">
            <button onClick={() => setQrModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Pickup Verification QR</h3>
            <p className="text-sm text-slate-500 mb-6">Show this to the donor to verify your identity.</p>
            <div className="inline-block p-4 bg-white border-2 border-slate-100 rounded-2xl">
              <QRCodeSVG value={generateQRData(qrModal)} size={200} level="H" />
            </div>
            <p className="mt-4 text-xs text-slate-400">Code: FB-{qrModal}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
