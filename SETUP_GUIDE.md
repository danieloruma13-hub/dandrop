# 🚀 DANDROP — COMPLETE SETUP GUIDE
# Follow these steps in order to launch your app

## ═══════════════════════════════════════
## STEP 1 — SUPABASE SETUP (Database)
## ═══════════════════════════════════════

1. Go to https://supabase.com and create a free account
2. Click "New Project" → name it "dandrop"
3. Save your database password somewhere safe
4. Wait for project to finish setting up (~2 mins)

5. Go to SQL Editor (left sidebar)
6. Paste the entire contents of supabase_schema.sql
7. Click "Run" — this creates all your tables

8. Go to Settings > API
9. Copy your:
   - Project URL → SUPABASE_URL
   - anon/public key → REACT_APP_SUPABASE_ANON_KEY
   - service_role key → SUPABASE_SERVICE_KEY


## ═══════════════════════════════════════
## STEP 2 — STRIPE SETUP (Payments)
## ═══════════════════════════════════════

1. Go to https://stripe.com and create a free account
2. Go to Developers > API Keys
3. Copy your Secret Key → STRIPE_SECRET_KEY

4. Create your products:
   Go to Products > Add Product

   Product 1:
   - Name: Dandrop Starter
   - Price: $19.00/month (recurring)
   - Copy Price ID → STRIPE_STARTER_PRICE_ID

   Product 2:
   - Name: Dandrop Pro
   - Price: $49.00/month (recurring)
   - Copy Price ID → STRIPE_PRO_PRICE_ID

   Product 3:
   - Name: Dandrop Business
   - Price: $99.00/month (recurring)
   - Copy Price ID → STRIPE_BUSINESS_PRICE_ID

5. Set up Webhook:
   - Go to Developers > Webhooks > Add Endpoint
   - URL: https://your-backend-url.com/api/stripe/webhook
   - Events to listen for:
     ✅ checkout.session.completed
     ✅ invoice.payment_succeeded
     ✅ invoice.payment_failed
     ✅ customer.subscription.deleted
   - Copy Signing Secret → STRIPE_WEBHOOK_SECRET

6. Update Stripe Price IDs in Supabase:
   Run this SQL in Supabase SQL Editor:
   UPDATE plans SET stripe_price_id = 'price_xxx' WHERE name = 'starter';
   UPDATE plans SET stripe_price_id = 'price_xxx' WHERE name = 'pro';
   UPDATE plans SET stripe_price_id = 'price_xxx' WHERE name = 'business';


## ═══════════════════════════════════════
## STEP 3 — BACKEND SETUP (Node.js)
## ═══════════════════════════════════════

1. Open terminal in the /backend folder

2. Install dependencies:
   npm install

3. Create your .env file:
   cp .env.example .env

4. Fill in all values in .env file

5. Run the backend:
   npm run dev

6. Test it's working:
   Open browser → http://localhost:5000/health
   Should show: {"status":"Dandrop API running"}


## ═══════════════════════════════════════
## STEP 4 — FRONTEND SETUP (React)
## ═══════════════════════════════════════

1. Open terminal in the /frontend folder

2. Install dependencies:
   npm install

3. Create your .env file:
   cp .env.example .env

4. Fill in your Supabase URL and anon key

5. Run the frontend:
   npm start

6. Open browser → http://localhost:3000
   Your app is running! 🎉


## ═══════════════════════════════════════
## STEP 5 — FREE HOSTING (Go Live)
## ═══════════════════════════════════════

### Frontend → Vercel (Free)
1. Go to https://vercel.com and sign up with GitHub
2. Push your frontend folder to a GitHub repo
3. Import the repo in Vercel
4. Add environment variables (same as .env)
5. Deploy → get your free URL (dandrop.vercel.app)

### Backend → Railway (Free tier)
1. Go to https://railway.app and sign up
2. New Project > Deploy from GitHub
3. Select your backend folder
4. Add environment variables
5. Deploy → get your backend URL

6. Update FRONTEND_URL in backend .env with Vercel URL
7. Update REACT_APP_API_URL in frontend .env with Railway URL
8. Redeploy both


## ═══════════════════════════════════════
## STEP 6 — TEST YOUR APP
## ═══════════════════════════════════════

✅ Sign up → 7 day trial starts automatically
✅ Log in → dashboard loads with trial banner
✅ Wait for trial to expire → paywall appears
✅ Click upgrade → Stripe checkout opens
✅ Complete payment → full access restored
✅ Manage billing → Stripe portal opens


## ═══════════════════════════════════════
## FOLDER STRUCTURE
## ═══════════════════════════════════════

dandrop/
├── supabase_schema.sql     ← Run this in Supabase first
├── backend/
│   ├── server.js           ← Main Node.js server
│   ├── .env.example        ← Copy to .env and fill in
│   ├── config/
│   │   └── supabase.js     ← Supabase client
│   ├── middleware/
│   │   └── auth.js         ← Auth + trial/paywall check
│   └── routes/
│       ├── auth.js         ← User profile endpoint
│       ├── subscriptions.js← Plans + subscription endpoints
│       ├── stripe.js       ← Checkout + webhook handler
│       └── dashboard.js    ← Protected dashboard data
└── frontend/
    ├── package.json
    ├── .env.example        ← Copy to .env and fill in
    └── src/
        ├── supabase.js     ← Supabase client
        ├── context/
        │   └── AuthContext.js ← Global auth state
        └── pages/
            (all pages in DandropApp.jsx for now)


## ═══════════════════════════════════════
## NEED HELP?
## ═══════════════════════════════════════

Supabase docs: https://supabase.com/docs
Stripe docs:   https://stripe.com/docs
Vercel docs:   https://vercel.com/docs
Railway docs:  https://docs.railway.app
