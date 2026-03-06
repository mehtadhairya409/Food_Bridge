'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, Utensils, MapPin, Users, ArrowRight,
  Leaf, TrendingUp, Clock, Shield, ChevronRight,
  Star, Building2, HandHeart, Truck, BarChart3, Sparkles
} from 'lucide-react';
import { PLATFORM_STATS, TESTIMONIALS, MOCK_NGOS } from '@/lib/data';
import { formatNumber } from '@/lib/utils';

// Animated counter component
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{formatNumber(count)}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ==================== HERO ==================== */}
      <section className="relative gradient-hero min-h-[92vh] flex items-center overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-400/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300">AI-Powered Food Rescue Platform</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Reduce Food Waste.{' '}
              <span className="text-gradient">Feed More People.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Connect surplus food from restaurants, homes, and events with NGOs and volunteers.
              Make every meal count with real-time matching and smart logistics.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="group inline-flex items-center justify-center gap-2 px-8 py-4 gradient-brand text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all hover:scale-[1.02]">
                <Utensils className="w-5 h-5" /> Donate Food
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/feed" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                <MapPin className="w-5 h-5" /> Find Donations
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              {[
                { value: PLATFORM_STATS.totalMealsSaved, label: 'Meals Saved', suffix: '+' },
                { value: PLATFORM_STATS.activeNGOs, label: 'Active NGOs', suffix: '+' },
                { value: PLATFORM_STATS.citiesCovered, label: 'Cities', suffix: '+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Central Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 gradient-brand rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-500/30 animate-float">
                  <Heart className="w-24 h-24 text-white" fill="white" strokeWidth={1.5} />
                </div>
              </div>
              {/* Floating Cards */}
              {[
                { icon: Utensils, label: '50 Meals Ready', color: 'bg-emerald-500', pos: 'top-4 left-4' },
                { icon: MapPin, label: '2.3 km Away', color: 'bg-blue-500', pos: 'top-12 right-0' },
                { icon: Clock, label: '4h Fresh', color: 'bg-amber-500', pos: 'bottom-16 left-0' },
                { icon: Users, label: '342 NGOs', color: 'bg-purple-500', pos: 'bottom-4 right-4' },
              ].map((card, i) => (
                <div key={i} className={`absolute ${card.pos} glass rounded-2xl p-4 flex items-center gap-3 shadow-xl animate-float`} style={{ animationDelay: `${i * 1.5}s` }}>
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{card.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.span variants={fadeUp} className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Simple Process</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3 mb-4">How FoodBridge Works</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-slate-500 max-w-2xl mx-auto">Three simple steps to turn surplus food into meals for those who need them most.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

            {[
              {
                icon: Utensils,
                title: 'Post Surplus Food',
                desc: 'Restaurants, homes, or events post their surplus food with photos, quantity, and pickup details.',
                color: 'bg-brand-500',
                step: '01',
              },
              {
                icon: MapPin,
                title: 'Smart Matching',
                desc: 'Our AI matches food with nearest NGOs and volunteers for fastest collection and minimum waste.',
                color: 'bg-accent-500',
                step: '02',
              },
              {
                icon: HandHeart,
                title: 'Deliver & Feed',
                desc: 'Volunteers pick up food and deliver it to shelters, feeding people in need within hours.',
                color: 'bg-purple-500',
                step: '03',
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative text-center group">
                <div className="relative z-10 mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                  <div className={`absolute inset-0 ${item.color} rounded-2xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform`} />
                  <div className={`relative w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <span className="text-5xl font-black text-slate-100 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">{item.step}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== IMPACT STATS ==================== */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Making a Difference</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Our Impact in Numbers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Every donation counts. Here's how FoodBridge is fighting hunger and food waste across the nation.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Utensils, value: PLATFORM_STATS.totalMealsSaved, label: 'Meals Saved', color: 'text-brand-400' },
              { icon: Users, value: PLATFORM_STATS.peopleFed, label: 'People Fed', color: 'text-accent-400' },
              { icon: Leaf, value: PLATFORM_STATS.kgFoodSaved, label: 'KG Food Rescued', color: 'text-emerald-400' },
              { icon: TrendingUp, value: PLATFORM_STATS.co2Prevented, label: 'KG CO₂ Prevented', color: 'text-sky-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 text-center group hover:scale-105 transition-transform cursor-default"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix="+" />
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3 mb-4">Everything You Need to Fight Food Waste</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Location-Based Matching', desc: 'AI matches surplus food with nearest NGOs for fastest pickups.', color: 'bg-blue-500' },
              { icon: Clock, title: 'Real-Time Freshness', desc: 'Live expiry tracking ensures food safety and minimizes waste.', color: 'bg-amber-500' },
              { icon: Shield, title: 'Food Safety Verified', desc: 'Built-in safety checks and hygiene guidelines for every donation.', color: 'bg-emerald-500' },
              { icon: Truck, title: 'Live Delivery Tracking', desc: 'Track pickups and deliveries in real-time on interactive maps.', color: 'bg-purple-500' },
              { icon: BarChart3, title: 'Impact Analytics', desc: 'Beautiful dashboards showing your contribution to the community.', color: 'bg-rose-500' },
              { icon: Sparkles, title: 'AI Recommendations', desc: 'Smart suggestions for optimal pickup routes and demand areas.', color: 'bg-indigo-500' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="gradient-card glass rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-default"
              >
                <div className={`w-12 h-12 ${feat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3 mb-4">What Our Community Says</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow relative"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400" fill="#fbbf24" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PARTNER NGOs ==================== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Our Partners</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3 mb-4">Trusted NGO Partners</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We work with verified organizations across India to ensure food reaches those who need it most.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_NGOS.filter(n => n.verified).map((ngo, i) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">{ngo.name}</h3>
                <p className="text-xs text-slate-500 mb-3">Since {ngo.activeSince}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                  <Users className="w-3 h-3" /> {formatNumber(ngo.peopleServed)} served
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of donors, NGOs, and volunteers who are already fighting food waste and hunger through FoodBridge.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                Get Started Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/impact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 text-white font-semibold rounded-2xl border border-white/25 hover:bg-white/20 transition-all">
                <BarChart3 className="w-5 h-5" /> View Our Impact
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
