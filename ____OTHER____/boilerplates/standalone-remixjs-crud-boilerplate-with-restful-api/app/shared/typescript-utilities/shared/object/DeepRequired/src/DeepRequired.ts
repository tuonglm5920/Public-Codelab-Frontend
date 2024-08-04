import { BuiltIn } from '../../../@essentials';

/**
 * Designed to recursively transform all properties of an object, including nested objects, into required properties.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type PartialUserProfile = {
    id?: number;
    details?: {
      name?: string;
      age?: number;
    };
  };
  type RequiredUserProfile = DeepRequired<PartialUserProfile>;
  // Result type:
  // {
  //   id: number;
  //   details: {
  //     name: string;
  //     age: number;
  //   };
  // }
  ```
 */
export type DeepRequired<T> = T extends BuiltIn
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
    ? Map<DeepRequired<K>, DeepRequired<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepRequired<K>, DeepRequired<V>>
        : T extends Set<infer U>
          ? Set<DeepRequired<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepRequired<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepRequired<U>>
              : T extends Promise<infer U>
                ? Promise<DeepRequired<U>>
                : T extends {}
                  ? { [K in keyof T]-?: DeepRequired<T[K]> }
                  : NonNullable<T>;
