const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/auth/me - Get current user profile + trial status
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) return res.status(404).json({ error: 'Profile not found' });

    const now = new Date();
    const trialEnd = new Date(profile.trial_ends_at);
    const trialActive = trialEnd > now;
    const trialDaysLeft = trialActive
      ? Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
      : 0;

    // Get subscription if exists
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', req.user.id)
      .in('status', ['active', 'trialing'])
      .single();

    res.json({
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
      },
      trial: {
        active: trialActive,
        ends_at: profile.trial_ends_at,
        days_left: trialDaysLeft,
      },
      subscription: subscription || null,
      has_access: trialActive || !!subscription,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
