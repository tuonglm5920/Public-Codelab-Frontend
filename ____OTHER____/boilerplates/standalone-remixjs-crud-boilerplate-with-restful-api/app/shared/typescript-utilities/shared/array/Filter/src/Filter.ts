/**
 * Refines array types by including specific desired types.
 * @param {any[]} list Source array.
 * @param {any} filterBy Expect types of array's item.
 * @example ```typescript
  type _Case1 = Filter<[1, 2, string, boolean], number>; // [1, 2]
 ```
 */
export type Filter<Arr extends unknown[], FilterBy> = Arr extends [infer FirstElement, ...infer Rest]
  ? FirstElement extends FilterBy
    ? [FirstElement, ...Filter<Rest, FilterBy>]
    : Filter<Rest, FilterBy>
  : Arr;
