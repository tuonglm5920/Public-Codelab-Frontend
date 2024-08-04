// https://github.com/microsoft/TypeScript/pull/40336

/**
 * Concatenate elements of a tuple into a single string type
 * @param {string[]} list Array string need join.
 * @param {string} delimiter Delimiter join array to string.
 * @example ```typescript
  type Case1 = Join<[1, 2, 3, 4], '.'>;  // '1.2.3.4'
  type Case2 = Join<['foo', 'bar', 'baz'], '-'>;  // 'foo-bar-baz'
  type Case3 = Join<[], '.'>;  // ''
  ```
 */
export type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number | boolean | bigint]
    ? `${T[0]}`
    : T extends [string | number | boolean | bigint, ...infer U]
      ? `${T[0]}${D}${Join<U, D>}`
      : string;
