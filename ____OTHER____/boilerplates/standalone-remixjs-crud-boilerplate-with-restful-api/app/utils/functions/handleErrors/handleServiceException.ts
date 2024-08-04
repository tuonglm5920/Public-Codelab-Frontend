import { RTHandleError } from './@types/RemixJsonFunction';
import { ServiceException } from '~/services/utils/ServiceException';
import { SimpleResponse } from '~/types/SimpleResponse';

export const handleServiceException = <Model = any>(
  error: ServiceException,
): RTHandleError<SimpleResponse<Model, undefined>> => {
  // console.log('handleServiceException', error);
  const response = error.cause;
  return [
    {
      message: `[ServiceException]: ${error}`,
      hasError: true,
      errorCode: response?.code,
      info: undefined,
    },
    { status: 400 },
  ];
};
