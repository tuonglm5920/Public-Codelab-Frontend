/**
 * Ensures that a given number is not negative.
 * If the provided value is less than zero, it returns zero.
 * Otherwise, it returns the value itself.
 *
 * @param {number} value - The number to be evaluated.
 * @returns {number} The original number if it's non-negative, or zero if it's negative.
 */
export const safe = (value: number): number => {
  return Math.max(value, 0);
};
