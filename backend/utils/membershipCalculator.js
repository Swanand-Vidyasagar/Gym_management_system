const MEMBERSHIP_DURATION_DAYS = {
  'Basic': 30,
  'Premium Plus': 90,
  'Elite Pro': 180,
  'Annual Unlimited': 365
};

const MEMBERSHIP_PRICES = {
  'Basic': 999.00,
  'Premium Plus': 2499.00,
  'Elite Pro': 4999.00,
  'Annual Unlimited': 8999.00
};

/**
 * Calculate end date based on start date and membership type
 */
const calculateEndDate = (startDate, membershipType) => {
  const durationDays = MEMBERSHIP_DURATION_DAYS[membershipType] || 30;
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  return endDate;
};

/**
 * Get price for a membership type
 */
const getMembershipPrice = (membershipType) => {
  return MEMBERSHIP_PRICES[membershipType] || 0;
};

/**
 * Check if membership is expired
 */
const isMembershipExpired = (endDate) => {
  return new Date(endDate) < new Date();
};

module.exports = {
  calculateEndDate,
  getMembershipPrice,
  isMembershipExpired,
  MEMBERSHIP_DURATION_DAYS,
  MEMBERSHIP_PRICES
};

