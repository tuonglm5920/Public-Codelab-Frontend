import { Head } from '../../Head';
import { Length } from '../../Length';
import { Push } from '../../Push';
import { Tail } from '../../Tail';

type DropFromTail_<T extends any[], N extends number, I extends any[] = []> = {
  0: DropFromTail_<Tail<T>, N, Push<I, Head<T>>>;
  1: I;
}[Length<T> extends N ? 1 : 0];

/**
 * Remove a specified number of elements from the end (tail) of a tuple type.
 * @param {any[]} list Source array.
 * @param {number} count Quantity item need drop.
 * @example ```typescript
  type Case1 = DropFromTail<[1, 2, 3, 4], 2>; // Result: [1, 2]
 ```
 */
export type DropFromTail<T extends any[], N extends number, I extends any[] = []> = DropFromTail_<T, N, I>;
