'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DONATIONS } from '@/lib/data';

const DonationContext = createContext(null);

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('foodbridge_donations');
    if (stored) {
      try {
        setDonations(JSON.parse(stored));
      } catch {
        setDonations(MOCK_DONATIONS);
        localStorage.setItem('foodbridge_donations', JSON.stringify(MOCK_DONATIONS));
      }
    } else {
      setDonations(MOCK_DONATIONS);
      localStorage.setItem('foodbridge_donations', JSON.stringify(MOCK_DONATIONS));
    }
  }, []);

  const saveDonations = (newDonations) => {
    setDonations(newDonations);
    localStorage.setItem('foodbridge_donations', JSON.stringify(newDonations));
  };

  const addDonation = (donation) => {
    const newDonation = {
      id: `don_${Date.now()}`,
      ...donation,
      status: 'available',
      createdAt: new Date().toISOString(),
      claimedBy: null,
      volunteerId: null,
    };
    const updated = [newDonation, ...donations];
    saveDonations(updated);
    return newDonation;
  };

  const updateDonation = (id, updates) => {
    const updated = donations.map((d) => (d.id === id ? { ...d, ...updates } : d));
    saveDonations(updated);
  };

  const claimDonation = (donationId, userId) => {
    updateDonation(donationId, { status: 'requested', claimedBy: userId });
  };

  const acceptDonation = (donationId) => {
    updateDonation(donationId, { status: 'accepted' });
  };

  const assignVolunteer = (donationId, volunteerId) => {
    updateDonation(donationId, { volunteerId, status: 'accepted' });
  };

  const markCollected = (donationId) => {
    updateDonation(donationId, { status: 'collected' });
  };

  const markDelivered = (donationId) => {
    updateDonation(donationId, { status: 'delivered' });
  };

  const getDonationsByDonor = (donorId) => donations.filter((d) => d.donorId === donorId);
  const getAvailableDonations = () => donations.filter((d) => d.status === 'available');
  const getDonationsByStatus = (status) => donations.filter((d) => d.status === status);

  return (
    <DonationContext.Provider
      value={{
        donations,
        addDonation,
        updateDonation,
        claimDonation,
        acceptDonation,
        assignVolunteer,
        markCollected,
        markDelivered,
        getDonationsByDonor,
        getAvailableDonations,
        getDonationsByStatus,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error('useDonations must be used within DonationProvider');
  return ctx;
}
