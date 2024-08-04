import { IsAny } from '../../IsAny';

/**
 * Determine if a given type is the `unknown` type
 * @param {any} sourceType Source type.
 * @example ```typescript
  type AmbiguousType = unknown;
  type CheckResult = IsUnknown<AmbiguousType>;
  // Result type:
  // true
  ```
 */
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;
