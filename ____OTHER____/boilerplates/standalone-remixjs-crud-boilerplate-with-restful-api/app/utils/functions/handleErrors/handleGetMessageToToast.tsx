import type { SerializeFrom } from '@remix-run/server-runtime';
import type { TFunction } from 'i18next';
import { StatusCodeMappingToString } from '~/services/constants/StringMappingToStatusCode';
import { SimpleResponse } from '~/types/SimpleResponse';

export const handleGetMessageToToast = (
  t: TFunction<any[]>,
  actionResponse: SimpleResponse<any, any> | SerializeFrom<SimpleResponse<any, any>>,
) => {
  const { hasError, errorCode } = actionResponse;
  if (!hasError) {
    return undefined;
  }
  if (errorCode) {
    return t(`error_message:${StatusCodeMappingToString[errorCode]}`);
  }
  return t(`error_message:UNKNOWN`);
};
