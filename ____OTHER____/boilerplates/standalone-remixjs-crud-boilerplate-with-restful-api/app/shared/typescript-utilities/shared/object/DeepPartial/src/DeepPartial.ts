// https://github.com/krzkaczor/ts-essentials

// type DeepPartial<T> = {
// 	[P in keyof T]?: T[P] extends Array<infer U>
// 		? Array<DeepPartial<U>>
// 		: T[P] extends ReadonlyArray<infer U>
// 		? ReadonlyArray<DeepPartial<U>>
// 		: DeepPartial<T[P]>;
// };

/**
 * Designed to recursively transform all properties of an object, including nested objects, into optional properties.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type UserProfile = {
    id: number;
    details: {
      name: string;
      age: number;
    };
  };
  type PartialUserProfile = DeepPartial<UserProfile>;
  // Result type:
  // {
  //   id?: number;
  //   details?: {
  //     name?: string;
  //     age?: number;
  //   };
  // }
  ```
 */
export type DeepPartial<T> = T extends Function ? T : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
