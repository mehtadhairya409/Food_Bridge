'use client';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useDonations } from '@/lib/context/DonationContext';
import { MOCK_NGOS } from '@/lib/data';
import { getStatusConfig, getFreshnessLevel, getTimeRemaining } from '@/lib/utils';
import { MapPin, Utensils, Building2, Clock, Users } from 'lucide-react';

// Dynamic import for Leaflet (SSR incompatible)
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

function MapInner() {
  const { donations } = useDonations();
  const available = donations.filter((d) => d.status === 'available' || d.status === 'requested');

  const center = useMemo(() => {
    if (available.length > 0) return [available[0].lat, available[0].lng];
    return [20.5937, 78.9629]; // India center
  }, [available]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Map View</h1>
        <p className="text-slate-500">Explore food donations and NGOs near you</p>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-3 h-3 bg-brand-500 rounded-full" /> Food Donations
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full" /> NGO Locations
        </div>
        <div className="ml-auto text-sm text-slate-400">
          {available.length} donations · {MOCK_NGOS.filter(n => n.verified).length} NGOs
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: '65vh' }}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Donation Markers */}
          {available.map((donation) => {
            const freshness = getFreshnessLevel(donation.expiryTime);
            const timeLeft = getTimeRemaining(donation.expiryTime);
            return (
              <Marker key={donation.id} position={[donation.lat, donation.lng]}>
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-slate-800 text-base">{donation.foodName}</h3>
                    <p className="text-sm text-slate-500 mb-2">{donation.donorName}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1 text-slate-600">
                        <span>🍽️</span> {donation.servings} servings · {donation.quantity}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <span>⏰</span> {timeLeft.text}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <span>📍</span> {donation.pickupAddress}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${freshness.color}`}>
                        {freshness.label}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-100 text-brand-700">
                        {donation.foodType === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* NGO Markers */}
          {MOCK_NGOS.filter(n => n.verified).map((ngo) => (
            <Marker key={ngo.id} position={[ngo.lat, ngo.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-slate-800 text-base">{ngo.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{ngo.description?.substring(0, 80)}...</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <span>📍</span> {ngo.address}
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span>👥</span> {ngo.peopleServed?.toLocaleString()} people served
                    </div>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                    ✅ Verified NGO
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Nearby list */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {available.slice(0, 3).map((donation) => {
          const freshness = getFreshnessLevel(donation.expiryTime);
          const timeLeft = getTimeRemaining(donation.expiryTime);
          return (
            <motion.div key={donation.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-2xl shrink-0">
                {donation.foodType === 'veg' ? '🥗' : '🍖'}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-800 truncate">{donation.foodName}</h4>
                <p className="text-xs text-slate-500">{donation.servings} servings · {timeLeft.text}</p>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-full text-white ${freshness.color} shrink-0`}>
                {freshness.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function MapPage() {
  return <MapInner />;
}
