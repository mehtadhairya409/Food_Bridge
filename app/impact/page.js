'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { PLATFORM_STATS } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import {
  Utensils, Users, Leaf, TrendingUp, Building2, MapPin,
  BarChart3, ArrowUpRight, Globe, Award
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{formatNumber(count)}</span>;
}

export default function ImpactPage() {
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Meals Saved',
      data: [4200, 5800, 7100, 8900, 10200, 12400, 14100, 15800, 17200, 18900, 20500, 22400],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#22c55e',
    }],
  };

  const categoryData = {
    labels: ['Restaurants', 'Hotels', 'Events', 'Households', 'Caterers'],
    datasets: [{
      data: [35, 25, 20, 12, 8],
      backgroundColor: ['#22c55e', '#f97316', '#8b5cf6', '#06b6d4', '#f43f5e'],
      borderWidth: 0,
    }],
  };

  const weeklyBar = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Donations',
      data: [18, 24, 20, 30, 28, 42, 35],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderRadius: 8,
    }, {
      label: 'Collections',
      data: [15, 20, 18, 26, 24, 38, 30],
      backgroundColor: 'rgba(249, 115, 22, 0.8)',
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
    },
  };

  const stats = [
    {
      icon: Utensils, label: 'Total Meals Saved', value: PLATFORM_STATS.totalMealsSaved,
      change: '+12.5%', color: 'bg-brand-500', lightColor: 'bg-brand-50'
    },
    {
      icon: Users, label: 'People Fed', value: PLATFORM_STATS.peopleFed,
      change: '+8.3%', color: 'bg-accent-500', lightColor: 'bg-accent-50'
    },
    {
      icon: Leaf, label: 'KG Food Rescued', value: PLATFORM_STATS.kgFoodSaved,
      change: '+15.2%', color: 'bg-emerald-500', lightColor: 'bg-emerald-50'
    },
    {
      icon: TrendingUp, label: 'KG CO₂ Prevented', value: PLATFORM_STATS.co2Prevented,
      change: '+10.1%', color: 'bg-sky-500', lightColor: 'bg-sky-50'
    },
    {
      icon: Building2, label: 'Active NGOs', value: PLATFORM_STATS.activeNGOs,
      change: '+5.7%', color: 'bg-purple-500', lightColor: 'bg-purple-50'
    },
    {
      icon: Globe, label: 'Cities Covered', value: PLATFORM_STATS.citiesCovered,
      change: '+3', color: 'bg-rose-500', lightColor: 'bg-rose-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Impact Dashboard</h1>
        <p className="text-slate-500">Real-time metrics showing how FoodBridge is making a difference</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              <AnimatedCounter end={stat.value} />
            </div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Monthly Meals Saved</h3>
              <p className="text-sm text-slate-500">Growth trend over 2024</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div style={{ height: 280 }}>
            <Line data={monthlyData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
          </div>
        </div>

        {/* Weekly Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Weekly Activity</h3>
              <p className="text-sm text-slate-500">Donations vs Collections</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-brand-500 rounded-full" /> Donations</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-accent-500 rounded-full" /> Collections</span>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <Bar data={weeklyBar} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Donation Sources</h3>
          <div style={{ height: 240 }} className="flex items-center justify-center">
            <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, color: '#64748b' } } }, cutout: '65%' }} />
          </div>
        </div>

        {/* Top NGOs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4">Top Performing Organizations</h3>
          <div className="space-y-3">
            {[
              { name: 'Akshaya Patra', meals: 25000, rank: 1 },
              { name: 'Robin Hood Army', meals: 15000, rank: 2 },
              { name: 'Feeding India', meals: 8900, rank: 3 },
              { name: 'No Food Waste', meals: 5000, rank: 4 },
            ].map((org) => (
              <div key={org.name} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">#{org.rank}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{org.name}</h4>
                  <div className="mt-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full gradient-brand rounded-full" style={{ width: `${(org.meals / 25000) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600">{formatNumber(org.meals)} meals</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-8 gradient-brand rounded-2xl p-8 text-center text-white">
        <Award className="w-12 h-12 mx-auto mb-4 text-brand-200" />
        <h3 className="text-2xl font-bold mb-2">🎉 Milestone Achieved!</h3>
        <p className="text-lg text-brand-100">Over 125,000 meals saved and counting. Thank you for being part of this movement!</p>
      </motion.div>
    </div>
  );
}
