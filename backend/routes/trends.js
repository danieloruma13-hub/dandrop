const express = require('express');
const router = express.Router();
const { checkTrend, scoreProduct, scoreMultipleProducts } = require('../services/googleTrends');
const { requireAuth, requireAccess } = require('../middleware/auth');

router.use(requireAuth, requireAccess);

// Check single product trend
// GET /api/trends/check?keyword=wireless+earbuds
router.get('/check', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: 'keyword is required' });
    const result = await checkTrend(keyword);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Score a product
// POST /api/trends/score
router.post('/score', async (req, res) => {
  try {
    const { productName, supplierCost, shippingCost } = req.body;
    if (!productName || !supplierCost) {
      return res.status(400).json({ error: 'productName and supplierCost are required' });
    }
    const result = await scoreProduct(productName, supplierCost, shippingCost || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Score multiple products
// POST /api/trends/score-multiple
router.post('/score-multiple', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'products array is required' });
    }
    if (products.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 products at once' });
    }
    const results = await scoreMultipleProducts(products);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
