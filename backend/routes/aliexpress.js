const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createClient } = require("@supabase/supabase-js");
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });
    const response = await fetch(`https://${RAPIDAPI_HOST}/searchProducts.php?keywords=${encodeURIComponent(q)}&page=1&pageSize=20&lang=en_US&country=US&currency=USD`, { headers: { "x-rapidapi-host": RAPIDAPI_HOST, "x-rapidapi-key": RAPIDAPI_KEY } });
    const data = await response.json();
    const products = (data.data?.products || data.data?.result || []).map(p => ({ id: String(p.productId || p.itemId || Math.random()), title: p.title || p.productTitle || "Unknown", price: p.salePrice || p.price || "0", originalPrice: p.originalPrice, image: p.productMainImageUrl || p.imageUrl, rating: p.evaluateRate || p.starRating, orders: p.totalOrders || p.orders, shipping: p.logisticsDesc || "Free Shipping", url: `https://www.aliexpress.com/item/${p.productId || p.itemId}.html` }));
    res.json({ products, total: products.length });
  } catch (err) { res.status(500).json({ error: "Search failed: " + err.message }); }
});
router.post("/import", auth, async (req, res) => {
  try {
    const { product } = req.body;
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error } = await supabase.from("imported_products").insert({ user_id: req.user.id, product_id: product.id, title: product.title, supplier_price: product.price, image_url: product.image, source: "aliexpress", source_url: product.url, status: "imported" }).select().single();
    if (error) throw error;
    res.json({ success: true, product: data });
  } catch (err) { res.status(500).json({ error: "Import failed: " + err.message }); }
});
module.exports = router;
