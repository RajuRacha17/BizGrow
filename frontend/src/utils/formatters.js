/**
 * Format numbers using Indian Rupee (₹) and Indian numbering system (en-IN)
 * e.g., 1740934 -> ₹17,40,934
 * e.g., 100000 -> ₹1,00,000
 * e.g., 1000 -> ₹1,000
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Math.round(Number(amount));
  return '₹' + num.toLocaleString('en-IN');
}
