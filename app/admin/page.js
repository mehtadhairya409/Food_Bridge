'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useDonations } from '@/lib/context/DonationContext';
import { MOCK_NGOS, MOCK_USERS, PLATFORM_STATS } from '@/lib/data';
import { formatNumber, formatTimeAgo, getStatusConfig } from '@/lib/utils';
import {
  Shield, Users, Package, Building2, CheckCircle, XCircle,
  TrendingUp, BarChart3, AlertTriangle, Eye, Ban, Search,
  Utensils, Globe, Activity
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { donations } = useDonations();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [ngoList, setNgoList] = useState(MOCK_NGOS);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const handleApproveNGO = (id) => {
    setNgoList(ngoList.map((n) => (n.id === id ? { ...n, verified: true } : n)));
  };

  const handleRejectNGO = (id) => {
    setNgoList(ngoList.filter((n) => n.id !== id));
  };

  const pendingNGOs = ngoList.filter((n) => !n.verified);
  const verifiedNGOs = ngoList.filter((n) => n.verified);
  const allUsers = [...MOCK_USERS, ...JSON.parse(typeof window !== "undefined" ? localStorage.getItem('foodbridge_registered_users') || '[]' : '[]')];
  const filteredUsers = allUsers.filter((u) => !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()));

  const stats = [
    { icon: Package, label: 'Total Donations', value: donations.length, change: '+12%', color: 'bg-brand-500' },
    { icon: Users, label: 'Total Users', value: allUsers.length, change: '+8%', color: 'bg-blue-500' },
    { icon: Building2, label: 'Verified NGOs', value: verifiedNGOs.length, change: '+3', color: 'bg-purple-500' },
    { icon: AlertTriangle, label: 'Pending Approval', value: pendingNGOs.length, change: '', color: 'bg-amber-500' },
    { icon: Utensils, label: 'Meals Saved', value: PLATFORM_STATS.totalMealsSaved, change: '+15%', color: 'bg-emerald-500' },
    { icon: Globe, label: 'Cities', value: PLATFORM_STATS.citiesCovered, change: '+2', color: 'bg-rose-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ngos', label: 'NGO Management', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'donations', label: 'Donations', icon: Package },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Monitor and manage the FoodBridge platform</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.change && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-800">{typeof stat.value === 'number' && stat.value > 999 ? formatNumber(stat.value) : stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {donations.slice(0, 5).map((d) => {
                const status = getStatusConfig(d.status);
                return (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-lg">
                      {d.foodType === 'veg' ? '🥬' : '🍖'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{d.foodName}</h4>
                      <p className="text-xs text-slate-500">{d.donorName} · {formatTimeAgo(d.createdAt)}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color} uppercase`}>{status.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NGO MANAGEMENT */}
      {tab === 'ngos' && (
        <div className="space-y-6">
          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Pending Approvals ({pendingNGOs.length})
            </h3>
            {pendingNGOs.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No pending approvals.</p>
            ) : (
              <div className="space-y-3">
                {pendingNGOs.map((ngo) => (
                  <div key={ngo.id} className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{ngo.name}</h4>
                      <p className="text-sm text-slate-500">{ngo.email} · {ngo.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveNGO(ngo.id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleRejectNGO(ngo.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified NGOs */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">✅ Verified NGOs ({verifiedNGOs.length})</h3>
            <div className="space-y-3">
              {verifiedNGOs.map((ngo) => (
                <div key={ngo.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-brand-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{ngo.name}</h4>
                    <p className="text-sm text-slate-500">{ngo.address} · Since {ngo.activeSince}</p>
                  </div>
                  <span className="text-sm text-slate-600">{formatNumber(ngo.peopleServed)} served</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-bold text-slate-800">All Users</h3>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-brand-500 outline-none"
                placeholder="Search users..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Organization</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 text-sm">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{u.name?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 capitalize">{u.role}</span>
                    </td>
                    <td className="py-3 text-slate-600">{u.organization || '—'}</td>
                    <td className="py-3 text-slate-500">{u.joinedAt}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {u.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-500 transition"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition"><Ban className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DONATIONS */}
      {tab === 'donations' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4">All Donations ({donations.length})</h3>
          <div className="space-y-3">
            {donations.map((d) => {
              const status = getStatusConfig(d.status);
              return (
                <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-lg">
                    {d.foodType === 'veg' ? '🥬' : '🍖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">{d.foodName}</h4>
                    <p className="text-xs text-slate-500">{d.donorName} · {d.servings} servings · {d.quantity}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${status.color} uppercase shrink-0`}>{status.label}</span>
                  <span className="text-xs text-slate-400 shrink-0">{formatTimeAgo(d.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
