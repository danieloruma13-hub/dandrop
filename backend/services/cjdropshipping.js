// =============================================
// DANDROP — CJDropshipping Service
// File: backend/services/cjdropshipping.js
// =============================================

const axios = require('axios');

const CJ_API_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
let accessToken = null;
let tokenExpiry = null;

// ─── AUTH ────────────────────────────────────
const getAccessToken = async () => {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  const res = await axios.post(`${CJ_API_URL}/authentication/getAccessToken`, {
    email: process.env.CJ_EMAIL,
    password: process.env.CJ_PASSWORD,
  });

  if (res.data.result) {
    accessToken = res.data.data.accessToken;
    tokenExpiry = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
    return accessToken;
  }
  throw new Error('CJ Auth failed: ' + res.data.message);
};

const cjHeaders = async () => ({
  'CJ-Access-Token': await getAccessToken(),
  'Content-Type': 'application/json',
});

// ─── PRODUCTS ────────────────────────────────

// Search products by keyword
const searchProducts = async ({ keyword, page = 1, limit = 20, categoryId }) => {
  const headers = await cjHeaders();
  const res = await axios.get(`${CJ_API_URL}/product/list`, {
    headers,
    params: {
      productNameEn: keyword,
      pageNum: page,
      pageSize: limit,
      categoryId: categoryId || undefined,
    },
  });
  return res.data.data;
};

// Get product details by CJ product ID
const getProductDetails = async (pid) => {
  const headers = await cjHeaders();
  const res = await axios.get(`${CJ_API_URL}/product/query`, {
    headers,
    params: { pid },
  });
  return res.data.data;
};

// Get trending/featured products
const getTrendingProducts = async (page = 1, limit = 20) => {
  const headers = await cjHeaders();
  const res = await axios.get(`${CJ_API_URL}/product/list`, {
    headers,
    params: {
      pageNum: page,
      pageSize: limit,
      isHot: true,
    },
  });
  return res.data.data;
};

// Get product categories
const getCategories = async () => {
  const headers = await cjHeaders();
  const res = await axios.get(`${CJ_API_URL}/product/getCategory`, { headers });
  return res.data.data;
};

// ─── STOCK & PRICE MONITORING ─────────────────

// Get current stock and price for a product variant
const getProductStock = async (vid) => {
  const headers = await cjHeaders();
  const res = await axios.get(`${CJ_API_URL}/product/stock/queryByVid`, {
    headers,
    params: { vid },
  });
  return res.data.data;
};

// Bulk check prices for multiple products
const bulkCheckPrices = async (pids) => {
  const headers = await cjHeaders();
  const results = [];
  // CJ doesn't have bulk price endpoint — batch in chunks of 10
  const chunks = [];
  for (let i = 0; i < pids.length; i += 10) {
    chunks.push(pids.slice(i, i + 10));
  }
  for (const chunk of chunks) {
    const promises = chunk.map(pid => getProductDetails(pid));
    const resolved = await Promise.allSettled(promises);
    resolved.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        results.push({ pid: chunk[i], data: r.value });
      }
    });
  }
  return results;
};

// ─── SHIPPING ─────────────────────────────────

// Get shipping options for a product
const getShippingOptions = async ({ pid, country = 'US', quantity = 1 }) => {
  const headers = await cjHeaders();
  const res = await axios.post(`${CJ_API_URL}/logistic/freightCalculate`, {
    pid,
    quantity,
    countryCode: country,
  }, { headers });
  return res.data.data;
};

// ─── ORDERS ───────────────────────────────────

// Place an order on CJDropshipping
const createOrder = async (orderData) => {
  const headers = await cjHeaders();
  const res = await axios.post(`${CJ_API_URL}/shopping/order/createOrder`, {
    orderNumber: orderData.shopifyOrderId,
    shippingZip: orderData.zip,
    shippingCountryCode: orderData.countryCode,
    shippingCountry: orderData.country,
    shippingProvince: orderData.province,
    shippingCity: orderData.city,
    shippingAddress: orderData.address,
    shippingCustomerName: orderData.customerName,
    shippingPhone: orderData.phone,
    products: orderData.products.map(p => ({
      vid: p.variantId,
      quantity: p.quantity,
    })),
  }, { headers });
  return res.data.data;
};

// Get order tracking info
const getOrderTracking = async (orderId) => {
  const headers = await cjHeaders();
  const res = await axios.get(`${CJ_API_URL}/shopping/order/getOrderDetail`, {
    headers,
    params: { orderId },
  });
  return res.data.data;
};

module.exports = {
  searchProducts,
  getProductDetails,
  getTrendingProducts,
  getCategories,
  getProductStock,
  bulkCheckPrices,
  getShippingOptions,
  createOrder,
  getOrderTracking,
};
