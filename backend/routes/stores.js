// =============================================
// DANDROP — Stores Routes
// File: backend/routes/stores.js
// =============================================

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyStoreConnection } = require('../services/shopify');
const { requireAuth, requireAccess } = require('../middleware/auth');

router.use(requireAuth, requireAccess);

// ─── CONNECT SHOPIFY STORE ────────────────────
// POST /api/stores/connect
router.post('/connect', async (req, res) => {
  try {
    const { shopifyDomain, accessToken, storeName } = req.body;

    if (!shopifyDomain || !accessToken) {
      return res.status(400).json({ error: 'shopifyDomain and accessToken are required' });
    }

    // Clean domain format
    const domain = shopifyDomain
      .replace('https://', '')
      .replace('http://', '')
      .replace(/\/$/, '');

    // Verify the connection works
    const shopInfo = await verifyStoreConnection(domain, accessToken);

    // Check plan limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    const { data: existingStores } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('is_active', true);

    const maxStores = subscription?.plans?.max_stores;
    if (maxStores && existingStores?.length >= maxStores) {
      return res.status(403).json({
        error: `Your plan allows max ${maxStores} store(s). Upgrade to connect more.`
      });
    }

    // Save store to DB
    const { data: store, error } = await supabase
      .from('stores')
      .insert({
        user_id: req.user.id,
        name: storeName || shopInfo.name,
        shopify_domain: domain,
        shopify_access_token: accessToken,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Store connected successfully!',
      store: {
        id: store.id,
        name: store.name,
        domain: store.shopify_domain,
      },
      shopInfo,
    });
  } catch (err) {
    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid Shopify access token' });
    }
    res.status(500).json({ error: 'Failed to connect store: ' + err.message });
  }
});

// ─── GET USER STORES ──────────────────────────
// GET /api/stores
router.get('/', async (req, res) => {
  try {
    const { data: stores, error } = await supabase
      .from('stores')
      .select('id, name, shopify_domain, is_active, created_at')
      .eq('user_id', req.user.id)
      .eq('is_active', true);

    if (error) throw error;
    res.json({ stores });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// ─── DISCONNECT STORE ─────────────────────────
// DELETE /api/stores/:id
router.delete('/:id', async (req, res) => {
  try {
    await supabase
      .from('stores')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    res.json({ message: 'Store disconnected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to disconnect store' });
  }
});

module.exports = router;
