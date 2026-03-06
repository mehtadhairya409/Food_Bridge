'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useDonations } from '@/lib/context/DonationContext';
import { getTimeRemaining, getFreshnessLevel, getStatusConfig, formatTimeAgo } from '@/lib/utils';
import {
  Plus, Utensils, Users, Clock, TrendingUp, Package, Star,
  ChevronRight, ArrowUpRight, Leaf
} from 'lucide-react';

export default function DonorDashboard() {
  const { user, loading } = useAuth();
  const { donations } = useDonations();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'donor')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const myDonations = donations.filter((d) => d.donorId === user.id);
  const totalServings = myDonations.reduce((s, d) => s + (d.servings || 0), 0);
  const activeDonations = myDonations.filter((d) => ['available', 'requested', 'accepted'].includes(d.status));
  const delivered = myDonations.filter((d) => d.status === 'delivered');

  const stats = [
    { icon: Package, label: 'Total Donations', value: myDonations.length, color: 'bg-brand-500' },
    { icon: Utensils, label: 'Meals Served', value: totalServings, color: 'bg-accent-500' },
    { icon: Clock, label: 'Active', value: activeDonations.length, color: 'bg-blue-500' },
    { icon: Star, label: 'Delivered', value: delivered.length, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Here&apos;s your donation overview</p>
        </div>
        <Link href="/dashboard/post" className="inline-flex items-center gap-2 px-6 py-3 gradient-brand text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <Plus className="w-5 h-5" /> Post Food
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/dashboard/post', icon: Plus, label: 'Post New Donation', desc: 'Share surplus food', color: 'from-brand-500 to-emerald-600' },
          { href: '/feed', icon: Utensils, label: 'Browse Feed', desc: 'See all donations', color: 'from-accent-500 to-orange-600' },
          { href: '/impact', icon: TrendingUp, label: 'View Impact', desc: 'Your contribution stats', color: 'from-purple-500 to-indigo-600' },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-1">
              {action.label}
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
            </h3>
            <p className="text-sm text-slate-500">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Recent Donations</h2>
          <Link href="/feed" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {myDonations.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No donations yet. Start by posting surplus food!</p>
            <Link href="/dashboard/post" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white font-medium rounded-xl text-sm">
              <Plus className="w-4 h-4" /> Post Your First Donation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myDonations.slice(0, 5).map((donation) => {
              const status = getStatusConfig(donation.status);
              const freshness = getFreshnessLevel(donation.expiryTime);
              return (
                <div key={donation.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-2xl">
                    {donation.foodType === 'veg' ? '🥬' : '🍖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 truncate">{donation.foodName}</h4>
                    <p className="text-xs text-slate-500">{donation.servings} servings · {formatTimeAgo(donation.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${freshness.color} text-white`}>
                      {freshness.label}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">🏆 Your Badges</h2>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((badge) => (
              <div key={badge} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                <Star className="w-4 h-4" /> {badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
