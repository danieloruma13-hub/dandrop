# 🚀 Dandrop Tech — Dropshipping Platform

A full-stack dropshipping platform built with React, Node.js/Express, and Supabase.

---

## 📁 Project Structure

```
dandrop/
├── backend/          ← Node.js + Express API
│   ├── routes/       ← API route handlers
│   ├── middleware/   ← Auth middleware
│   ├── config/       ← Supabase client
│   ├── server.js     ← Entry point
│   └── supabase_schema.sql  ← Run this in Supabase
└── frontend/         ← React + Vite app
    └── src/
        ├── pages/    ← All pages
        ├── components/ ← Shared components
        ├── store/    ← Zustand state
        └── lib/      ← API client
```

---

## ⚙️ Setup Instructions

### 1. Supabase
- Go to supabase.com → New project
- Open SQL Editor → paste contents of `backend/supabase_schema.sql` → Run
- Copy your **Project URL** and **service_role key** (Settings → API)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables (backend/.env)
```
PORT=5000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=any_random_secret_string
PAYSTACK_SECRET_KEY=sk_test_xxxx
CJ_API_KEY=your_cj_key (optional)
FRONTEND_URL=http://localhost:5173
RENDER_URL=https://your-app.onrender.com (for self-ping)
```

---

## 🌐 Deployment

### Backend → Render
1. Push backend folder to GitHub
2. Create Web Service on render.com
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables
6. Deploy!

### Frontend → Vercel / Netlify
1. Push frontend folder to GitHub
2. Import to vercel.com
3. Set VITE_API_URL if needed
4. Deploy!

---

## 🏓 Keep Render Alive (Free Tier)
Add your Render URL to `.env` as `RENDER_URL` — the server self-pings every 4 minutes.
Also set up a free monitor at uptimerobot.com for extra reliability.

---

## 💳 Payments
This project uses Paystack. Get your keys at dashboard.paystack.com.
Works with Kuda, Palmpay, and all Nigerian bank cards.

---

Built with ❤️ — Dandrop Tech
