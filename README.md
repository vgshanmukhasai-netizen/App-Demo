# 🌾 AgroSelf — Agriculture & AgriTech Farmer Self-Service App

A full-stack AgriTech platform to help farmers manage crops, track growth, plan irrigation, get weather insights, and make profitable farming decisions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- OpenWeatherMap API key (free)

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd agro-self
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env and fill in:
#   MONGODB_URI — your MongoDB Atlas connection string
#   JWT_SECRET  — any random secret key
#   WEATHER_API_KEY — from openweathermap.org (for Phase 7+)
npm install
npm run dev
```

Backend runs at: http://localhost:5000

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### 4. Seed Market Data (Optional)

```bash
cd server
npm run seed
```

---

## 📁 Project Structure

```
agro-self/
├── client/          → React Frontend (Vite)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       └── constants/
└── server/          → Node.js + Express Backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── services/
    └── data/
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register farmer |
| POST | /api/auth/login | Login farmer |
| GET | /api/farmers/me | Get profile |
| PUT | /api/farmers/me | Update profile |
| GET | /api/crops | Get all crops |
| POST | /api/crops | Add crop |
| GET | /api/crops/:id | Get crop detail |
| PUT | /api/crops/:id | Update crop |
| DELETE | /api/crops/:id | Delete crop |
| POST | /api/crops/:id/stage | Update growth stage |
| POST | /api/crops/:id/water | Log watering |
| GET | /api/market | Get market data |
| GET | /api/notifications | Get notifications |

---

## 🗺️ Development Phases

- **Phase 1** ✅ Project Setup
- **Phase 2** ✅ UI Design System & Navigation  
- **Phase 3** ✅ Farmer Registration & Login
- **Phase 4** ✅ Farmer Profile
- **Phase 5** ✅ Crop Management
- **Phase 6** 🔜 Smart Irrigation
- **Phase 7** 🔜 Weather Integration
- **Phase 8** 🔜 AI Crop Advisor
- **Phase 9** ✅ Market & Profit Calculator
- **Phase 10** 🔜 Offline-First & Sync
- **Phase 11** ✅ Notifications (backend done)
- **Phase 12** 🔜 Testing & Final Deployment

---

## 🔒 Important Security Notes

- Every API route filters data by `farmerId` from JWT — farmers can only see their own data
- Passwords are hashed with bcryptjs (12 salt rounds)
- JWT tokens expire in 7 days
- Rate limiting: 100 requests per 15 minutes per IP

---

## 📝 License

College Project — Academic Use Only
