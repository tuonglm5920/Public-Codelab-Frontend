/**
 * Calculates the inner height of an HTMLElement by subtracting its padding from its clientHeight.
 * @param {HTMLElement} [el] - The HTMLElement for which to calculate the inner height.
 * @returns {number} The inner height of the element. If no element is provided or if the provided element is falsy, returns 0.
 */
export const getInnerHeight = (el: HTMLElement | undefined | null): number => {
  if (!el) {
    return 0;
  }
  const { clientHeight } = el;
  const { paddingTop, paddingBottom } = getComputedStyle(el);
  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
};
