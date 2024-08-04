/**
 * Calculates the inner width of an HTMLDivElement by subtracting its padding from its clientWidth.
 * @param {HTMLDivElement} [el] - The HTMLDivElement for which to calculate the inner width.
 * @returns {number} The inner width of the element. If no element is provided or if the provided element is falsy, returns 0.
 */
export const getInnerWidth = (el: HTMLDivElement | undefined | null): number => {
  if (!el) {
    return 0;
  }
  const { clientWidth } = el;
  const { paddingLeft, paddingRight } = getComputedStyle(el);
  return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
};
