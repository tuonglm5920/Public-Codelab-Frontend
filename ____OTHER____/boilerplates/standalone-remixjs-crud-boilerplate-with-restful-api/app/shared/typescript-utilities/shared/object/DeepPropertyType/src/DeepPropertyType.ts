// https://github.com/microsoft/TypeScript/pull/40336

import { PathKeyOfObject } from '../../PathKeyOfObject';

/**
 * Provide it with an object type and a dot-separated path string pointing to the desired nested property
 * @param {object} sourceObject Source object.
 * @param {string} path Path of object will be got value
 * @example ```typescript
  type Configuration = {
    database: {
      connection: {
        host: string;
        port: number;
      };
      credentials: {
        username: string;
        password: string;
      };
    };
    server: {
      port: number;
    };
  };
  type ConnectionType = DeepPropertyType<Configuration, 'database.connection'>;
  // Result type:
  // {
  //   host: string;
  //   port: number;
  // }
  ```
 */
export type DeepPropertyType<T, P extends PathKeyOfObject<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends PathKeyOfObject<T[Key]>
      ? DeepPropertyType<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;
