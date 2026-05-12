const express = require('express');
const router = express.Router();
const { requireAuth, requireAccess } = require('../middleware/auth');

// All dashboard routes require auth + active trial or subscription
router.use(requireAuth, requireAccess);

// GET /api/dashboard/stats - Main dashboard stats
router.get('/stats', async (req, res) => {
  // In production, fetch real data from your store integrations
  // For now returning mock data structure
  res.json({
    access_type: req.accessType,
    trial_ends_at: req.trialEndsAt || null,
    stats: {
      revenue_today: 3240,
      orders_today: 142,
      net_profit: 891,
      winning_products: 7,
    },
    recent_orders: [
      { id: '#4521', product: 'Wireless Earbuds', supplier: 'AliExpress', status: 'shipped' },
      { id: '#4520', product: 'Phone Stand Pro', supplier: 'CJ Drop', status: 'delivered' },
      { id: '#4519', product: 'LED Desk Lamp', supplier: 'Zendrop', status: 'processing' },
    ]
  });
});

module.exports = router;
