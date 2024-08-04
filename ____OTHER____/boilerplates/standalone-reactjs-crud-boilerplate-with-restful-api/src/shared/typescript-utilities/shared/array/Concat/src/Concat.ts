/**
 * Combining two or more arrays into a single array.
 * @param {any[]} source First array.
 * @param {any[]} list Second array.
 * @example ```typescript
  type Case1 = Concat<[1, 2], [3, 4]>; // Result: [1, 2, 3, 4]
 ```
 */
export type Concat<T1 extends any[], T2 extends any[]> = [...T1, ...T2]; // Ts 4.0 support
// type Cast<X, Y> = X extends Y ? X : Y;
// import { Cast } from "./Cast";
// import { Reverse } from "./Reverse";
// export type Concat<T1 extends any[], T2 extends any[]> = Reverse<Cast<Reverse<T1>, any>, T2>
