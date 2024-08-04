import { GetRequired } from '../../GetRequired';
/**
 * Extracts the keys from an object type that are marked as optional.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type Case1 = GetOptional<MyObject>; // Result: { b?: number; }
  ```
 */
export type GetOptional<T> = Omit<T, keyof GetRequired<T>>;
