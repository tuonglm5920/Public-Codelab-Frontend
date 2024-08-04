import { Length } from '../../Length';
import { Tail } from '../../Tail';
import { Unshift } from '../../Unshift';

type DropFromHead_<T extends any[], N extends number, I extends any[] = []> = {
  0: DropFromHead_<Tail<T>, N, Unshift<I, any>>;
  1: T;
}[Length<I> extends N ? 1 : 0];

/**
 * Remove a specified number of elements from the beginning (head) of an array.
 * @param {any[]} list Source array.
 * @param {number} count Quantity item need drop.
 * @example ```typescript
  type Case1 = DropFromHead<[1, 2, 3, 4, 5], 1>; // [2, 3, 4, 5]
  ```
 */
export type DropFromHead<T extends any[], N extends number, I extends any[] = []> = DropFromHead_<T, N, I>;
