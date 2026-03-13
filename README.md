# Cal Scheduler Clone

A full-stack meeting scheduling application inspired by Cal.com. It allows users to manage event types, set custom availability windows, and share a public booking page — while automatically emailing confirmations to attendees.

---

## Features
### Public Booking
- **Public Profile Page** — A clean, two-card layout showing the host's name and all active event types.
- **Booking Page** — A premium three-column layout:
  - Left: Event info (title, duration, location, timezone)
  - Center: Interactive calendar for date selection
  - Right: Time slot picker with 12-hour AM/PM formatting (e.g., `9:00am`)
- **Smart Slot Generation** — Available time slots are generated based on the host's configured availability window and the meeting duration.
- **Timezone-Aware** — Slot generation respects the host's schedule timezone to ensure accurate local times for both host and booker.
- **Confirmation Email** — After a booking is confirmed, a formatted HTML email is sent to the attendee with event details (title, time, participants, and notes).

### Admin Dashboard
- **Event Type Management** — Create, edit, and toggle active/inactive event types.
- **Event Type Edit Page** — A premium card-based edit page with tabs:
  - **Basics** — Title, description, URL slug, duration, and location type.
  - **Availability** — Link an availability schedule to the event type.
  - **Available Durations** — Multi-select dropdown to offer multiple duration options to bookers.
- **Top Bar Actions** — Delete, Copy Booking Link, and External View actions for each event type.

### Availability Management
- **Multiple Schedules** — Create and name multiple availability schedules.
- **Weekly Rules** — Enable/disable individual days and set per-day time windows (e.g., Monday 9:00 AM – 5:00 PM).
- **Default Schedule** — Default schedule pre-configured with Monday–Friday, 9 AM to 5 PM.
- **Real-Time Preview** — Switching between schedules instantly updates the availability preview on the event edit page.
- **12-Hour Time Format** — All availability times are displayed in AM/PM format throughout the application.

### Bookings Dashboard
- **Upcoming / Past / Cancelled** — Filtered views for all booking states.
- **Booking Detail** — View booker name, email, time, and any notes.
- **Cancellation** — Cancel a booking and send an automatic cancellation notification email.

### Email Notifications
- **Booking Confirmation** — Rich HTML email sent on every successful booking.
- **Cancellation Email** — Plain-text notification sent when a booking is cancelled.
- **SMTP Configurable** — Works with any SMTP provider (Gmail, Outlook, SendGrid, etc.).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Lucide Icons |
| Backend | Node.js, Express 5 |
| Database | MySQL 8 |
| Email | Nodemailer |
| ORM/Query | mysql2 (raw queries) |
| Auth | Session-based (no JWT) |

---

## Project Structure

```
cal-scheduler-clone/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database query helpers
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic (bookingService, slotService, emailService)
│   │   └── utils/          # Helpers (timeUtils, AppError, responseHelper)
│   ├── .env                # Environment variables (not committed)
│   ├── .env.example        # Template for environment variables
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API wrappers (publicApi, adminApi)
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/
│   │   │   ├── admin/      # EventTypeEditPage, AvailabilityDetailPage, BookingsPage, etc.
│   │   │   └── public/     # PublicProfilePage, BookingPage, ConfirmationPage
│   │   ├── store/          # Zustand state (toastStore)
│   │   └── main.jsx        # App entry point
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

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

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cal_clone

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cal Scheduler <your-email@gmail.com>"
```

> **Gmail Users**: Use a [Google App Password](https://myaccount.google.com/apppasswords), not your regular password. 2-Step Verification must be enabled.

Run database migrations:
```bash
node migrate.js
node migrate_v2.js
node migrate_v3.js
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
| `http://localhost:5173` | Dashboard (Admin) |
| `http://localhost:5173/u/{username}` | Public Profile Page |
| `http://localhost:5173/book/{slug}` | Public Booking Page |

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `CLIENT_URL` | Frontend origin for CORS |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | SMTP username / sender email |
| `SMTP_PASS` | SMTP password or App Password |
| `SMTP_FROM` | Display name and email for outgoing mail |
