import { ReactNode, RefObject, useMemo, useRef } from 'react';
import { v4 } from 'uuid';
import { useWindowSize } from '../../../hooks';
import { useRect } from '../../../hooks/useRect';
import { getPadding } from './utils/getPadding';
import { safe } from './utils/safe';

export interface Props<T extends Element> {
  /** #### Padding of the highlighted area */
  padding?: number;
  /** #### Render DOM-attached */
  children: (domAttachedRef: RefObject<T>) => ReactNode;
}

export const Mask = <T extends Element>({ padding = 10, children }: Props<T>): ReactNode => {
  const domAttachedRef = useRef<T | null>(null);
  const windowSize = useWindowSize();
  const maskID = useMemo(v4, []);
  const clipID = useMemo(v4, []);
  const [paddingX, paddingY] = useMemo(() => getPadding(padding), [padding]);

  const domAttachedRect = useRect(domAttachedRef.current);

  const width = useMemo(() => safe(domAttachedRect.width + paddingX * 2), [domAttachedRect.width, paddingX]);
  const height = useMemo(() => safe(domAttachedRect.height + paddingY * 2), [domAttachedRect.height, paddingY]);
  const top = useMemo(() => safe(domAttachedRect.top - paddingY), [domAttachedRect.top, paddingY]);
  const left = useMemo(() => safe(domAttachedRect.left - paddingX), [domAttachedRect.left, paddingX]);

  // FIXME: Use portal
  return (
    <>
      {children(domAttachedRef)}
      <div
        style={{
          opacity: 0.7,
          left: 0,
          top: 0,
          position: 'fixed',
          zIndex: 99999,
          pointerEvents: 'none',
          color: '#000',
        }}
      >
        <svg
          width={windowSize.width}
          height={windowSize.height}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'fixed',
            inset: 0,
          }}
        >
          <defs>
            <mask id={maskID}>
              <rect x={0} y={0} width={windowSize.width} height={windowSize.height} fill="white" />
              <rect x={left} y={top} rx={0} width={width} height={height} fill="black" />
            </mask>
            <clipPath id={clipID}>
              <polygon
                points={`
                0 0,
                0 ${windowSize.height},
                ${left} ${windowSize.height},
                ${left} ${top},
                ${left + width} ${top},
                ${left + width} ${top + height},
                ${left} ${top + height},
                ${left} ${windowSize.height},
                ${windowSize.width} ${windowSize.height},
                ${windowSize.width} 0
              `}
              />
            </clipPath>
          </defs>
          {/* The actual Mask */}
          <rect
            x={0}
            y={0}
            width={windowSize.width}
            height={windowSize.height}
            fill="currentColor"
            mask={`url(#${maskID})`}
          />
          {/* The clickable area */}
          <rect
            x={0}
            y={0}
            width={windowSize.width}
            height={windowSize.height}
            fill="currentColor"
            clipPath={`url(#${clipID})`}
            pointerEvents="auto"
          />
        </svg>
      </div>
    </>
  );
};
