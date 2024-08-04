import { RTHandleError } from './@types/RemixJsonFunction';
import { SimpleResponse } from '~/overrides/remixjs/client';

export const handleUnknownError = <Model = any>(error: unknown): RTHandleError<SimpleResponse<Model, undefined>> => {
  console.log('handleUnknownError', error);
  let instanceName = 'Unable to determine the instance name';
  try {
    throw error;
  } catch (error) {
    const stackTrace = (error as Error).stack;
    if (stackTrace) {
      const instanceNameMatch = /at\s+(\w+)\./.exec(stackTrace);
      if (instanceNameMatch?.[1]) {
        instanceName = instanceNameMatch[1];
      }
    }
  }

  return [
    {
      message: `[UnknownError]: ${instanceName}`,
      hasError: true,
      info: undefined,
    },
    { status: 400 },
  ];
};
