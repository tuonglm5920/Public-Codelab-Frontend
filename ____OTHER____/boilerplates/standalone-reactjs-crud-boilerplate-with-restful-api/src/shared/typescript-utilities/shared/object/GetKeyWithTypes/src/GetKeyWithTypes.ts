type PickKeysByValue<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
type PickProperties<T, P> = Pick<T, PickKeysByValue<T, P>>;

/**
 * Eextracts the keys from an object type whose values match a specified type.
 * @param {object} sourceObject Source object.
 * @param {any} typeSearch Type for search.
 * @example ```typescript
  type Case1 = GetKeyWithTypes<{ a: number; b?: string; c: string | undefined; d: string }, number>; // "a"
  type Case2 = GetKeyWithTypes<{ a: number; b?: string; c: string | undefined; d: string }, string | undefined>; // "b" | "c" | "d"
  ```
 */
export type GetKeyWithTypes<T, P> = Exclude<keyof PickProperties<T, P>, undefined>;
