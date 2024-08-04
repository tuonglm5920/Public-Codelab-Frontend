import type { TFunction } from 'i18next';
import type { SerializeFrom } from '~/overrides/remix';
import { SimpleResponse } from '~/overrides/remixjs/client';
import { StatusCodeMappingToString } from '~/services/constants/StringMappingToStatusCode';

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
