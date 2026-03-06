'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { Menu, X, Bell, User, LogOut, Heart, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = user
    ? getNavLinks(user.role)
    : [
        { href: '/', label: 'Home' },
        { href: '/feed', label: 'Donations' },
        { href: '/impact', label: 'Impact' },
        { href: '/map', label: 'Map' },
      ];

  function getNavLinks(role) {
    const base = [{ href: '/feed', label: 'Donations' }, { href: '/map', label: 'Map' }, { href: '/impact', label: 'Impact' }];
    if (role === 'donor') return [{ href: '/dashboard', label: 'Dashboard' }, { href: '/dashboard/post', label: 'Post Food' }, ...base];
    if (role === 'ngo') return [{ href: '/ngo', label: 'NGO Dashboard' }, ...base];
    if (role === 'volunteer') return [{ href: '/volunteer', label: 'Volunteer Hub' }, ...base];
    if (role === 'admin') return [{ href: '/admin', label: 'Admin Panel' }, ...base];
    return base;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Food<span className="text-brand-600">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.name?.[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-slide-up">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition" onClick={() => setProfileOpen(false)}>
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition">
                  Log In
                </Link>
                <Link href="/signup" className="px-5 py-2.5 text-sm font-semibold text-white gradient-brand rounded-xl hover:opacity-90 transition shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition">
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Log In</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-white gradient-brand rounded-xl text-center">Sign Up</Link>
              </div>
            )}
            {user && (
              <div className="pt-3 border-t border-slate-100">
                <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
