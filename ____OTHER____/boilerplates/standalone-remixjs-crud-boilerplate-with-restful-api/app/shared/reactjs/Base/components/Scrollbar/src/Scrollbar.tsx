import css from 'dom-css';
import {
  CSSProperties,
  Component,
  ReactElement,
  ReactNode,
  RefObject,
  cloneElement,
  createElement,
  createRef,
} from 'react';
import { CustomRenderer } from './types/CustomRenderer';
import { Direction } from './types/Direction';
import { RenderFrameCallback } from './types/RenderFrameCallback';
import { ScrollValues } from './types/ScrollValues';
import { StyleClasses } from './types/StyleClasses';
import { StyleKeys } from './types/StyleKeys';
import { createStyles } from './utils/createStyles';
import { getFinalClasses } from './utils/getFinalClasses';
import { getInnerHeight } from './utils/getInnerHeight';
import { getInnerWidth } from './utils/getInnerWidth';
import { getScrollbarWidth } from './utils/getScrollbarWidth';
import { GetOptional } from '~/shared/typescript-utilities';
import { caf, createResizeObserver, raf } from '~/shared/utilities';

interface State {
  /** Indicates whether the component has mounted universally. */
  didMountUniversal: boolean;
  /** The width of the scrollbar. */
  scrollbarWidth: number;
}

export interface Props {
  /** The content of the component. */
  children: ReactElement;
  /** Whether the scrollbar should auto hide. */
  autoHide?: boolean;
  /** Enable auto-hide mode. When 'true' tracks will hide automatically and are only visible while scrolling. */
  autoHideDuration?: number;
  /** Hide delay in ms. */
  autoHideTimeout?: number;
  /** Extra custom className/s to any of the subcomponents */
  classes?: Partial<StyleClasses>;
  /** Callback function invoked on scroll event. */
  onScroll?: (event: Event) => void;
  /** Callback function invoked on scroll frame. */
  onScrollFrame?: (values: ScrollValues) => void;
  /** Callback function invoked when scrolling starts. */
  onScrollStart?: () => void;
  /** Callback function invoked when scrolling stops. */
  onScrollStop?: () => void;
  /** Callback function invoked on component update. */
  onUpdate?: (values: ScrollValues) => void;
  /** Custom renderer for horizontal thumb. */
  renderThumbHorizontal?: CustomRenderer;
  /** Custom renderer for vertical thumb. */
  renderThumbVertical?: CustomRenderer;
  /** Custom renderer for horizontal track. */
  renderTrackHorizontal?: CustomRenderer;
  /** Custom renderer for vertical track. */
  renderTrackVertical?: CustomRenderer;
  /** Enable universal rendering (SSR). */
  universal?: boolean;
  /** RTL support */
  direction?: Direction;
}

/**
 * Scrollbar Component provides custom scrollbar functionality for scrolling content.
 * It renders both horizontal and vertical scrollbars along with their respective thumb elements.
 * The appearance and behavior of the scrollbar can be customized using various props.
 * @example
 * <Scrollbar
 *   autoHide
 *   renderThumbVertical={({ style, ...props }) => (
 *     <div {...props} style={{ ...style, backgroundColor: 'rgba(0,0,0,.5)' }} />
 *   )}
 * >
 *   Content goes here...
 * </Scrollbar>
 */
export class Scrollbar extends Component<Props, State> {
  /** Interval for detecting scrolling. */
  private _detectScrollingInterval: NodeJS.Timeout | number | undefined;
  /** Indicates whether dragging is in progress. */
  private _dragging: boolean = false;
  /** Timeout for hiding tracks. */
  private _hideTracksTimeout: NodeJS.Timeout | number | undefined;
  /** The last horizontal scroll position of the content. */
  private _lastContentScrollLeft?: number;
  /** The last vertical scroll position of the content. */
  private _lastContentScrollTop?: number;
  /** Previous page X coordinate. */
  private _prevPageX?: number;
  /** Previous page Y coordinate. */
  private _prevPageY?: number;
  /** Requested frame for animation. */
  private _requestFrame?: number;
  /** Indicates whether scrolling is in progress. */
  private _scrolling: boolean = false;
  /** Styles for the scrollbar. */
  private _styles: Record<StyleKeys, CSSProperties>;
  /** Indicates whether the mouse is over the horizontal track. */
  private _trackMouseOver: boolean = false;
  /** The horizontal scroll position of the content. */
  private _contentScrollLeft?: number;
  /** The vertical scroll position of the content. */
  private _contentScrollTop?: number;

