import { HasTail } from '../../HasTail';
import { Head } from '../../Head';
import { Tail } from '../../Tail';

/**
 * Extracting the type of the last element from a tuple.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1 = Last<[1, 2, 3, 4]>; // Result: 4
  ```
 */
export type Last<T extends any[]> = {
  0: Last<Tail<T>>;
  1: Head<T>;
}[HasTail<T> extends true ? 0 : 1];
