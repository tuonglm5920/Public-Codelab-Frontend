/**
 * Determine if a given type is the `any` type.
 * @param {any} sourceType Source type.
 * @example ```typescript
  type UnconstrainedType = any;
  type CheckResult = IsAny<UnconstrainedType>; // Result type: true
  ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;