  /** Reference to the container element. */
  private _containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Reference to the content element. */
  private _contentRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Reference to the horizontal thumb element. */
  private _thumbHorizontal: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Reference to the vertical thumb element. */
  private _thumbVertical: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Reference to the horizontal track element. */
  private _trackHorizontal: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Reference to the vertical track element. */
  private _trackVertical: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Content need scroll warpper element ==> Used to listener size of content need scroll change to recalculate scrollbar */
  private _trackingSizeRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  /** Resize observer to listen size of container */
  private _resizeObserver = createResizeObserver();

  public static defaultProps: Required<GetOptional<Props>> = {
    autoHide: false,
    autoHideDuration: 200,
    autoHideTimeout: 1000,
    renderThumbHorizontal: props => <div {...props} />,
    renderThumbVertical: props => <div {...props} />,
    renderTrackHorizontal: props => <div {...props} />,
    renderTrackVertical: props => <div {...props} />,
    universal: true,
    classes: {},
    onScroll: () => undefined,
    onScrollFrame: () => undefined,
    onScrollStart: () => undefined,
    onScrollStop: () => undefined,
    onUpdate: () => undefined,
    direction: 'ltr',
  };

  constructor(props: Props) {
    super(props);

    this._styles = createStyles(this.props.direction ?? Scrollbar.defaultProps.direction);

    this.state = {
      didMountUniversal: false,
      scrollbarWidth: getScrollbarWidth(),
    };
  }

  public override componentDidMount = (): void => {
    this._addListeners();
    this._renderFrame();
    this._componentDidMountUniversal();
  };

  public override componentDidUpdate = (): void => {
    this._renderFrame();
  };

  public override componentWillUnmount = (): void => {
    this._removeListeners();
    this._requestFrame && caf(this._requestFrame);
    clearTimeout(this._hideTracksTimeout);
    clearInterval(this._detectScrollingInterval);
  };

  private _componentDidMountUniversal = (): void => {
    const { universal } = this.props;
    if (!universal) {
      return;
    }
    this.setState({ didMountUniversal: true });
    return;
  };

  /**
   * Retrieves scroll values of the content element.
   * @private
   * @returns {ScrollValues} The scroll values of the content.
   */
  private _getScrollValues = (): ScrollValues => {
    const {
      scrollLeft = 0,
      scrollTop = 0,
      scrollWidth = 0,
      scrollHeight = 0,
      clientWidth = 0,
      clientHeight = 0,
    } = this._contentRef.current || {};

    return {
      left: scrollLeft / (scrollWidth - clientWidth) || 0,
      top: scrollTop / (scrollHeight - clientHeight) || 0,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
    };
  };

  /**
   * Retrieves the width of the horizontal scrollbar thumb.
   * @private
   * @returns {number} The width of the horizontal scrollbar thumb.
   */
  private _getThumbHorizontalWidth = (): number => {
    if (!this._contentRef.current || !this._trackHorizontal.current) {
      return 0;
    }
    const { scrollWidth, clientWidth } = this._contentRef.current;
    const trackWidth = getInnerWidth(this._trackHorizontal.current);
    const width = Math.ceil((clientWidth / scrollWidth) * trackWidth);
    if (trackWidth === width) {
      return 0;
    }
    return width;
  };

  /**
   * Retrieves the height of the horizontal scrollbar thumb.
   * @private
   * @returns {number} The height of the horizontal scrollbar thumb.
   */
  private _getThumbVerticalHeight = (): number => {
    if (!this._contentRef.current || !this._trackVertical.current) {
      return 0;
    }
    const { scrollHeight, clientHeight } = this._contentRef.current;
    const trackHeight = getInnerHeight(this._trackVertical.current);
    const height = Math.ceil((clientHeight / scrollHeight) * trackHeight);
    if (trackHeight === height) {
      return 0;
    }
    return height;
  };

