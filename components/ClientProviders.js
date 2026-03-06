'use client';
import { AuthProvider } from '@/lib/context/AuthContext';
import { DonationProvider } from '@/lib/context/DonationContext';
import { NotificationProvider } from '@/lib/context/NotificationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <DonationProvider>
        <NotificationProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </NotificationProvider>
      </DonationProvider>
    </AuthProvider>
  );
}
