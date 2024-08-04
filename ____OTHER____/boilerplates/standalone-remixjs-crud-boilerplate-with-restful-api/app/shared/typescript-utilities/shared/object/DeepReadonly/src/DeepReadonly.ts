import { BuiltIn, IsUnknown } from '../../../@essentials';

/**
 * Recursively transform all properties of an object, including nested objects, into readonly properties.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type MutableUserProfile = {
      id: number;
      details: {
          name: string;
          age: number;
      };
  };
  type ReadonlyUserProfile = DeepReadonly<MutableUserProfile>;
  // Result type:
  // {
  //     readonly id: number;
  //     readonly details: {
  //         readonly name: string;
  //         readonly age: number;
  //     };
  // }
  ```
 */
export type DeepReadonly<T> = T extends BuiltIn
  ? T
  : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
        : T extends Set<infer U>
          ? ReadonlySet<DeepReadonly<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepReadonly<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepReadonly<U>>
              : T extends Promise<infer U>
                ? Promise<DeepReadonly<U>>
                : T extends {}
                  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                  : IsUnknown<T> extends true
                    ? unknown
                    : Readonly<T>;