  /**
   * Retrieves the scroll left value for a given offset.
   * @private
   * @param {number} offset - The offset value.
   * @returns {number} The scroll left value corresponding to the offset.
   */
  private _getScrollLeftForOffset = (offset: number): number => {
    if (!this._contentRef.current || !this._trackHorizontal.current) {
      return 0;
    }
    const { scrollWidth, clientWidth } = this._contentRef.current;
    const trackWidth = getInnerWidth(this._trackHorizontal.current);
    const thumbWidth = this._getThumbHorizontalWidth();
    return (offset / (trackWidth - thumbWidth)) * (scrollWidth - clientWidth);
  };

  /**
   * Retrieves the scroll top value for a given offset.
   * @private
   * @param {number} offset - The offset value.
   * @returns {number} The scroll top value corresponding to the offset.
   */
  private _getScrollTopForOffset = (offset: number): number => {
    if (!this._contentRef.current || !this._trackVertical.current) {
      return 0;
    }
    const { scrollHeight, clientHeight } = this._contentRef.current;
    const trackHeight = getInnerHeight(this._trackVertical.current);
    const thumbHeight = this._getThumbVerticalHeight();
    return (offset / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight);
  };

  /**
   * Adds event listeners to relevant elements.
   * @private
   * @returns {void}
   */
  private _addListeners = (): void => {
    /* istanbul ignore if */
    if (
      typeof document === 'undefined' ||
      !this._contentRef.current ||
      !this._trackHorizontal.current ||
      !this._trackVertical.current ||
      !this._thumbVertical.current ||
      !this._thumbHorizontal.current
    ) {
      return;
    }

    this._contentRef.current.addEventListener('scroll', this._handleScroll);
    if (!this.state.scrollbarWidth) {
      return;
    }

    this._trackHorizontal.current.addEventListener('mouseenter', this._handleTrackMouseEnter);
    this._trackHorizontal.current.addEventListener('mouseleave', this._handleTrackMouseLeave);
    this._trackHorizontal.current.addEventListener('mousedown', this._handleHorizontalTrackMouseDown);
    this._trackVertical.current.addEventListener('mouseenter', this._handleTrackMouseEnter);
    this._trackVertical.current.addEventListener('mouseleave', this._handleTrackMouseLeave);
    this._trackVertical.current.addEventListener('mousedown', this._handleVerticalTrackMouseDown);
    this._thumbHorizontal.current.addEventListener('mousedown', this._handleHorizontalThumbMouseDown);
    this._thumbVertical.current.addEventListener('mousedown', this._handleVerticalThumbMouseDown);
    // window.addEventListener('resize', this._handleContainerResize);
    this._resizeObserver.addListener(this._handleContainerResize, this._trackingSizeRef.current);
  };

  /**
   * Removes event listeners from relevant elements.
   * @private
   * @returns {void}
   */
  private _removeListeners = (): void => {
    /* istanbul ignore if */
    if (
      typeof document === 'undefined' ||
      !this._contentRef.current ||
      !this._trackHorizontal.current ||
      !this._trackVertical.current ||
      !this._thumbVertical.current ||
      !this._thumbHorizontal.current
    ) {
      return;
    }
    this._contentRef.current.removeEventListener('scroll', this._handleScroll);

    if (!this.state.scrollbarWidth) {
      return;
    }

    this._trackHorizontal.current.removeEventListener('mouseenter', this._handleTrackMouseEnter);
    this._trackHorizontal.current.removeEventListener('mouseleave', this._handleTrackMouseLeave);
    this._trackHorizontal.current.removeEventListener('mousedown', this._handleHorizontalTrackMouseDown);
    this._trackVertical.current.removeEventListener('mouseenter', this._handleTrackMouseEnter);
    this._trackVertical.current.removeEventListener('mouseleave', this._handleTrackMouseLeave);
    this._trackVertical.current.removeEventListener('mousedown', this._handleVerticalTrackMouseDown);
    this._thumbHorizontal.current.removeEventListener('mousedown', this._handleHorizontalThumbMouseDown);
    this._thumbVertical.current.removeEventListener('mousedown', this._handleVerticalThumbMouseDown);
    // window.removeEventListener('resize', this._handleContainerResize);
    this._resizeObserver.removeListener(this._handleContainerResize);
    // Possibly setup by `handleDragStart`
    this._teardownDragging();
  };

