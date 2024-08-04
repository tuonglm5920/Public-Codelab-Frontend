/**
 * Replace a specified substring with another within a string type.
 * @param {string} sourceString Source string.
 * @param {string} searchValue Search value will be replaced.
 * @param {string} newValue Target value.
 * @example ```typescript
  const str = `Lorem Ipsum is simply dummy text`;
  type Case1 = Replace<typeof str, 'Lorem Ipsum', 'abc'>; // Result: "abc is simply dummy text"
  ```
 */

export type Replace<Source extends string, SearchValue extends string, NewValue extends string> = SearchValue extends ''
  ? Source
  : Source extends `${infer Head}${SearchValue}${infer Tail}`
    ? `${Head}${NewValue}${Tail}`
    : Source;
