'use client';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">FoodBridge</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Connecting surplus food with people in need. Reducing waste, feeding communities, building a better world.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/feed', label: 'Browse Donations' },
                { href: '/dashboard/post', label: 'Donate Food' },
                { href: '/map', label: 'Map View' },
                { href: '/impact', label: 'Our Impact' },
                { href: '/signup', label: 'Join Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-brand-400 transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Organizations</h3>
            <ul className="space-y-2.5">
              {['Register NGO', 'Partner With Us', 'Volunteer Program', 'Corporate CSR', 'API Access'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-brand-500" /> hello@foodbridge.org
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-brand-500" /> +91 1800-FOOD-HELP
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5" /> FoodBridge HQ, Bangalore, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2024 FoodBridge. All rights reserved. Built with ❤️ for a hunger-free world.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition">Terms</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