  /**
   * Event handler for the scroll event.
   * @private
   * @param {Event} event - The scroll event object.
   * @returns {void}
   */
  private _handleScroll = (event: Event): void => {
    const { onScroll, onScrollFrame } = this.props;
    if (onScroll) {
      onScroll(event);
    }
    this._renderFrame((values: ScrollValues) => {
      const { scrollLeft, scrollTop } = values;
      this._contentScrollLeft = scrollLeft;
      this._contentScrollTop = scrollTop;
      if (onScrollFrame) {
        onScrollFrame(values);
      }
    });
    this._detectScrolling();
  };

  /**
   * Event handler for the scroll start event.
   * @private
   * @returns {void}
   */
  private _handleScrollStart = (): void => {
    const { onScrollStart } = this.props;
    if (onScrollStart) {
      onScrollStart();
    }
    this._handleScrollStartAutoHide();
  };

  /**
   * Event handler for starting the auto-hide timeout when scrolling starts.
   * @private
   * @returns {void}
   */
  private _handleScrollStartAutoHide = (): void => {
    const { autoHide } = this.props;
    if (!autoHide) {
      return;
    }
    this._showTracks();
  };

  /**
   * Event handler for the scroll stop event.
   * @private
   * @returns {void}
   */
  private _handleScrollStop = (): void => {
    const { onScrollStop } = this.props;
    if (onScrollStop) {
      onScrollStop();
    }
    this._handleScrollStopAutoHide();
  };

  /**
   * Event handler for stopping the auto-hide timeout when scrolling stops.
   * @private
   * @returns {void}
   */
  private _handleScrollStopAutoHide = (): void => {
    const { autoHide } = this.props;
    if (!autoHide) {
      return;
    }
    this._hideTracks();
  };

  /**
   * Event handler for the container resize.
   * Calls _renderFrame method to update the scrollbar.
   * @private
   * @returns {void}
   */
  private _handleContainerResize = (): void => {
    this._renderFrame();
  };

  /**
   * Event handler for the mouse down event on the horizontal track element.
   * @private
   * @param {MouseEvent} event - The mouse down event object.
   * @returns {void}
   */
  private _handleHorizontalTrackMouseDown = (event: MouseEvent): void => {
    if (!this._contentRef.current) {
      return;
    }
    event.preventDefault();
    const { target, clientX } = event;
    const { left: targetLeft } = (target as HTMLElement).getBoundingClientRect();
    const thumbWidth = this._getThumbHorizontalWidth();
    const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
    this._contentRef.current.scrollLeft = this._getScrollLeftForOffset(offset);
  };

  /**
   * Event handler for the mouse down event on the vertical track element.
   * @private
   * @param {MouseEvent} event - The mouse down event object.
   * @returns {void}
   */
  private _handleVerticalTrackMouseDown = (event: MouseEvent): void => {
    if (!this._contentRef.current) {
      return;
    }
    event.preventDefault();
    const { target, clientY } = event;
    const { top: targetTop } = (target as HTMLElement).getBoundingClientRect();
    const thumbHeight = this._getThumbVerticalHeight();
    const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
    this._contentRef.current.scrollTop = this._getScrollTopForOffset(offset);
  };

