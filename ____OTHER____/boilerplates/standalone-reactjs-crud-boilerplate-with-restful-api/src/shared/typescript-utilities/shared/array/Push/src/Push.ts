/**
 * Tailored to simulate the addition of an element to the end of a tuple type.
 * @param {any[]} list Source array.
 * @param {any} item Item need push to source array.
 * @example ```typescript
  type Case1 = Push<[1, 2, 3], 4>; // Result: [1, 2, 3, 4]
  ```
 */
export type Push<T extends any[], E> = ((head: E, ...args: T) => any) extends (
  head: infer Element,
  ...args: infer Array
) => any
  ? [...Array, Element]
  : T;
