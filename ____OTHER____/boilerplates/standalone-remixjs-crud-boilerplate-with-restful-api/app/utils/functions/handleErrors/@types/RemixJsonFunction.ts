import type { TypedResponse } from '@remix-run/server-runtime';

export type RemixJsonFunction<Data> = (_data: Data, _init?: number | ResponseInit) => TypedResponse<Data>;
export type RTHandleError<Data> = Parameters<RemixJsonFunction<Data>>;
