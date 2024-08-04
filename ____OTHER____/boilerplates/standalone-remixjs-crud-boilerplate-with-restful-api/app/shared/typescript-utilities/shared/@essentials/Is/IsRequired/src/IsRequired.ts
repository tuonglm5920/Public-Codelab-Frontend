/**
 * Determine if a given property within an object type is required.
 * @param {object} sourceObject Source object.
 * @param {string} targetKey Target key will be checked.
 * @example ```typescript
  type UserProfile = {
    id: number;
    name?: string;
    age: number;
  };
  type IsNameRequired = IsRequired<UserProfile, 'name'>;
  // Result type: false
  ```
 */
export type IsRequired<T, K extends keyof T> = Pick<T, K> extends Record<K, T[K]> ? true : false;
