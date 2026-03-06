// ==========================================
// FoodBridge — Utility Functions
// ==========================================

export function getTimeRemaining(expiryTime) {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diff = expiry - now;

  if (diff <= 0) return { expired: true, text: 'Expired', hours: 0, minutes: 0 };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let text = '';
  if (hours > 0) text += `${hours}h `;
  text += `${minutes}m remaining`;

  return { expired: false, text, hours, minutes, totalMinutes: hours * 60 + minutes };
}

export function getFreshnessLevel(expiryTime) {
  const { expired, totalMinutes } = getTimeRemaining(expiryTime);
  if (expired) return { level: 'expired', color: 'bg-red-500', label: 'Expired', percentage: 0 };
  if (totalMinutes < 60) return { level: 'critical', color: 'bg-red-500', label: 'Expiring Soon', percentage: 15 };
  if (totalMinutes < 180) return { level: 'warning', color: 'bg-amber-500', label: 'Use Soon', percentage: 40 };
  if (totalMinutes < 360) return { level: 'good', color: 'bg-emerald-500', label: 'Fresh', percentage: 70 };
  return { level: 'excellent', color: 'bg-emerald-600', label: 'Very Fresh', percentage: 95 };
}

export function getStatusConfig(status) {
  const configs = {
    available: { label: 'Available', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    requested: { label: 'Requested', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    accepted: { label: 'Accepted', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
    collected: { label: 'Collected', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    delivered: { label: 'Delivered', color: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500' },
  };
  return configs[status] || configs.available;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function generateQRData(donationId) {
  return JSON.stringify({
    platform: 'FoodBridge',
    donationId,
    timestamp: new Date().toISOString(),
    verification: `FB-${donationId}-${Date.now().toString(36).toUpperCase()}`,
  });
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
