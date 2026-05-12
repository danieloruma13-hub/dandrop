const googleTrends = require('google-trends-api');

// Check if a keyword is trending
const checkTrend = async (keyword) => {
  try {
    const results = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    });
    const data = JSON.parse(results);
    const points = data.default.timelineData;
    if (!points || points.length === 0) return { keyword, score: 0, trend: 'unknown' };
    const values = points.map(p => p.value[0]);
    const latest = values.slice(-7);
    const older = values.slice(-30, -7);
    const latestAvg = latest.reduce((a, b) => a + b, 0) / latest.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    const score = Math.round(latestAvg);
    let trend = 'stable';
    if (latestAvg > olderAvg * 1.2) trend = 'rising';
    if (latestAvg < olderAvg * 0.8) trend = 'falling';
    return { keyword, score, trend, latestAvg, olderAvg };
  } catch (err) {
    return { keyword, score: 0, trend: 'unknown', error: err.message };
  }
};

// Score a product based on trends
const scoreProduct = async (productName, supplierCost, shippingCost = 0) => {
  try {
    const trend = await checkTrend(productName);
    const totalCost = parseFloat(supplierCost) + parseFloat(shippingCost);
    const sellingPrice = totalCost * 2.5;
    const profit = sellingPrice - totalCost;
    const margin = (profit / sellingPrice) * 100;
    let score = 0;
    // Trend score (40 points max)
    if (trend.trend === 'rising') score += 40;
    else if (trend.trend === 'stable') score += 20;
    else score += 5;
    // Google interest score (30 points max)
    score += Math.min(30, Math.round(trend.score * 0.3));
    // Margin score (30 points max)
    if (margin >= 50) score += 30;
    else if (margin >= 40) score += 25;
    else if (margin >= 30) score += 15;
    else score += 5;
    return {
      productName,
      trendData: trend,
      margin: margin.toFixed(1),
      recommendedPrice: sellingPrice.toFixed(2),
      profit: profit.toFixed(2),
      winningScore: score,
      isWinner: score >= 60,
      verdict: score >= 70 ? 'Hot Product 🔥' : score >= 60 ? 'Good Product ✅' : score >= 40 ? 'Average ⚠️' : 'Avoid ❌'
    };
  } catch (err) {
    return { productName, error: err.message, winningScore: 0, isWinner: false };
  }
};

// Check multiple products at once
const scoreMultipleProducts = async (products) => {
  const results = [];
  for (const product of products) {
    const scored = await scoreProduct(product.name, product.cost, product.shippingCost || 0);
    results.push({ ...product, ...scored });
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results.sort((a, b) => b.winningScore - a.winningScore);
};

module.exports = { checkTrend, scoreProduct, scoreMultipleProducts };