  /**
   * Event handler for the mouse down event on the horizontal thumb element.
   * @private
   * @param {MouseEvent} event - The mouse down event object.
   * @returns {void}
   */
  private _handleHorizontalThumbMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    this._handleDragStart(event);
    const target = event.target as HTMLElement;
    const clientX = event.clientX;
    const { offsetWidth } = target;
    const { left } = target.getBoundingClientRect();
    this._prevPageX = offsetWidth - (clientX - left);
  };

  /**
   * Event handler for the mouse down event on the vertical thumb element.
   * @private
   * @param {MouseEvent} event - The mouse down event object.
   * @returns {void}
   */
  private _handleVerticalThumbMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    this._handleDragStart(event);
    const target = event.target as HTMLElement;
    const clientY = event.clientY;
    const { offsetHeight } = target;
    const { top } = target.getBoundingClientRect();
    this._prevPageY = offsetHeight - (clientY - top);
  };

  /**
   * Sets up dragging behavior for the scrollbar.
   * @private
   * @returns {void}
   */
  private _setupDragging = (): void => {
    css(document.body, this._styles.disableSelectStyle as {});
    document.addEventListener('mousemove', this._handleDrag);
    document.addEventListener('mouseup', this._handleDragEnd);
    document.onselectstart = (): boolean => false;
  };

  /**
   * Cleans up dragging behavior for the scrollbar.
   * @private
   * @returns {void}
   */
  private _teardownDragging = (): void => {
    css(document.body, this._styles.disableSelectStyleReset as {});
    document.removeEventListener('mousemove', this._handleDrag);
    document.removeEventListener('mouseup', this._handleDragEnd);
    document.onselectstart = null;
  };

  /**
   * Event handler for the drag start event.
   * @private
   * @param {MouseEvent} event - The drag start event object.
   * @returns {void}
   */
  private _handleDragStart = (event: MouseEvent): void => {
    this._dragging = true;
    event.stopImmediatePropagation();
    this._setupDragging();
  };

  /**
   * Event handler for the drag event.
   * @private
   * @param {MouseEvent} event - The drag event object.
   * @returns {boolean} Whether the default action should be prevented.
   */
  private _handleDrag = (event: MouseEvent): boolean => {
    if (this._prevPageX && this._trackHorizontal.current && this._contentRef.current) {
      const { clientX } = event;
      const { left: trackLeft } = this._trackHorizontal.current.getBoundingClientRect();
      const thumbWidth = this._getThumbHorizontalWidth();
      const clickPosition = thumbWidth - this._prevPageX;
      const offset = -trackLeft + clientX - clickPosition;
      this._contentRef.current.scrollLeft = this._getScrollLeftForOffset(offset);
    }
    if (this._prevPageY && this._trackVertical.current && this._contentRef.current) {
      const { clientY } = event;
      const { top: trackTop } = this._trackVertical.current.getBoundingClientRect();
      const thumbHeight = this._getThumbVerticalHeight();
      const clickPosition = thumbHeight - this._prevPageY;
      const offset = -trackTop + clientY - clickPosition;
      this._contentRef.current.scrollTop = this._getScrollTopForOffset(offset);
    }
    return false;
  };

  /**
   * Event handler for the drag end event.
   * @private
   * @returns {void}
   */
  private _handleDragEnd = (): void => {
    this._dragging = false;
    this._prevPageX = this._prevPageY = 0;
    this._teardownDragging();
    this._handleDragEndAutoHide();
  };

  /**
   * Event handler for stopping the auto-hide timeout when dragging ends.
   * @private
   * @returns {void}
   */
  private _handleDragEndAutoHide = (): void => {
    const { autoHide } = this.props;
    if (!autoHide) {
      return;
    }
    this._hideTracks();
  };

  /**
   * Event handler for the mouse enter event on the track element.
   * @private
   * @returns {void}
   */
  private _handleTrackMouseEnter = (): void => {
    this._trackMouseOver = true;
    this._handleTrackMouseEnterAutoHide();
  };

  /**
   * Event handler for starting the auto-hide timeout when the mouse enters the track element.
   * @private
   * @returns {void}
   */
  private _handleTrackMouseEnterAutoHide = (): void => {
    const { autoHide } = this.props;
    if (!autoHide) {
      return;
    }
    this._showTracks();
  };

  /**
   * Event handler for the mouse leave event on the track element.
   * @private
   * @returns {void}
   */
  private _handleTrackMouseLeave = (): void => {
    this._trackMouseOver = false;
    this._handleTrackMouseLeaveAutoHide();
  };

  /**
   * Event handler for stopping the auto-hide timeout when the mouse leaves the track element.
   * @private
   * @returns {void}
   */
  private _handleTrackMouseLeaveAutoHide = (): void => {
    const { autoHide } = this.props;
    if (!autoHide) {
      return;
    }
    this._hideTracks();
  };

  /**
   * Shows the scrollbar tracks.
   * @private
   * @returns {void}
   */
  private _showTracks = (): void => {
    clearTimeout(this._hideTracksTimeout);
    if (this._trackHorizontal.current && this._trackVertical.current) {
      css(this._trackHorizontal.current, { opacity: 1 });
      css(this._trackVertical.current, { opacity: 1 });
    }
  };

  /**
   * Hides the scrollbar tracks.
   * @private
   * @returns {void}
   */
  private _hideTracks = (): void => {
    if (this._dragging) {
      return;
    }
    if (this._scrolling) {
      return;
    }
    if (this._trackMouseOver) {
      return;
    }
    const { autoHideTimeout } = this.props;
    clearTimeout(this._hideTracksTimeout);
    this._hideTracksTimeout = setTimeout(() => {
      if (this._trackHorizontal.current && this._trackVertical.current) {
        css(this._trackHorizontal.current, { opacity: 0 });
        css(this._trackVertical.current, { opacity: 0 });
      }
    }, autoHideTimeout);
  };

  /**
   * Detects scrolling behavior.
   * @private
   * @returns {void}
   */
  private _detectScrolling = (): void => {
    if (this._scrolling) {
      return;
    }
    this._scrolling = true;
    this._handleScrollStart();
    this._detectScrollingInterval = setInterval(() => {
      if (
        this._lastContentScrollLeft === this._contentScrollLeft &&
        this._lastContentScrollTop === this._contentScrollTop
      ) {
        clearInterval(this._detectScrollingInterval);
        this._scrolling = false;
        this._handleScrollStop();
      }
      this._lastContentScrollLeft = this._contentScrollLeft;
      this._lastContentScrollTop = this._contentScrollTop;
    }, 100);
  };

  /**
   * Executes a callback using requestAnimationFrame, canceling any previous animation frame request.
   * @private
   * @param {Function} callback - The callback function to execute.
   * @returns {void}
   */
  private _raf = (callback: Function): void => {
    if (this._requestFrame) {
      caf(this._requestFrame);
    }
    this._requestFrame = raf(() => {
      this._requestFrame = undefined;
      callback();
    });
  };

  /**
   * Renders a frame using requestAnimationFrame, updating the scrollbar.
   * @private
   * @param {RenderFrameCallback} [callback] - Optional callback function to execute after rendering.
   * @returns {void}
   */
  private _renderFrame = (callback?: RenderFrameCallback): void => {
    this._raf(() => this._update(callback));
  };

  /**
   * Updates the scrollbar appearance and triggers the onUpdate callback with the current scroll values.
   * @private
   * @param {RenderFrameCallback} [callback] - Optional callback function to execute after updating.
   * @returns {void}
   */
  private _update = (callback?: RenderFrameCallback): void => {
    const { onUpdate, autoHide, direction } = this.props;
    const values = this._getScrollValues();

    const freshScrollbarWidth = getScrollbarWidth();

    if (this.state.scrollbarWidth !== freshScrollbarWidth) {
      this.setState({ scrollbarWidth: freshScrollbarWidth });
    }

    if (this.state.scrollbarWidth) {
      const { scrollLeft, clientWidth, scrollWidth } = values;
      const trackHorizontalWidth = getInnerWidth(this._trackHorizontal.current);

      const thumbHorizontalWidth = this._getThumbHorizontalWidth();

      let thumbHorizontalX;
      const isWebkit = /AppleWebKit/.test(navigator.userAgent);
      if (direction === 'rtl' && isWebkit) {
        thumbHorizontalX =
          ((-1 * (scrollWidth - clientWidth - scrollLeft)) / (scrollWidth - clientWidth)) *
          (trackHorizontalWidth - thumbHorizontalWidth);
      } else {
        thumbHorizontalX = (scrollLeft / (scrollWidth - clientWidth)) * (trackHorizontalWidth - thumbHorizontalWidth);
      }
      const thumbHorizontalStyle = {
        width: thumbHorizontalWidth,
        transform: `translateX(${thumbHorizontalX}px)`,
      };
      const { scrollTop, clientHeight, scrollHeight } = values;
      const trackVerticalHeight = getInnerHeight(this._trackVertical.current);
      const thumbVerticalHeight = this._getThumbVerticalHeight();
      const thumbVerticalY = (scrollTop / (scrollHeight - clientHeight)) * (trackVerticalHeight - thumbVerticalHeight);
      const thumbVerticalStyle = {
        height: thumbVerticalHeight,
        transform: `translateY(${thumbVerticalY}px)`,
      };
      if (autoHide) {
        const trackHorizontalStyle = {
          visibility: scrollWidth > clientWidth ? 'visible' : 'hidden',
        };
        const trackVerticalStyle = {
          visibility: scrollHeight > clientHeight ? 'visible' : 'hidden',
        };
        if (this._trackHorizontal.current && this._trackVertical.current) {
          css(this._trackHorizontal.current, trackHorizontalStyle);
          css(this._trackVertical.current, trackVerticalStyle);
        }
      }
      if (this._thumbHorizontal.current && this._thumbVertical.current) {
        css(this._thumbHorizontal.current, thumbHorizontalStyle);
        css(this._thumbVertical.current, thumbVerticalStyle);
      }
    }
    if (onUpdate) {
      onUpdate(values);
    }
    if (typeof callback !== 'function') {
      return;
    }
    callback(values);
  };

  /**
   * Scrolls the content horizontally to the specified position.
   * @public
   * @param {number} [left=0] - The horizontal position to scroll to.
   * @returns {void}
   */
  public scrollLeft = (left = 0): void => {
    if (!this._contentRef.current) {
      return;
    }
    this._contentRef.current.scrollTo({
      behavior: 'smooth',
      left,
    });
  };

  /**
   * Scrolls the content vertically to the specified position.
   * @public
   * @param {number} [top=0] - The vertical position to scroll to.
   * @returns {void}
   */
  public scrollTop = (top = 0): void => {
    if (!this._contentRef.current) {
      return;
    }
    this._contentRef.current.scrollTo({
      behavior: 'smooth',
      top,
    });
  };

  /**
   * Scrolls the content to the leftmost position.
   * @public
   * @returns {void}
   */
  public scrollToLeft = (): void => {
    if (!this._contentRef.current) {
      return;
    }
    this._contentRef.current.scrollTo({
      behavior: 'smooth',
      left: 0,
    });
  };

  /**
   * Scrolls the content to the topmost position.
   * @public
   * @returns {void}
   */
  public scrollToTop = (): void => {
    if (!this._contentRef.current) {
      return;
    }
    this._contentRef.current.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  };

  /**
   * Scrolls the content to the rightmost position.
   * @public
   * @returns {void}
   */
  public scrollToRight = (): void => {
    if (!this._contentRef.current) {
      return;
    }
    this._contentRef.current.scrollTo({
      behavior: 'smooth',
      left: this._contentRef.current.scrollWidth,
    });
  };

  /**
   * Scrolls the content to the bottommost position.
   * @public
   * @returns {void}
   */
  public scrollToBottom = (): void => {
    if (!this._contentRef.current) {
      return;
    }
    this._contentRef.current.scrollTo({
      behavior: 'smooth',
      top: this._contentRef.current.scrollHeight,
    });
  };

  /**
   * Retrieves the horizontal scroll position of the content.
   * @public
   * @returns {number} The horizontal scroll position.
   */
  public getScrollLeft = (): number => {
    if (!this._contentRef.current) {
      return 0;
    }
    return this._contentRef.current.scrollLeft;
  };

  /**
   * Retrieves the vertical scroll position of the content.
   * @public
   * @returns {number} The vertical scroll position.
   */
  public getScrollTop = (): number => {
    if (!this._contentRef.current) {
      return 0;
    }
    return this._contentRef.current.scrollTop;
  };

  /**
   * Retrieves the total width of the scrollable content in the content.
   * @public
   * @returns {number} The total width of the scrollable content.
   */
  public getScrollWidth = (): number => {
    if (!this._contentRef.current) {
      return 0;
    }
    return this._contentRef.current.scrollWidth;
  };

  /**
   * Retrieves the total height of the scrollable content in the content.
   * @public
   * @returns {number} The total height of the scrollable content.
   */
  public getScrollHeight = (): number => {
    if (!this._contentRef.current) {
      return 0;
    }
    return this._contentRef.current.scrollHeight;
  };

  /**
   * Retrieves the width of the contentable area of the element, excluding borders, padding, and vertical scrollbar (if present).
   * @public
   * @returns {number} The width of the contentable area.
   */
  public getClientWidth = (): number => {
    if (!this._contentRef.current) {
      return 0;
    }
    return this._contentRef.current.clientWidth;
  };

  /**
   * Retrieves the height of the contentable area of the element, excluding borders, padding, and vertical scrollbar (if present).
   * @public
   * @returns {number} The height of the contentable area.
   */
  public getClientHeight = (): number => {
    if (!this._contentRef.current) {
      return 0;
    }
    return this._contentRef.current.clientHeight;
  };

  /**
   * Retrieves scroll values of the content element.
   * @public
   * @returns {ScrollValues} The scroll values of the content.
   */
  public getScrollValues = (): ScrollValues => {
    return this._getScrollValues();
  };

  public override render = (): ReactNode => {
    const { scrollbarWidth, didMountUniversal } = this.state;

    const {
      autoHide,
      autoHideDuration,
      children,
      renderThumbHorizontal = Scrollbar.defaultProps.renderThumbHorizontal,
      renderThumbVertical = Scrollbar.defaultProps.renderThumbVertical,
      renderTrackHorizontal = Scrollbar.defaultProps.renderTrackHorizontal,
      renderTrackVertical = Scrollbar.defaultProps.renderTrackVertical,
      universal,
    } = this.props;

    const {
      containerStyleDefault,
      thumbStyleDefault,
      trackHorizontalStyleDefault,
      trackVerticalStyleDefault,
      contentStyleDefault,
      contentStyleUniversalInitial,
    } = this._styles;

    const containerStyle = {
      ...containerStyleDefault,
    };

    const contentStyle = {
      ...contentStyleDefault,
      // Hide scrollbars by setting a negative margin
      marginRight: scrollbarWidth ? -scrollbarWidth : 0,
      marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
      // Override
      ...(universal && !didMountUniversal && contentStyleUniversalInitial),
    };

    const trackAutoHeightStyle = {
      transition: `opacity ${autoHideDuration}ms`,
      opacity: 0,
    };

    const trackHorizontalStyle = {
      ...trackHorizontalStyleDefault,
      ...(autoHide && trackAutoHeightStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: 'none',
      }),
    };

    const trackVerticalStyle = {
      ...trackVerticalStyleDefault,
      ...(autoHide && trackAutoHeightStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: 'none',
      }),
    };

    const mergedClasses = getFinalClasses(this.props);

    return createElement(
      'div',
      { className: mergedClasses.container, style: containerStyle, ref: this._containerRef },
      [
        <div
          key="content"
          style={contentStyle}
          className={mergedClasses.content}
          ref={this._contentRef}
          children={<div ref={this._trackingSizeRef}>{children}</div>}
        />,

        // Horizontal track & thumb
        cloneElement(
          renderTrackHorizontal({ style: trackHorizontalStyle, className: mergedClasses.trackHorizontal }),
          { key: 'trackHorizontal', ref: this._trackHorizontal },
          cloneElement(renderThumbHorizontal({ style: thumbStyleDefault, className: mergedClasses.thumbHorizontal }), {
            key: 'thumbHorizontal',
            ref: this._thumbHorizontal,
          }),
        ),

        // Vertical track & thumb
        cloneElement(
          renderTrackVertical({
            style: trackVerticalStyle,
            className: mergedClasses.trackVertical,
          }),
          { key: 'trackVertical', ref: this._trackVertical },
          cloneElement(renderThumbVertical({ style: thumbStyleDefault, className: mergedClasses.thumbVertical }), {
            key: 'thumbVertical',
            ref: this._thumbVertical,
          }),
        ),
      ],
    );
  };
}
