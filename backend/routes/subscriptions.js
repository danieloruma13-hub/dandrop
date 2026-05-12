const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/subscriptions/plans - Get all available plans
router.get('/plans', async (req, res) => {
  try {
    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) throw error;
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// GET /api/subscriptions/current - Get user's current subscription
router.get('/current', requireAuth, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ subscription: subscription || null });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

module.exports = router;
