# Service-Market-Place-1
# ServiGo – Smart Service Marketplace

ServiGo is an end-to-end, full-featured modern Service Marketplace Web Application connecting consumers with verified, background-checked local trade specialists and contractors.

## 🚀 Key Features

- **Multi-Role Authentication**: Dedicated portals and role-based workflows for Consumers, Service Providers, and Administrators.
- **Service Discovery & Matching**: 12+ categories, visual 2D service cards, advanced filters (price, rating, distance, emergency availability), and side-by-side provider comparison (up to 3 providers).
- **7-Step Booking Flow**:
  1. Service & Diagnostic Problem Selection
  2. Date & Interactive Time Slot Picker with double-booking collision prevention
  3. Service Address & Multi-Address Management with Map Location Picker
  4. Problem Diagnosis & Severity Selection (Low, Medium, High, Emergency)
  5. Drag-and-drop Image & Video Media Proof Upload
  6. Transparent Itemized Booking Summary & Pricing Breakdown
  7. Instant Confirmation with unique Booking Reference (`SV-YYYYMMDD-XXXX`)
- **Payments & Invoicing**:
  - UPI (VPA verification & dynamic QR), Credit/Debit Cards, Net Banking, Digital Wallets, and Cash on Service.
  - Coupon redemption engine (`WELCOME10`, `SERVIGO20`, `FIRSTBOOKING`, `EMERGENCY50`).
  - GST-compliant invoice generation with printable PDF downloads.
- **Live Telemetry & Tracking**:
  - Real-time GPS movement simulation, distance countdown, dynamic arrival ETA, and 6-stage lifecycle progress journey.
- **Customer $\leftrightarrow$ Provider Real-Time Chat**:
  - Live messaging, diagnostic image sharing, booking reference linkage, and quick replies.
- **Provider Operations & Earnings**:
  - Job request management (Accept/Decline), milestone progression (On The Way $\rightarrow$ Arrived $\rightarrow$ Started $\rightarrow$ Completed).
  - Shift availability, working days/hours, break windows, and vacation date blockers.
  - Earnings analytics, weekly revenue chart, platform commission breakdown, and bank payout requests.
- **Executive Admin Governance Hub**:
  - User and provider directory management, provider document vetting and Verified Badges.
  - Global bookings audit ledger, escrow reconciliation, review moderation, and support ticket dispute resolution.
- **Smart Features & AI Assistant**:
  - Natural language AI diagnostic assistant widget for issue triage and 1-click booking.
  - 24/7 Rapid Emergency Dispatch portal with $\sim$20-min guaranteed response times.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: Vanilla CSS + Tailored Design System (Black + Emerald Green theme with complete Light & Dark mode support)
- **Icons**: Lucide React
- **Architecture**: Modular Component-Driven Design, React Context API, PushState SPA Router

---

## 💻 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/rohithadevarakonda39-star/Service-Market-Place-1.git
cd Service-Market-Place-1
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```
