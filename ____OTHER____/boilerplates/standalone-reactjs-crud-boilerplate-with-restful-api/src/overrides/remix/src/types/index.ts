/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';

export declare class DeferredData {
  private pendingKeysSet;
  private controller;
  private abortPromise;
  private unlistenAbortSignal;
  private subscribers;
  data: Record<string, unknown>;
  init?: ResponseInit;
  deferredKeys: string[];
  constructor(data: Record<string, unknown>, responseInit?: ResponseInit);
  private trackPromise;
  private onSettle;
  private emit;
  subscribe(fn: (aborted: boolean, settledKey?: string) => void): () => boolean;
  cancel(): void;
  resolveData(signal: AbortSignal): Promise<boolean>;
  get done(): boolean;
  get unwrappedData(): {};
  get pendingKeys(): string[];
}

export type TypedResponse<T = unknown> = Omit<Response, 'json'> & {
  json(): Promise<T>;
};

export type TypedDeferredData<Data extends Record<string, unknown>> = Pick<DeferredData, 'init'> & {
  data: Data;
};

export type UndefinedToOptional<T extends object> = {
  [k in keyof T as undefined extends T[k] ? never : k]: T[k];
} & {
  [k in keyof T as undefined extends T[k] ? k : never]?: Exclude<T[k], undefined>;
};
type IsAny<T> = 0 extends 1 & T ? true : false;
type JsonPrimitive = string | number | boolean | String | Number | Boolean | null;
export type NonJsonPrimitive = undefined | Function | symbol;
/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
type SerializeTuple<T extends [unknown, ...unknown[]]> = {
  [k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>;
};
/** JSON serialize objects (not including arrays) and classes */
export type SerializeObject<T extends object> = {
  [k in keyof T as T[k] extends NonJsonPrimitive ? never : k]: Serialize<T[k]>;
};
type SerializeDeferred<T extends Record<string, unknown>> = {
  [k in keyof T as T[k] extends Promise<unknown> ? k : T[k] extends NonJsonPrimitive ? never : k]: T[k] extends Promise<
    infer U
  >
    ? Promise<Serialize<U>> extends never
      ? 'wtf'
      : Promise<Serialize<U>>
    : Serialize<T[k]> extends never
      ? k
      : Serialize<T[k]>;
};
export type AppData = any;
type ArbitraryFunction = (...args: any[]) => unknown;
export type Serialize<T> =
  IsAny<T> extends true
    ? any
    : T extends TypedDeferredData<infer U>
      ? SerializeDeferred<U>
      : T extends JsonPrimitive
        ? T
        : T extends NonJsonPrimitive
          ? never
          : T extends {
                toJSON(): infer U;
              }
            ? U
            : T extends []
              ? []
              : T extends [unknown, ...unknown[]]
                ? SerializeTuple<T>
                : T extends ReadonlyArray<infer U>
                  ? (U extends NonJsonPrimitive ? null : Serialize<U>)[]
                  : T extends object
                    ? SerializeObject<UndefinedToOptional<T>>
                    : never;

export type SerializeFrom<T extends AppData | ArbitraryFunction> = Serialize<
  T extends (...args: any[]) => infer Output
    ? Awaited<Output> extends TypedResponse<infer U>
      ? U
      : Awaited<Output>
    : Awaited<T>
>;

export type LoaderArgs = LoaderFunctionArgs;
export type ActionArgs = ActionFunctionArgs;
