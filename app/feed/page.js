'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDonations } from '@/lib/context/DonationContext';
import { useAuth } from '@/lib/context/AuthContext';
import { getTimeRemaining, getFreshnessLevel, getStatusConfig, formatTimeAgo } from '@/lib/utils';
import {
  Search, Filter, MapPin, Clock, Users, Leaf, Drumstick,
  ChevronDown, Utensils, ArrowRight, Heart
} from 'lucide-react';

export default function FeedPage() {
  const { donations } = useDonations();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = donations
    .filter((d) => {
      if (search && !d.foodName.toLowerCase().includes(search.toLowerCase()) && !d.donorName.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && d.foodType !== typeFilter) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'expiring') return new Date(a.expiryTime) - new Date(b.expiryTime);
      if (sortBy === 'servings') return b.servings - a.servings;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Food Donation Feed</h1>
        <p className="text-slate-500">Browse available food donations and help reduce waste</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              placeholder="Search food or donor..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-brand-500 outline-none bg-white">
              <option value="all">All Types</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Veg</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-brand-500 outline-none bg-white">
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="requested">Requested</option>
              <option value="accepted">Accepted</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:border-brand-500 outline-none bg-white">
              <option value="newest">Newest First</option>
              <option value="expiring">Expiring Soon</option>
              <option value="servings">Most Servings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">{filtered.length} donation{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-2">No donations match your filters.</p>
          <p className="text-sm text-slate-400">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((donation, i) => {
            const freshness = getFreshnessLevel(donation.expiryTime);
            const timeLeft = getTimeRemaining(donation.expiryTime);
            const status = getStatusConfig(donation.status);

            return (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group border border-slate-100"
              >
                {/* Image / Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-brand-50 to-emerald-50 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl group-hover:scale-110 transition-transform">
                    {donation.foodType === 'veg' ? '🥗' : '🍖'}
                  </span>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color} uppercase tracking-wide`}>
                      {status.label}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full text-white ${freshness.color}`}>
                      {freshness.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-full ${donation.foodType === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {donation.foodType === 'veg' ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                      {donation.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{donation.foodName}</h3>
                  <p className="text-sm text-slate-500 mb-3">by {donation.donorName}</p>

                  {/* Freshness Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeLeft.text}
                      </span>
                      <span className={`font-medium ${freshness.level === 'critical' ? 'text-red-500' : 'text-emerald-600'}`}>
                        {freshness.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${freshness.color} freshness-bar`} style={{ width: `${freshness.percentage}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{donation.servings} servings · {donation.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{donation.pickupAddress}</span>
                    </div>
                  </div>

                  {donation.instructions && (
                    <p className="text-xs text-slate-400 italic mb-4 line-clamp-2">&quot;{donation.instructions}&quot;</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{formatTimeAgo(donation.createdAt)}</span>
                    {user && (user.role === 'ngo' || user.role === 'volunteer') && donation.status === 'available' && (
                      <Link href="/ngo" className="inline-flex items-center gap-1 px-4 py-2 gradient-brand text-white text-sm font-medium rounded-xl hover:opacity-90 transition">
                        Claim <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
