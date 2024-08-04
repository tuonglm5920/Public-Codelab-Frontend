import { TFunction } from 'i18next';
import { handleGetMessageToToast } from './handleGetMessageToToast';
import { handleNativeError } from './handleNativeError';
import { handleServiceException } from './handleServiceException';
import { handleUnknownError } from './handleUnknownError';
import { json } from '~/overrides/remix';
import { redirect } from '~/overrides/remix';
import { SimpleResponse } from '~/overrides/remixjs/client';
import { SessionExpiredFullUrl } from '~/packages/common/Auth/constants/SessionExpired';
import { StringMappingToStatusCode } from '~/services/constants/StringMappingToStatusCode';
import { ServiceException } from '~/services/utils/ServiceException';
import { AnyRecord } from '~/shared/typescript-utilities';
import { isBrowser } from '~/shared/utilities';

export const handleCatchClauseAsSimpleResponse = <Model = any>(error: unknown) => {
  if (error instanceof ServiceException) {
    if (error.cause.code === StringMappingToStatusCode['HTTP_UNAUTHORIZED']) {
      return redirect(SessionExpiredFullUrl);
    }
    return json(...handleServiceException<Model>(error));
  } else if (error instanceof Error) {
    return json(...handleNativeError<Model>(error));
  }
  return json(...handleUnknownError<Model>(error));
};

interface HandleCatchClauseAsMessage {
  t: TFunction<any>;
  error: unknown;
}
export const handleCatchClauseAsMessage = <Model = any, FieldsError extends AnyRecord | undefined = undefined>({
  error,
  t,
}: HandleCatchClauseAsMessage) => {
  let simpleResponse: SimpleResponse<Model, FieldsError>;
  if (error instanceof ServiceException) {
    if (error.cause.code === StringMappingToStatusCode['HTTP_UNAUTHORIZED']) {
      if (isBrowser()) {
        window.location.replace(SessionExpiredFullUrl);
      } else {
        throw redirect(SessionExpiredFullUrl);
      }
    }
    simpleResponse = handleServiceException<Model>(error)[0];
  } else if (error instanceof Error) {
    simpleResponse = handleNativeError<Model>(error)[0];
  } else {
    simpleResponse = handleUnknownError<Model>(error)[0];
  }
  return handleGetMessageToToast(t, simpleResponse);
};
