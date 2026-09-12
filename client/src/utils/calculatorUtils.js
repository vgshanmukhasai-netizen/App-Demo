/**
 * Calculate crop profit estimate
 * @param {object} inputs
 * @returns {object} Calculation results
 */
export const calculateProfit = ({
  landArea = 1,
  expectedYieldPerAcre = 0,
  sellingPricePerKg = 0,
  seedCost = 0,
  fertilizerCost = 0,
  labourCost = 0,
  irrigationCost = 0,
  pesticideCost = 0,
  otherCosts = 0,
}) => {
  const totalYield = expectedYieldPerAcre * landArea;
  const expectedRevenue = totalYield * sellingPricePerKg;

  const totalCost =
    Number(seedCost) +
    Number(fertilizerCost) +
    Number(labourCost) +
    Number(irrigationCost) +
    Number(pesticideCost) +
    Number(otherCosts);

  const estimatedProfit = expectedRevenue - totalCost;
  const profitPerAcre = landArea > 0 ? estimatedProfit / landArea : 0;
  const profitMargin = expectedRevenue > 0 ? (estimatedProfit / expectedRevenue) * 100 : 0;

  return {
    totalYield: Math.round(totalYield),
    expectedRevenue: Math.round(expectedRevenue),
    totalCost: Math.round(totalCost),
    estimatedProfit: Math.round(estimatedProfit),
    profitPerAcre: Math.round(profitPerAcre),
    profitMargin: Math.round(profitMargin),
    isProfitable: estimatedProfit >= 0,
  };
};

/**
 * Format Indian currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

/**
 * Format number with Indian comma notation (1,00,000)
 */
export const formatIndianNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};
