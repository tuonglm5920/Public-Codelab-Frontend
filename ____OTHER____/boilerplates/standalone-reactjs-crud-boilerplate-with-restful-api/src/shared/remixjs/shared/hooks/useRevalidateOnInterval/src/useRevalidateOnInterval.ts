import { useRevalidator } from '@remix-run/react';
import { useEffect, useRef } from 'react';

interface UseRevalidateOnInterval {
  /**
   * If true, enables the revalidation at a specified interval.
   * Defaults to true.
   */
  enabled?: boolean;
  /**
   * The interval time in milliseconds at which to revalidate.
   * Defaults to 1000 ms.
   */
  interval?: number;
}

/**
 * A custom hook that revalidates data at a specified interval.
 *
 * @param {UseRevalidateOnInterval} options - The options to configure the hook.
 * @param {boolean} [options.enabled=true] - If true, enables the revalidation at a specified interval.
 * @param {number} [options.interval=1000] - The interval time in milliseconds at which to revalidate.
 *
 * @example
 * useRevalidateOnInterval({ enabled: true, interval: 5000 });
 */
export const useRevalidateOnInterval = ({ enabled = true, interval = 1000 }: UseRevalidateOnInterval): void => {
  const { revalidate } = useRevalidator();
  const intervalRef = useRef<number | NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (!enabled) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(revalidate, interval);
    return (): void => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, interval, revalidate]);
};
