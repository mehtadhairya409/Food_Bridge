'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useDonations } from '@/lib/context/DonationContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { getTimeRemaining, getStatusConfig, formatTimeAgo } from '@/lib/utils';
import { BADGES } from '@/lib/data';
import {
  Truck, Package, Clock, MapPin, Users, CheckCircle,
  Star, Award, Zap, TrendingUp, Route, ArrowRight
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { user, loading } = useAuth();
  const { donations, assignVolunteer, markCollected, markDelivered } = useDonations();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [tab, setTab] = useState('available');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'volunteer')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const acceptedNeedingPickup = donations.filter((d) => d.status === 'accepted' && !d.volunteerId);
  const myDeliveries = donations.filter((d) => d.volunteerId === user.id);
  const activeDeliveries = myDeliveries.filter((d) => ['accepted', 'collected'].includes(d.status));
  const completedDeliveries = myDeliveries.filter((d) => d.status === 'delivered');

  const handleJoinPickup = (donationId) => {
    assignVolunteer(donationId, user.id);
    addNotification({ userId: user.id, type: 'assigned', title: 'Delivery Assigned', message: 'You have been assigned a food delivery.' });
  };

  const handlePickedUp = (donationId) => {
    markCollected(donationId);
    addNotification({ userId: user.id, type: 'collected', title: 'Food Collected', message: 'Food collected successfully. Head to the delivery point.' });
  };

  const handleDelivered = (donationId) => {
    markDelivered(donationId);
    addNotification({ userId: user.id, type: 'delivered', title: 'Delivery Complete! 🎉', message: 'Thank you for delivering food to those in need!' });
  };

  const stats = [
    { icon: Truck, label: 'Total Deliveries', value: myDeliveries.length, color: 'bg-brand-500' },
    { icon: Clock, label: 'Hours Volunteered', value: user.hoursVolunteered || 0, color: 'bg-accent-500' },
    { icon: Package, label: 'Active Pickups', value: activeDeliveries.length, color: 'bg-blue-500' },
    { icon: Star, label: 'Completed', value: completedDeliveries.length, color: 'bg-purple-500' },
  ];

  const tabItems = [
    { id: 'available', label: 'Available Pickups', count: acceptedNeedingPickup.length },
    { id: 'active', label: 'My Deliveries', count: activeDeliveries.length },
    { id: 'completed', label: 'Completed', count: completedDeliveries.length },
  ];

  const currentList = tab === 'available' ? acceptedNeedingPickup : tab === 'active' ? activeDeliveries : completedDeliveries;

  // Earned badges (simplified)
  const earnedBadges = BADGES.filter((b) =>
    user.badges?.includes(b.name) ||
    (b.id === 'first_donation' && myDeliveries.length >= 1) ||
    (b.id === 'speed_runner' && completedDeliveries.length >= 5)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Volunteer Hub 🤝</h1>
        <p className="text-slate-500 mt-1">Pick up food donations and deliver them to people in need</p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
            {tabItems.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {t.label}
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${tab === t.id ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'}`}>{t.count}</span>
              </button>
            ))}
          </div>

          {currentList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">{tab === 'available' ? 'No pickups available right now.' : 'No deliveries in this category.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentList.map((donation, i) => {
                const status = getStatusConfig(donation.status);
                const timeLeft = getTimeRemaining(donation.expiryTime);

                return (
                  <motion.div key={donation.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-brand-100 flex items-center justify-center text-3xl shrink-0">
                        {donation.foodType === 'veg' ? '🥬' : '🍖'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-800">{donation.foodName}</h3>
                            <p className="text-sm text-slate-500">{donation.donorName}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color} uppercase shrink-0`}>{status.label}</span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> {donation.servings} servings</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {timeLeft.text}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {donation.pickupAddress?.substring(0, 30)}</span>
                        </div>

                        <div className="mt-3 flex gap-2">
                          {tab === 'available' && (
                            <button onClick={() => handleJoinPickup(donation.id)}
                              className="inline-flex items-center gap-1 px-4 py-2 gradient-brand text-white text-sm font-medium rounded-xl hover:opacity-90 transition">
                              <Route className="w-4 h-4" /> Join Pickup
                            </button>
                          )}
                          {tab === 'active' && donation.status === 'accepted' && (
                            <button onClick={() => handlePickedUp(donation.id)}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition">
                              <Package className="w-4 h-4" /> Mark Picked Up
                            </button>
                          )}
                          {tab === 'active' && donation.status === 'collected' && (
                            <button onClick={() => handleDelivered(donation.id)}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-xl hover:bg-teal-600 transition">
                              <CheckCircle className="w-4 h-4" /> Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Badges & Leaderboard */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Badges
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {BADGES.slice(0, 6).map((badge) => {
                const earned = earnedBadges.some((b) => b.id === badge.id);
                return (
                  <div key={badge.id} className={`p-3 rounded-xl text-center ${earned ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 opacity-50'}`}>
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="text-xs font-medium text-slate-700 mt-1">{badge.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-brand-500 to-emerald-600 rounded-2xl p-6 text-white">
            <Zap className="w-8 h-8 mb-3 text-brand-200" />
            <h3 className="text-lg font-bold mb-1">Impact Score</h3>
            <p className="text-3xl font-black">{completedDeliveries.length * 50 + (user.hoursVolunteered || 0) * 10}</p>
            <p className="text-sm text-brand-200 mt-1">Keep delivering to earn more!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
