/**
 * Normalizes padding input for UI elements.
 *
 * This function takes either a single number or a tuple of two numbers as input.
 * If a single number is provided, it is interpreted as uniform padding for both
 * vertical and horizontal dimensions. If a tuple is provided, the first element
 * represents vertical padding and the second element represents horizontal padding.
 *
 * @param {number | [number, number]} padding - The padding value(s). It can be a single
 * number for uniform padding or an array of two numbers for vertical and horizontal padding.
 * @returns {[number, number]} A tuple where the first element is the vertical padding
 * and the second element is the horizontal padding.
 *
 * @example
 * // Uniform padding
 * getPadding(10); // returns [10, 10]
 *
 * @example
 * // Different vertical and horizontal padding
 * getPadding([10, 20]); // returns [10, 20]
 */
export const getPadding = (padding: number | [number, number]): [number, number] => {
  if (Array.isArray(padding)) {
    return padding;
  }
  return [padding, padding];
};
