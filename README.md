# Cal Scheduler Clone

A full-stack meeting scheduling application inspired by Cal.com. It allows users to manage event types, set custom availability windows, and share a public booking page — while automatically emailing confirmations and cancellations to attendees.

---

## 🚀 Deployment

| Service | Platform | URL |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) |https://cal-scheduler-clone.vercel.app/ |
| **Backend** | [Render](https://render.com) | https://cal-scheduler-clone.onrender.com |
| **Database** | [Railway](https://railway.app) | MySQL on Railway |

---

## Features

### Public Booking
- **Landing Page** — Marketing-style entry page for the application.
- **Public Profile Page** — A clean, two-card layout showing the host's name and all active event types.
- **Booking Page** — A premium three-column layout:
  - Left: Event info (title, duration, location, timezone)
  - Center: Interactive calendar for date selection
  - Right: Time slot picker with 12-hour AM/PM formatting (e.g., `9:00am`)
- **Confirmation Page** — Post-booking confirmation screen with event details.
- **Smart Slot Generation** — Available time slots are generated based on the host's configured availability window and the meeting duration.
- **Timezone-Aware** — Slot generation respects the host's schedule timezone for accurate local times.
- **Confirmation Email** — A formatted HTML email is sent to the attendee after every successful booking.

### Admin Dashboard
- **Event Type Management** — Create, edit, and toggle active/inactive event types.
- **Event Type Edit Page** — A card-based edit page with tabs:
  - **Basics** — Title, description, URL slug, duration, and location type.
  - **Availability** — Link an availability schedule to the event type.
  - **Available Durations** — Multi-select dropdown to offer multiple duration options to bookers.
- **Top Bar Actions** — Delete, Copy Booking Link, and External View actions for each event type.

### Availability Management
- **Multiple Schedules** — Create and name multiple availability schedules.
- **Weekly Rules** — Enable/disable individual days and set per-day time windows (e.g., Monday 9:00 AM – 5:00 PM).
- **Default Schedule** — Pre-configured with Monday–Friday, 9 AM to 5 PM.
- **Real-Time Preview** — Switching schedules instantly updates the availability preview on the event edit page.
- **12-Hour Time Format** — All availability times are displayed in AM/PM format throughout the application.

### Bookings Dashboard
- **Upcoming / Past / Cancelled** — Filtered views for all booking states.
- **Booking Detail** — View booker name, email, time, and any notes.
- **Cancellation** — Cancel a booking and send an automatic cancellation notification email.

### Email Notifications
- **Booking Confirmation** — Rich HTML email sent on every successful booking.
- **Cancellation Email** — Notification sent when a booking is cancelled.
- **SMTP Configurable** — Works with any SMTP provider (Gmail, Outlook, SendGrid, etc.).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, TailwindCSS, Lucide Icons |
| Backend | Node.js, Express 5 |
| Database | MySQL 8 (hosted on Railway) |
| Email | Nodemailer |
| ORM/Query | mysql2 (raw queries) |
| Auth | Session-based (no JWT) |
| Deployment | Vercel (frontend), Render (backend), Railway (database) |

---

## Project Structure

```
cal-scheduler-clone/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection config
│   │   ├── controllers/        # Route handler functions
│   │   ├── db/
│   │   │   ├── schema.sql      # Full database schema
│   │   │   └── seed.sql        # Seed data for development
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── validateRequest.js  # Request validation middleware
│   │   ├── models/             # Database query helpers
│   │   ├── routes/             # Express route definitions
│   │   ├── services/
│   │   │   ├── bookingService.js   # Booking creation & management
│   │   │   ├── emailService.js     # Nodemailer email sending
│   │   │   └── slotService.js      # Available slot generation
│   │   ├── utils/
│   │   │   ├── AppError.js         # Custom error class
│   │   │   ├── responseHelper.js   # Standardised API responses
│   │   │   └── timeUtils.js        # Timezone & time helpers
│   │   └── app.js              # Express app setup
│   ├── migrate.js              # Migration v1 (initial schema)
│   ├── migrate_v2.js           # Migration v2
│   ├── migrate_v3.js           # Migration v3
│   ├── migrate_v4.js           # Migration v4
│   ├── migrate_v5.js           # Migration v5
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Template for environment variables
│   ├── package.json
│   └── server.js               # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API wrappers (publicApi, adminApi)
│   │   ├── components/
│   │   │   ├── availability/   # Availability-related components
│   │   │   ├── booking-page/   # Booking page components
│   │   │   ├── bookings/       # Bookings dashboard components
│   │   │   ├── event-types/    # Event type card & list components
│   │   │   ├── layout/         # Sidebar, Topbar, Shell layout
│   │   │   └── ui/             # Generic reusable UI components
│   │   ├── hooks/
│   │   │   ├── useBookings.js      # Bookings data hook
│   │   │   └── useEventTypes.js    # Event types data hook
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AvailabilityDetailPage.jsx
│   │   │   │   ├── AvailabilityPage.jsx
│   │   │   │   ├── BookingsPage.jsx
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── EventTypeEditPage.jsx
│   │   │   │   └── EventTypesPage.jsx
│   │   │   └── public/
│   │   │       ├── BookingPage.jsx
│   │   │       ├── ConfirmationPage.jsx
│   │   │       ├── LandingPage.jsx
│   │   │       └── PublicProfilePage.jsx
│   │   ├── store/              # Zustand state (toastStore)
│   │   ├── styles/             # Additional CSS modules
│   │   ├── utils/              # Frontend utility helpers
│   │   ├── router.jsx          # React Router route definitions
│   │   ├── style.css           # Global styles
│   │   └── main.tsx            # App entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json             # Vercel deployment config (SPA rewrites)
│   ├── vite.config.js
│   └── package.json
│
├── .nvmrc                      # Node version lock
├── .gitignore
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MySQL 8+ (or a Railway MySQL instance)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cal-scheduler-clone.git
cd cal-scheduler-clone
```

### 2. Set up the Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Database (local or Railway)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cal_clone

# SMTP (e.g. Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cal Scheduler <your-email@gmail.com>"
```

> **Gmail Users**: Use a [Google App Password](https://myaccount.google.com/apppasswords), not your regular password. 2-Step Verification must be enabled.

Run database migrations in order:
```bash
node migrate.js
node migrate_v2.js
node migrate_v3.js
node migrate_v4.js
node migrate_v5.js
```

Start the backend:
```bash
npm run dev
```

### 3. Set up the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
| URL | Description |
|---|---|
| `http://localhost:5173` | Landing Page |
| `http://localhost:5173/dashboard` | Admin Dashboard |
| `http://localhost:5173/u/{username}` | Public Profile Page |
| `http://localhost:5173/book/{slug}` | Public Booking Page |

---

## Deployment Guide

### Database — Railway
1. Create a new **MySQL** service on [Railway](https://railway.app).
2. Copy the connection variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) from the Railway dashboard.
3. Run all migration scripts against the Railway database to set up the schema.

### Backend — Render
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service** pointing to the `backend/` directory.
3. Set the **Start Command** to `node server.js`.
4. Add all environment variables from `.env.example` in the Render dashboard, using your Railway database credentials.
5. Set `CLIENT_URL` to your Vercel frontend URL.

### Frontend — Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend/`.
3. Vercel auto-detects Vite — no build config changes needed.
4. Set the environment variable `VITE_API_URL` (or equivalent) to your Render backend URL.
5. The `vercel.json` file handles SPA client-side routing rewrites automatically.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `CLIENT_URL` | Frontend origin for CORS |
| `DB_HOST` | MySQL host (Railway hostname) |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | SMTP username / sender email |
| `SMTP_PASS` | SMTP password or App Password |
| `SMTP_FROM` | Display name and email for outgoing mail |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL of the deployed backend (Render URL) |
