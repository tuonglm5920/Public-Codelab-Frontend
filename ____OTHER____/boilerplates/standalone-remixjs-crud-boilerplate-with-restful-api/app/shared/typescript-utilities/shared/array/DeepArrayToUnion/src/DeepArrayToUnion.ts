/**
 * Transforms a nested array type into its corresponding union type.
 * @param {any[]} list Source array of specific literals.
 * @example ```typescript
  type Case1 = DeepArrayToUnion<[1, 2, [3, 4], ['a'], ['b', 'c'], [['d']], [[[['e']]]]]>; // Result:  2 | 3 | 4 | 1 | "a" | "b" | "c" | "d" | "e"
  type Case2 = DeepArrayToUnion<[1, 2, [3, 4]]>; // Result:  2 | 3 | 4 | 1
 ```
 */
export type DeepArrayToUnion<T extends any[]> = {
  [K in keyof T]: T[K] extends any[] ? DeepArrayToUnion<T[K]> : T[K];
}[number];
