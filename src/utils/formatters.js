import { USD_TO_INR } from "./constants";

/**
 * Formats a number into Indian Rupee currency string representation (e.g., ₹1,299).
 * @param {number} amount
 * @returns {string}
 */
export function formatINR(amount) {
  return `₹${Math.round(amount || 0).toLocaleString("en-IN")}`;
}

/**
 * Converts USD price into rounded INR price.
 * @param {number} usdPrice
 * @returns {number}
 */
export function convertToINR(usdPrice) {
  return Math.round((usdPrice || 0) * USD_TO_INR);
}

/**
 * Calculates the original price before discount.
 * @param {number} inrPrice
 * @param {number} discountPercentage
 * @returns {number|null}
 */
export function calculateOriginalPrice(inrPrice, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return null;
  return Math.round(inrPrice / (1 - discountPercentage / 100));
}
