/**
 * Simulate the addition of single element to the beginning of a tuple type.
 * @param {any[]} list Source array.
 * @param {any} newItem Item will be added to source array.
 * @example ```typescript
  type Case1 = Unshift<[1, 2, 3], 4>; // Result:  [4, 1, 2, 3]
  type Case2 = Unshift<[number, boolean], string>; // Result: [string, number, boolean]
 ```
 */
export type Unshift<T extends any[], E> = ((head: E, ...args: T) => any) extends (...args: infer U) => any ? U : T;
