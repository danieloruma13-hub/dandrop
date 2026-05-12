// =============================================
// DANDROP — Products Routes
// File: backend/routes/products.js
// =============================================

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const cj = require('../services/cjdropshipping');
const shopify = require('../services/shopify');
const { calculateOptimalPrice, STRATEGIES } = require('../services/priceOptimizer');
const { requireAuth, requireAccess } = require('../middleware/auth');

router.use(requireAuth, requireAccess);

// ─── SEARCH PRODUCTS ──────────────────────────
// GET /api/products/search?keyword=phone+stand&page=1
router.get('/search', async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20, categoryId } = req.query;
    if (!keyword) return res.status(400).json({ error: 'keyword is required' });

    const results = await cj.searchProducts({ keyword, page: parseInt(page), limit: parseInt(limit), categoryId });
    res.json({ products: results });
  } catch (err) {
    res.status(500).json({ error: 'Product search failed: ' + err.message });
  }
});

// ─── TRENDING PRODUCTS ────────────────────────
// GET /api/products/trending
router.get('/trending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const results = await cj.getTrendingProducts(parseInt(page), parseInt(limit));
    res.json({ products: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending products: ' + err.message });
  }
});

// ─── GET CATEGORIES ───────────────────────────
// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await cj.getCategories();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories: ' + err.message });
  }
});

// ─── GET PRODUCT DETAILS ──────────────────────
// GET /api/products/details/:pid
router.get('/details/:pid', async (req, res) => {
  try {
    const product = await cj.getProductDetails(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Get shipping options for US by default
    const shipping = await cj.getShippingOptions({ pid: req.params.pid, country: 'US' });

    // Calculate optimal price
    const pricing = calculateOptimalPrice({
      supplierCost: product.sellPrice,
      shippingCost: shipping?.[0]?.logisticPrice || 0,
      strategy: STRATEGIES.MULTIPLIER,
      multiplier: 2.5,
    });

    res.json({ product, shipping, pricing });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product: ' + err.message });
  }
});

// ─── IMPORT PRODUCT TO SHOPIFY ────────────────
// POST /api/products/import
router.post('/import', async (req, res) => {
  try {
    const {
      cjProductId,
      storeId,
      multiplier = 2.5,
      strategy = 'multiplier',
      autoUpdatePrice = true,
      autoPauseOutOfStock = true,
    } = req.body;

    if (!cjProductId || !storeId) {
      return res.status(400).json({ error: 'cjProductId and storeId are required' });
    }

    // Verify store belongs to user
    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', req.user.id)
      .single();

    if (!store) return res.status(404).json({ error: 'Store not found' });

    // Get CJ product details
    const cjProduct = await cj.getProductDetails(cjProductId);
    if (!cjProduct) return res.status(404).json({ error: 'CJ product not found' });

    // Calculate price
    const pricing = calculateOptimalPrice({
      supplierCost: cjProduct.sellPrice,
      strategy,
      multiplier,
    });

    // Import to Shopify
    const shopifyProduct = await shopify.importProductToShopify(
      req.user.id,
      cjProduct,
      multiplier
    );

    // Save to DB
    const { data: imported, error: dbError } = await supabase
      .from('imported_products')
      .insert({
        user_id: req.user.id,
        store_id: storeId,
        cj_product_id: cjProductId,
        shopify_product_id: shopifyProduct.id.toString(),
        shopify_variant_id: shopifyProduct.variants?.[0]?.id?.toString(),
        product_title: cjProduct.productNameEn,
        cj_cost: cjProduct.sellPrice,
        shopify_price: pricing.recommendedPrice,
        last_known_stock: cjProduct.variants?.[0]?.inventoryNum || 100,
        pricing_settings: { multiplier, strategy },
        auto_update_price: autoUpdatePrice,
        auto_pause_out_of_stock: autoPauseOutOfStock,
        is_active: true,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    res.json({
      message: 'Product imported successfully',
      shopifyProduct,
      imported,
      pricing,
    });
  } catch (err) {
    res.status(500).json({ error: 'Import failed: ' + err.message });
  }
});

// ─── GET IMPORTED PRODUCTS ────────────────────
// GET /api/products/imported
router.get('/imported', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('imported_products')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ products: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch imported products' });
  }
});

// ─── UPDATE PRICING SETTINGS ──────────────────
// PUT /api/products/:id/pricing
router.put('/:id/pricing', async (req, res) => {
  try {
    const { multiplier, strategy, autoUpdatePrice } = req.body;

    const { data, error } = await supabase
      .from('imported_products')
      .update({
        pricing_settings: { multiplier, strategy },
        auto_update_price: autoUpdatePrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Pricing settings updated', product: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pricing' });
  }
});

// ─── DELETE / REMOVE PRODUCT ──────────────────
// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await supabase
      .from('imported_products')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    res.json({ message: 'Product removed from Dandrop' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove product' });
  }
});

module.exports = router;
