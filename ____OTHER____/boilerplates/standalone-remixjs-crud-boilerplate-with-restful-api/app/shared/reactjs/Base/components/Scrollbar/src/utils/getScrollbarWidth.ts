import { isBrowser } from '~/shared/utilities';

/**
 * Retrieves the width of the scrollbar in pixels using a DOM element.
 * @returns {number} The width of the scrollbar in pixels.
 */
const getScrollbarWidthFromDom = (): number => {
  if (!isBrowser()) {
    return 0;
  }

  const div = document.createElement('div');

  div.style.cssText = `
    width: 100px;
    height: 100px;
    position: absolute;
    top: -9999px;
    overflow: scroll;
    ms-overflow-style: scrollbar;
  `;
  document.body.appendChild(div);
  const result = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return result;
};

/**
 * Retrieves the pixel ratio of the screen.
 * @returns {number} The pixel ratio of the screen.
 */
const getPxRatio = (): number => {
  if (!isBrowser()) {
    return 1;
  }
  return window.screen.availWidth / document.documentElement.clientWidth;
};

let scrollbarWidth: number | undefined = undefined;
let pxRatio: number = getPxRatio();

/**
 * Retrieves the width of the scrollbar.
 * @returns {number} The width of the scrollbar.
 */
export const getScrollbarWidth = (): number => {
  const newPxRatio = getPxRatio();

  if (pxRatio !== newPxRatio) {
    scrollbarWidth = getScrollbarWidthFromDom();
    pxRatio = newPxRatio;
  }

  if (typeof scrollbarWidth === 'number') {
    return scrollbarWidth;
  }

  if (isBrowser()) {
    scrollbarWidth = getScrollbarWidthFromDom();
  } else {
    scrollbarWidth = 0;
  }

  return scrollbarWidth || 0;
};
