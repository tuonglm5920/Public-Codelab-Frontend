import { IsRequired } from '../../../@essentials';

/**
 * Extracts the required properties of an object type, returning an object type composed solely of its required properties.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type Case1 = GetRequired<{ a: string; b?: number }>; // Result: { a: string }
  ```
 */
export type GetRequired<T> = {
  [K in keyof T as IsRequired<T, K> extends true ? K : never]: T[K];
};
