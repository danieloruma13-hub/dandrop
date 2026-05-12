const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Check subscription or active trial
const requireAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user profile with trial info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('trial_ends_at, is_trial_active')
      .eq('id', userId)
      .single();

    if (profileError) return res.status(404).json({ error: 'Profile not found' });

    const trialActive = new Date(profile.trial_ends_at) > new Date();

    if (trialActive) {
      req.accessType = 'trial';
      req.trialEndsAt = profile.trial_ends_at;
      return next();
    }

    // Check for active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subscription) {
      req.accessType = 'subscribed';
      req.subscription = subscription;
      return next();
    }

    // No trial, no subscription — paywall
    return res.status(403).json({
      error: 'trial_expired',
      message: 'Your 7-day free trial has ended. Please subscribe to continue.',
      trialExpired: true
    });

  } catch (err) {
    return res.status(500).json({ error: 'Access check failed' });
  }
};

module.exports = { requireAuth, requireAccess };
