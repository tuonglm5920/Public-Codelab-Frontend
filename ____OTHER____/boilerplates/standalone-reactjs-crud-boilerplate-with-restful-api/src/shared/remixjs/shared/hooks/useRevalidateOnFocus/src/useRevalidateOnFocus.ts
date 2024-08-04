import { useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';

interface UseRevalidateOnFocus {
  /**
   * If true, enables the revalidation on window focus and visibility change.
   * Defaults to true.
   */
  enabled?: boolean;
}

/**
 * A custom hook that revalidates data when the window gains focus or the visibility changes.
 *
 * @param {UseRevalidateOnFocus} options - The options to configure the hook.
 * @param {boolean} [options.enabled=true] - If true, enables the revalidation on focus and visibility change.
 *
 * @example
 * useRevalidateOnFocus();
 */
export const useRevalidateOnFocus = ({ enabled = true }: UseRevalidateOnFocus): void => {
  const { revalidate } = useRevalidator();

  const handleFocus = (): void => {
    revalidate();
  };

  const handleVisibilityChange = (): void => {
    revalidate();
  };

  useEffect(() => {
    if (!enabled) {
      window.removeEventListener('focus', handleFocus);
      return;
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      return;
    }
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
};
