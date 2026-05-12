// =============================================
// DANDROP — Price & Stock Monitoring Job
// File: backend/jobs/monitorPrices.js
// Runs every 6 hours automatically
// =============================================

const supabase = require('../config/supabase');
const cj = require('../services/cjdropshipping');
const shopify = require('../services/shopify');
const { recalculateAfterCostChange, shouldUpdatePrice } = require('../services/priceOptimizer');

// ─── MAIN MONITOR JOB ─────────────────────────
const runPriceAndStockMonitor = async () => {
  console.log('🔍 Starting price & stock monitoring job...', new Date().toISOString());

  try {
    // Get all imported products from DB
    const { data: products, error } = await supabase
      .from('imported_products')
      .select('*, stores(user_id, shopify_domain, shopify_access_token)')
      .eq('is_active', true);

    if (error) throw error;
    if (!products?.length) {
      console.log('No products to monitor.');
      return;
    }

    console.log(`Monitoring ${products.length} products...`);

    for (const product of products) {
      try {
        await checkProduct(product);
        // Small delay to avoid rate limiting
        await sleep(500);
      } catch (err) {
        console.error(`Failed to check product ${product.cj_product_id}:`, err.message);
      }
    }

    console.log('✅ Price & stock monitoring complete.');
  } catch (err) {
    console.error('Monitor job failed:', err.message);
  }
};

// ─── CHECK SINGLE PRODUCT ─────────────────────
const checkProduct = async (product) => {
  // Fetch latest data from CJ
  const cjData = await cj.getProductDetails(product.cj_product_id);
  if (!cjData) return;

  const newCost = parseFloat(cjData.sellPrice);
  const oldCost = parseFloat(product.cj_cost);
  const newStock = cjData.variants?.[0]?.inventoryNum || 0;
  const oldStock = product.last_known_stock;

  const updates = {};
  const alerts = [];

  // ─ Price changed? ─
  if (shouldUpdatePrice(oldCost, newCost)) {
    const priceChange = recalculateAfterCostChange({
      oldCost,
      newCost,
      currentStorePrice: product.shopify_price,
      userSettings: product.pricing_settings || {},
    });

    console.log(`💰 Price change detected for ${product.product_title}: ${priceChange.costChange}`);

    // Auto update Shopify price if user has auto-update enabled
    if (product.auto_update_price && product.shopify_product_id) {
      try {
        await shopify.updateProductPrice(
          product.stores.user_id,
          product.shopify_product_id,
          priceChange.newRecommendedPrice
        );
        updates.shopify_price = priceChange.newRecommendedPrice;
        console.log(`✅ Updated Shopify price to $${priceChange.newRecommendedPrice}`);
      } catch (err) {
        console.error('Failed to update Shopify price:', err.message);
      }
    }

    updates.cj_cost = newCost;
    updates.last_price_check = new Date().toISOString();

    // Create alert for user
    alerts.push({
      user_id: product.stores.user_id,
      product_id: product.id,
      type: 'price_change',
      message: `Supplier price for "${product.product_title}" changed by ${priceChange.costChange}. Store price ${product.auto_update_price ? 'auto-updated' : 'needs update'}.`,
      data: priceChange,
    });
  }

  // ─ Stock changed? ─
  if (newStock !== oldStock) {
    updates.last_known_stock = newStock;

    if (newStock === 0 && oldStock > 0) {
      console.log(`⚠️ Out of stock: ${product.product_title}`);

      // Auto pause product in Shopify if out of stock
      if (product.auto_pause_out_of_stock && product.shopify_product_id) {
        await shopify.updateInventory(
          product.stores.user_id,
          product.shopify_variant_id,
          0
        );
      }

      alerts.push({
        user_id: product.stores.user_id,
        product_id: product.id,
        type: 'out_of_stock',
        message: `"${product.product_title}" is now OUT OF STOCK at supplier. ${product.auto_pause_out_of_stock ? 'Automatically paused in your store.' : 'Please update your store.'}`,
        data: { oldStock, newStock },
      });

    } else if (newStock > 0 && oldStock === 0) {
      console.log(`✅ Back in stock: ${product.product_title}`);

      alerts.push({
        user_id: product.stores.user_id,
        product_id: product.id,
        type: 'back_in_stock',
        message: `"${product.product_title}" is back in stock! (${newStock} units available)`,
        data: { newStock },
      });
    }
  }

  // ─ Save updates to DB ─
  if (Object.keys(updates).length > 0) {
    await supabase
      .from('imported_products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', product.id);
  }

  // ─ Save alerts ─
  if (alerts.length > 0) {
    await supabase.from('alerts').insert(alerts);
  }
};

// Helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── SCHEDULER ────────────────────────────────
// Call this from server.js to start monitoring
const startMonitoringScheduler = () => {
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  console.log('⏰ Price & stock monitoring scheduler started (every 6 hours)');

  // Run immediately on startup
  runPriceAndStockMonitor();

  // Then every 6 hours
  setInterval(runPriceAndStockMonitor, SIX_HOURS);
};

module.exports = { startMonitoringScheduler, runPriceAndStockMonitor };
