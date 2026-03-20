# 🏏 IGNOU Cricket Club — Bowling Stats Tracker

A full-stack MERN application for tracking bowling statistics for IGNOU Cricket Club members, featuring glassmorphism UI with dark theme.

---

## 🚀 Features

### Public Pages

- **🏏 Bowlers Page** — Cards for each bowler with Home / Away / Overall stat tabs
  - Matches played, Overs bowled, Wickets taken
  - Economy rate, Bowling Strike Rate, 3+ Wicket Hauls
  - Search, filter by role, sort by name/wickets/economy
- **🏆 Rankings Page** — Leaderboard ranked by Wickets → Economy → Strike Rate
  - Podium display for top 3, full table below
- **⭐ Bowler of Week Page** — Sunday evening announcements
  - Current winner with reason & highlights
  - Past winners history

### Admin Panel (Protected)

- JWT authentication — login at `/admin/login`
- Add new bowlers with full stats
- Edit any bowler's info and home/away stats
- Deactivate / Reactivate bowlers
- Announce Bowler of the Week
- All changes reflect immediately on public site

---

## 🛠 Tech Stack

| Layer    | Tech                             |
| -------- | -------------------------------- |
| Frontend | React 18 + Vite + Tailwind CSS 3 |
| Backend  | Node.js + Express 4              |
| Database | MongoDB + Mongoose 8             |
| Auth     | JWT (jsonwebtoken) + bcryptjs    |
| HTTP     | Native Fetch API (no axios)      |

---

## 📁 Project Structure

```
ignou-cricket/
├── backend/
│   ├── models/
│   │   ├── User.js          # Admin user model
│   │   ├── Bowler.js        # Bowler with home/away stats
│   │   └── BowlerOfWeek.js  # Weekly announcement model
│   ├── routes/
│   │   ├── auth.js          # Login, register-admin, /me
│   │   ├── bowlers.js       # Public bowler & rankings routes
│   │   ├── admin.js         # Protected admin CRUD routes
│   │   └── bowlerOfWeek.js  # BOW announcement routes
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly middleware
│   ├── server.js
│   ├── seed.js              # Database seeder
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BowlerCard.jsx
    │   │   ├── StatBadge.jsx
    │   │   ├── BgOrbs.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── RankingsPage.jsx
    │   │   ├── BowlerOfWeekPage.jsx
    │   │   ├── AdminLoginPage.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── utils/
    │   │   └── api.js         # All fetch API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css          # Glassmorphism + Tailwind styles
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Clone and setup

```bash
git clone <repo>
cd ignou-cricket
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET

# Seed database with sample bowlers + admin account
npm run seed

# Start backend dev server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start frontend dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔐 Admin Setup

### Default admin credentials (after seeding):

```
Username: admin
Password: admin123
```

### Register a new admin:

```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"username":"myadmin","password":"mypassword","setupKey":"IGNOU_ADMIN_2024"}'
```

Change `ADMIN_SETUP_KEY` in `.env` for production.

---

## 🌐 API Endpoints

### Public

| Method | Route                         | Description        |
| ------ | ----------------------------- | ------------------ |
| GET    | `/api/bowlers`                | All active bowlers |
| GET    | `/api/bowlers/rankings`       | Ranked bowlers     |
| GET    | `/api/bowler-of-week/current` | Current BOW        |
| GET    | `/api/bowler-of-week/history` | Past BOW history   |

### Auth

| Method | Route                      | Description                      |
| ------ | -------------------------- | -------------------------------- |
| POST   | `/api/auth/login`          | Admin login                      |
| POST   | `/api/auth/register-admin` | Register admin (needs setup key) |
| GET    | `/api/auth/me`             | Get current user                 |

### Admin (JWT required)

| Method | Route                          | Description                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/api/admin/bowlers`           | All bowlers (inc. inactive) |
| POST   | `/api/admin/bowlers`           | Add new bowler              |
| PUT    | `/api/admin/bowlers/:id`       | Update bowler               |
| PATCH  | `/api/admin/bowlers/:id/stats` | Update stats only           |
| DELETE | `/api/admin/bowlers/:id`       | Deactivate bowler           |
| POST   | `/api/bowler-of-week`          | Announce BOW                |
| DELETE | `/api/bowler-of-week/:id`      | Remove announcement         |

---

## 🎨 UI Design

- **Theme**: Dark glassmorphism with neon green/teal accents
- **Fonts**: Rajdhani (display), Exo 2 (body), JetBrains Mono (stats)
- **Glass effects**: `backdrop-filter: blur` with semi-transparent borders
- **Fully responsive**: Mobile, tablet, desktop layouts
- **Animations**: Floating orbs, pulse glows, fade-in transitions

---

## 🏗 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve static files from backend (add to server.js):
# import { fileURLToPath } from 'url';
# import { join, dirname } from 'path';
# const __dirname = dirname(fileURLToPath(import.meta.url));
# app.use(express.static(join(__dirname, '../frontend/dist')));
# app.get('*', (req, res) => res.sendFile(join(__dirname, '../frontend/dist/index.html')));
```

---

## 📝 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ignou_cricket
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
ADMIN_SETUP_KEY=IGNOU_ADMIN_2024
```
