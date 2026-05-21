// =============================================
// DANDROP — Updated server.js
// REPLACE your existing server.js with this
// =============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const stripeRoutes = require('./routes/stripe');
const dashboardRoutes = require('./routes/dashboard');
const trendsRoutes = require('./routes/trends');
const productRoutes = require('./routes/products');     // NEW
const storeRoutes = require('./routes/stores');         // NEW
const invoiceRoutes = require('./routes/invoices');     // NEW
const aliexpressRoutes = require('./routes/aliexpress');

// Jobs
const { startMonitoringScheduler } = require('./jobs/monitorPrices'); // NEW

const app = express();

// Stripe webhook needs raw body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Dandrop API running', timestamp: new Date().toISOString() });
});

// ─── ROUTES ───────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/products', productRoutes);   // NEW
app.use('/api/stores', storeRoutes);       // NEW
app.use('/api/invoices', invoiceRoutes);
app.use('/api/aliexpress', aliexpressRoutes);   // NEW

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Dandrop backend running on port ${PORT}`);

  // Start price & stock monitoring scheduler
  startMonitoringScheduler(); // NEW
});
