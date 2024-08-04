// export type Tail<T extends any[]> = ((...t: T) => any) extends ((_: any, ...args: infer TT) => any) ? TT : never;

/**
 * Extract all elements of a tuple type, excluding the first element.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1 = Tail<[1, 2, 3, 4, 5]>; // Result: [2, 3, 4, 5]
  type Case2 = Tail<['name', 'age', 'address']>; // Result: ["age", "address"]
 ```
 */
export type Tail<T> = T extends [infer _I, ...infer Rest] ? Rest : never;
