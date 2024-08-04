import type { RTHandleError } from './@types/RemixJsonFunction';
import { SimpleResponse } from '~/types/SimpleResponse';

export const handleNativeError = <Model = any>(error: Error): RTHandleError<SimpleResponse<Model, undefined>> => {
  // console.log('handleNativeError', error);
  return [
    {
      message: `[NativeError]: ${error}`,
      hasError: true,
      info: undefined,
    },
    { status: 400 },
  ];
};
