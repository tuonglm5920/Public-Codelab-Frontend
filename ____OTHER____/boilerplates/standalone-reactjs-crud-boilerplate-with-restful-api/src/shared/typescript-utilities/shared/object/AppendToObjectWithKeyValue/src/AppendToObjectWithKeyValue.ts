/**
 * Allows for the dynamic addition of a key-value pair to a given object type.
 * @param {object} sourceObject Source object.
 * @param {string} newKey New key will be added to object.
 * @param {any} newValue New value will be added to object.
 * @example ```typescript
  type Case1 = AppendToObjectWithKeyValue<{ a: string }, 'abc', 123>; // Result: { abc: 123; a: string; }
  ```
 */
export type AppendToObjectWithKeyValue<T, Key extends string, Value> = {
  [key in keyof T | Key]: key extends keyof T ? T[key] : Value;
};
