// =============================================
// DANDROP — Shopify Service
// File: backend/services/shopify.js
// =============================================

const axios = require('axios');
const supabase = require('../config/supabase');

// Get Shopify store credentials from DB
const getStoreCredentials = async (userId) => {
  const { data, error } = await supabase
    .from('stores')
    .select('shopify_domain, shopify_access_token')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error || !data) throw new Error('No Shopify store connected');
  return data;
};

// Build Shopify API base URL
const shopifyApi = async (userId) => {
  const { shopify_domain, shopify_access_token } = await getStoreCredentials(userId);
  const base = `https://${shopify_domain}/admin/api/2024-01`;
  const headers = {
    'X-Shopify-Access-Token': shopify_access_token,
    'Content-Type': 'application/json',
  };
  return { base, headers };
};

// ─── PRODUCTS ─────────────────────────────────

// Push a CJ product to Shopify store
const importProductToShopify = async (userId, cjProduct, priceMultiplier = 2.5) => {
  const { base, headers } = await shopifyApi(userId);

  // Build Shopify product from CJ data
  const shopifyProduct = {
    product: {
      title: cjProduct.productNameEn,
      body_html: cjProduct.description || cjProduct.productNameEn,
      vendor: 'Dandrop',
      product_type: cjProduct.categoryName || 'General',
      images: cjProduct.productImageSet?.map(img => ({ src: img })) || [],
      variants: cjProduct.variants?.map(v => ({
        option1: v.variantNameEn,
        price: (parseFloat(v.variantSellPrice) * priceMultiplier).toFixed(2),
        sku: v.vid,
        inventory_management: 'shopify',
        inventory_quantity: v.inventoryNum || 100,
        weight: parseFloat(v.variantWeight) || 0.5,
        weight_unit: 'kg',
      })) || [{
        price: (parseFloat(cjProduct.sellPrice) * priceMultiplier).toFixed(2),
        sku: cjProduct.pid,
        inventory_management: 'shopify',
        inventory_quantity: 100,
      }],
    },
  };

  const res = await axios.post(`${base}/products.json`, shopifyProduct, { headers });
  return res.data.product;
};

// Update product price in Shopify
const updateProductPrice = async (userId, shopifyProductId, newPrice) => {
  const { base, headers } = await shopifyApi(userId);
  const res = await axios.get(`${base}/products/${shopifyProductId}/variants.json`, { headers });
  const variants = res.data.variants;

  for (const variant of variants) {
    await axios.put(
      `${base}/variants/${variant.id}.json`,
      { variant: { id: variant.id, price: newPrice.toFixed(2) } },
      { headers }
    );
  }
  return true;
};

// Update inventory in Shopify
const updateInventory = async (userId, shopifyVariantId, quantity) => {
  const { base, headers } = await shopifyApi(userId);

  // Get inventory item ID
  const varRes = await axios.get(`${base}/variants/${shopifyVariantId}.json`, { headers });
  const inventoryItemId = varRes.data.variant.inventory_item_id;

  // Get location ID
  const locRes = await axios.get(`${base}/locations.json`, { headers });
  const locationId = locRes.data.locations[0].id;

  // Set inventory level
  await axios.post(`${base}/inventory_levels/set.json`, {
    location_id: locationId,
    inventory_item_id: inventoryItemId,
    available: quantity,
  }, { headers });

  return true;
};

// Get all products in Shopify store
const getShopifyProducts = async (userId) => {
  const { base, headers } = await shopifyApi(userId);
  const res = await axios.get(`${base}/products.json?limit=250`, { headers });
  return res.data.products;
};

// ─── ORDERS ───────────────────────────────────

// Get unfulfilled orders from Shopify
const getUnfulfilledOrders = async (userId) => {
  const { base, headers } = await shopifyApi(userId);
  const res = await axios.get(
    `${base}/orders.json?fulfillment_status=unfulfilled&status=open&limit=50`,
    { headers }
  );
  return res.data.orders;
};

// Mark order as fulfilled in Shopify with tracking
const fulfillOrder = async (userId, shopifyOrderId, trackingNumber, trackingCompany) => {
  const { base, headers } = await shopifyApi(userId);

  // Get fulfillment order ID
  const foRes = await axios.get(
    `${base}/orders/${shopifyOrderId}/fulfillment_orders.json`,
    { headers }
  );
  const fulfillmentOrderId = foRes.data.fulfillment_orders[0]?.id;
  if (!fulfillmentOrderId) throw new Error('No fulfillment order found');

  const res = await axios.post(`${base}/fulfillments.json`, {
    fulfillment: {
      line_items_by_fulfillment_order: [{ fulfillment_order_id: fulfillmentOrderId }],
      tracking_info: {
        number: trackingNumber,
        company: trackingCompany || 'CJDropshipping',
        url: `https://t.17track.net/en#nums=${trackingNumber}`,
      },
      notify_customer: true,
    },
  }, { headers });

  return res.data.fulfillment;
};

// ─── STORE INFO ───────────────────────────────

// Get basic store info and verify connection
const verifyStoreConnection = async (domain, accessToken) => {
  const res = await axios.get(
    `https://${domain}/admin/api/2024-01/shop.json`,
    { headers: { 'X-Shopify-Access-Token': accessToken } }
  );
  return res.data.shop;
};

module.exports = {
  importProductToShopify,
  updateProductPrice,
  updateInventory,
  getShopifyProducts,
  getUnfulfilledOrders,
  fulfillOrder,
  verifyStoreConnection,
};
