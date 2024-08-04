import { CSSProperties } from 'react';
import { Direction } from '../types/Direction';
import { StyleKeys } from '../types/StyleKeys';

/**
 * Creates styles for the scrollbar components.
 * @returns {Record<StyleKeys, CSSProperties>} Styles for various components of the scrollbar.
 */
export const createStyles = (direction: Direction): Record<StyleKeys, CSSProperties> => {
  const trackStyleDefault: CSSProperties = {
    position: 'absolute',
    [direction === 'rtl' ? 'left' : 'right']: 2,
    bottom: 2,
    zIndex: 100,
    borderRadius: 3,
  };

  return {
    containerStyleDefault: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
    },

    contentStyleDefault: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },

    contentStyleUniversalInitial: {
      overflow: 'hidden',
      marginRight: 0,
      marginBottom: 0,
    },

    trackHorizontalStyleDefault: {
      ...trackStyleDefault,
      left: 2,
      height: 6,
    },

    trackVerticalStyleDefault: {
      ...trackStyleDefault,
      top: 2,
      width: 6,
    },

    thumbStyleDefault: {
      position: 'relative',
      display: 'block',
      height: '100%',
      cursor: 'pointer',
      borderRadius: 'inherit',
      backgroundColor: 'rgba(0,0,0,.2)',
    },

    disableSelectStyle: {
      userSelect: 'none',
    },

    disableSelectStyleReset: {
      userSelect: 'auto',
    },
  };
};
