# 🌉 FoodBridge — Smart Food Waste Reduction & Donation Platform

<div align="center">

**Reduce Food Waste. Feed More People.**

A modern, AI-powered platform connecting surplus food donors with NGOs, shelters, and volunteers to fight hunger and reduce waste.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-✨-FF0055)](https://www.framer.com/motion/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet)](https://leafletjs.com/)

</div>

---

## 🚀 Overview

FoodBridge is a full-stack social-impact web platform that connects **food donors** (restaurants, hotels, event organizers, households) with **receivers** (NGOs, charities, food banks) and **volunteers** who pick up and deliver surplus food.

The platform features:
- 🗺️ **Location-based matching** with interactive maps
- 🕐 **Real-time freshness tracking** with expiry timers
- 📊 **Impact dashboards** with animated charts
- 🎮 **Gamification** with badges and leaderboards
- 📱 **QR code verification** for pickups
- 🤖 **AI recommendations** for optimal food distribution
- 🔐 **Role-based access** (Donor, NGO, Volunteer, Admin)

---

## 📸 Pages

| Page | Description |
|------|-------------|
| **Landing Page** | Hero with animated stats, how-it-works, features, testimonials, partner NGOs, CTA |
| **Login / Signup** | Multi-step signup with role selection (Donor / NGO / Volunteer) |
| **Donor Dashboard** | Stats overview, quick actions, recent donations with freshness indicators |
| **Post Donation** | Full food posting form with type, quantity, servings, expiry, location |
| **Food Feed** | Filterable card grid with search, freshness bars, and claim buttons |
| **Map View** | Interactive Leaflet map showing donations & NGO markers with popups |
| **NGO Dashboard** | Claim workflow, status tracking, QR verification modal |
| **Volunteer Hub** | Pickup board, delivery tracking, gamification badges, impact score |
| **Impact Dashboard** | Charts (line, bar, doughnut), animated counters, top NGO leaderboard |
| **Admin Panel** | NGO approval, user management table, donations monitor, platform analytics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Styling | **TailwindCSS 4** |
| Animations | **Framer Motion** |
| Maps | **Leaflet + React-Leaflet** (OpenStreetMap) |
| Charts | **Chart.js + react-chartjs-2** |
| Icons | **Lucide React** |
| QR Codes | **qrcode.react** |
| State Management | React Context + localStorage |
| Font | Inter (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **npm** v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/foodbridge.git

# Navigate to the project
cd foodbridge

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Demo Accounts

Use these credentials to explore different roles:

| Role | Email | Password |
|------|-------|----------|
| **Donor** | `rajesh@restaurant.com` | `password123` |
| **NGO** | `ananya@ngo.org` | `password123` |
| **Volunteer** | `vikram@volunteer.com` | `password123` |
| **Admin** | `admin@foodbridge.org` | `admin123` |

You can also create a new account via the Sign Up page.

---

## 📂 Project Structure

```
foodbridge/
├── app/
│   ├── layout.js           # Root layout with providers
│   ├── page.js             # Landing page
│   ├── globals.css          # Design system & animations
│   ├── login/page.js        # Login page
│   ├── signup/page.js       # Multi-step signup
│   ├── dashboard/
│   │   ├── page.js          # Donor dashboard
│   │   └── post/page.js     # Post donation form
│   ├── feed/page.js         # Food donation feed
│   ├── map/page.js          # Interactive map view
│   ├── ngo/page.js          # NGO dashboard
│   ├── volunteer/page.js    # Volunteer hub
│   ├── impact/page.js       # Impact statistics
│   └── admin/page.js        # Admin panel
├── components/
│   ├── ClientProviders.js   # Context providers wrapper
│   └── layout/
│       ├── Navbar.js        # Responsive navbar
│       └── Footer.js        # Site footer
├── lib/
│   ├── data.js              # Mock data (users, donations, NGOs, etc.)
│   ├── utils.js             # Utility functions
│   └── context/
│       ├── AuthContext.js    # Authentication state
│       ├── DonationContext.js # Donation CRUD operations
│       └── NotificationContext.js # Notifications
└── public/                  # Static assets
```

---

## 🗄️ Database Schema (MongoDB — Future Integration)

```javascript
// Users
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: 'donor' | 'ngo' | 'volunteer' | 'admin',
  organization: String,
  phone: String,
  address: String,
  location: { type: 'Point', coordinates: [lng, lat] },
  verified: Boolean,
  badges: [String],
  createdAt: Date
}

// Donations
{
  _id: ObjectId,
  donorId: ObjectId (ref: Users),
  foodName: String,
  quantity: String,
  servings: Number,
  foodType: 'veg' | 'non-veg',
  expiryTime: Date,
  pickupAddress: String,
  location: { type: 'Point', coordinates: [lng, lat] },
  image: String,
  instructions: String,
  status: 'available' | 'requested' | 'accepted' | 'collected' | 'delivered',
  claimedBy: ObjectId (ref: Users),
  volunteerId: ObjectId (ref: Users),
  createdAt: Date
}

// Notifications
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  type: String,
  title: String,
  message: String,
  read: Boolean,
  createdAt: Date
}
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
npm run build
# Upload the `.next` folder or use Netlify's Next.js plugin
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <b>Built with ❤️ for a hunger-free world</b>
  <br/>
  <sub>FoodBridge — Every meal saved is a life touched.</sub>
</div>
