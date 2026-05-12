// =============================================
// DANDROP — Price Optimization Engine
// File: backend/services/priceOptimizer.js
// =============================================

// ─── PRICING STRATEGIES ───────────────────────

const STRATEGIES = {
  // Fixed multiplier on supplier cost
  MULTIPLIER: 'multiplier',
  // Cost + fixed profit margin
  MARGIN: 'margin',
  // Psychological pricing ($X.99)
  PSYCHOLOGICAL: 'psychological',
  // Competitor based pricing
  COMPETITIVE: 'competitive',
};

// Round to psychological price ($X.99 or $X.95)
const toPsychological = (price) => {
  const floor = Math.floor(price);
  if (price < 10) return parseFloat((floor + 0.99).toFixed(2));
  if (price < 50) return parseFloat((floor + 0.95).toFixed(2));
  return parseFloat((floor - 0.01).toFixed(2));
};

// ─── MAIN PRICE CALCULATOR ────────────────────

const calculateOptimalPrice = ({
  supplierCost,       // Cost from CJ in USD
  shippingCost = 0,   // Shipping cost
  strategy = STRATEGIES.MULTIPLIER,
  multiplier = 2.5,   // Default 2.5x markup
  targetMargin = 40,  // Target profit margin %
  usePsychological = true,
  competitorPrice = null,
}) => {
  const totalCost = parseFloat(supplierCost) + parseFloat(shippingCost);
  let price;

  switch (strategy) {
    case STRATEGIES.MULTIPLIER:
      price = totalCost * multiplier;
      break;

    case STRATEGIES.MARGIN:
      // price = cost / (1 - margin%)
      price = totalCost / (1 - targetMargin / 100);
      break;

    case STRATEGIES.COMPETITIVE:
      if (competitorPrice) {
        // 5% below competitor but still above minimum margin
        const competitive = competitorPrice * 0.95;
        const minimum = totalCost * 1.3; // Never go below 30% margin
        price = Math.max(competitive, minimum);
      } else {
        price = totalCost * multiplier;
      }
      break;

    default:
      price = totalCost * multiplier;
  }

  if (usePsychological) {
    price = toPsychological(price);
  } else {
    price = parseFloat(price.toFixed(2));
  }

  const profit = price - totalCost;
  const margin = ((profit / price) * 100).toFixed(1);

  return {
    supplierCost: totalCost.toFixed(2),
    recommendedPrice: price,
    profit: profit.toFixed(2),
    marginPercent: margin,
    strategy,
  };
};

// ─── BULK PRICE OPTIMIZATION ──────────────────

const optimizePriceList = (products, userSettings = {}) => {
  return products.map(product => {
    const result = calculateOptimalPrice({
      supplierCost: product.cost,
      shippingCost: product.shippingCost || 0,
      strategy: userSettings.strategy || STRATEGIES.MULTIPLIER,
      multiplier: userSettings.multiplier || 2.5,
      targetMargin: userSettings.targetMargin || 40,
      usePsychological: userSettings.usePsychological !== false,
    });

    return {
      ...product,
      pricing: result,
    };
  });
};

// ─── PRICE CHANGE DETECTOR ────────────────────

// Checks if price change is significant enough to update store
const shouldUpdatePrice = (oldCost, newCost, threshold = 5) => {
  const change = Math.abs(newCost - oldCost);
  const percentChange = (change / oldCost) * 100;
  return percentChange >= threshold; // Update if cost changed by 5%+
};

// Calculate new store price based on supplier cost change
const recalculateAfterCostChange = ({
  oldCost,
  newCost,
  currentStorePrice,
  userSettings = {},
}) => {
  const multiplier = userSettings.multiplier || 2.5;
  const strategy = userSettings.strategy || STRATEGIES.MULTIPLIER;

  const newOptimal = calculateOptimalPrice({
    supplierCost: newCost,
    strategy,
    multiplier,
    targetMargin: userSettings.targetMargin || 40,
    usePsychological: userSettings.usePsychological !== false,
  });

  const costIncreased = newCost > oldCost;
  const costChange = ((newCost - oldCost) / oldCost * 100).toFixed(1);

  return {
    oldCost,
    newCost,
    costChange: `${costIncreased ? '+' : ''}${costChange}%`,
    currentStorePrice,
    newRecommendedPrice: newOptimal.recommendedPrice,
    priceDiff: (newOptimal.recommendedPrice - currentStorePrice).toFixed(2),
    shouldUpdate: shouldUpdatePrice(oldCost, newCost),
    newMargin: newOptimal.marginPercent,
  };
};

// ─── PRICING RULES ENGINE ─────────────────────

// Apply user defined rules to price
const applyPricingRules = (basePrice, rules = []) => {
  let price = basePrice;

  for (const rule of rules) {
    switch (rule.type) {
      case 'min_price':
        price = Math.max(price, rule.value);
        break;
      case 'max_price':
        price = Math.min(price, rule.value);
        break;
      case 'min_profit':
        // Ensure minimum profit amount
        break;
      case 'round_up':
        price = Math.ceil(price);
        break;
    }
  }

  return parseFloat(price.toFixed(2));
};

module.exports = {
  STRATEGIES,
  calculateOptimalPrice,
  optimizePriceList,
  shouldUpdatePrice,
  recalculateAfterCostChange,
  applyPricingRules,
  toPsychological,
};
