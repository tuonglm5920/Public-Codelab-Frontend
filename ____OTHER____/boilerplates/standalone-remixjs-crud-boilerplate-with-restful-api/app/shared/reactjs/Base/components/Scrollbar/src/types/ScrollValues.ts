/**
 * Interface representing scroll values of an element.
 * @interface
 */
export interface ScrollValues {
  /** The horizontal scroll position. */
  left: number;
  /** The vertical scroll position. */
  top: number;
  /** The number of pixels that an element's content is scrolled from the left. */
  scrollLeft: number;
  /** The number of pixels that an element's content is scrolled from the top. */
  scrollTop: number;
  /** The width of an element's content, including content not visible on the screen due to overflow. */
  scrollWidth: number;
  /** The height of an element's content, including content not visible on the screen due to overflow. */
  scrollHeight: number;
  /** The width of the element's content area, including padding but not including borders, margins, or vertical scrollbars. */
  clientWidth: number;
  /** The height of the element's content area, including padding but not including borders, margins, or horizontal scrollbars. */
  clientHeight: number;
}
