import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'FoodBridge — Smart Food Waste Reduction & Donation Platform',
  description:
    'Connect surplus food with people in need. FoodBridge makes food donation fast, transparent, and location-based. Reduce waste. Feed communities.',
  keywords: 'food donation, food waste, surplus food, NGO, volunteer, community, sustainability',
  openGraph: {
    title: 'FoodBridge — Reduce Food Waste. Feed More People.',
    description: 'A smart platform connecting food donors with NGOs and volunteers to reduce waste and fight hunger.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
