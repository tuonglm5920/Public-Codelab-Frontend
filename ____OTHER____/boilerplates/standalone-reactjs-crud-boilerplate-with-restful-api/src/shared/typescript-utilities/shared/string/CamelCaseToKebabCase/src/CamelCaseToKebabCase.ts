/**
 * Transform a camelCase string type into its kebab-case counterpart.
 * @param {string} sourceString Source string.
 * @example ```typescript
  type KebabString = CamelCaseToKebabCase<'helloWorld'>;
  // Result type: "hello-world"
  ```
 */
export type CamelCaseToKebabCase<T> = T extends `${infer Character}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Uncapitalize<Character>}${CamelCaseToKebabCase<Rest>}`
    : `${Uncapitalize<Character>}-${CamelCaseToKebabCase<Rest>}`
  : T;
