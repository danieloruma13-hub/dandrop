const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });

    const response = await fetch(
      `https://${RAPIDAPI_HOST}/searchProducts.php?keywords=${encodeURIComponent(q)}&page=1&pageSize=20&lang=en_US&country=US&currency=USD`,
      {
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data || data.status?.code !== 200) {
      return res.status(500).json({ error: "AliExpress search failed" });
    }

    const products = (data.data?.products || []).map(p => ({
      id: p.productId || p.itemId,
      title: p.title || p.productTitle,
      price: p.salePrice || p.price,
      originalPrice: p.originalPrice,
      image: p.productMainImageUrl || p.imageUrl,
      rating: p.evaluateRate || p.starRating,
      orders: p.totalOrders || p.orders,
      shipping: p.logisticsDesc || "Free Shipping",
      url: `https://www.aliexpress.com/item/${p.productId || p.itemId}.html`,
      raw: p,
    }));

    res.json({ products, total: products.length });
  } catch (err) {
    console.error("AliExpress search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.post("/import", auth, async (req, res) => {
  try {
    const { product } = req.body;
    const userId = req.user.id;

    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data, error } = await supabase
      .from("imported_products")
      .insert({
        user_id: userId,
        product_id: product.id,
        title: product.title,
        supplier_price: product.price,
        image_url: product.image,
        source: "aliexpress",
        source_url: product.url,
        status: "imported",
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, product: data });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Import failed" });
  }
});

module.exports = router;
