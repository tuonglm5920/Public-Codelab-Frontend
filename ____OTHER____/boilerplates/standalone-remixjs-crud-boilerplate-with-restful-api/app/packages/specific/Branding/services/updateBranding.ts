import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { ResponseDetailSuccess, ResponseFailure } from '~/services/types/Response';
import { isResponseError } from '~/services/utils/isResponseError';
import { ServiceException } from '~/services/utils/ServiceException';
import { fetchApiClient } from '~/utils/fetchApi/fetchApi.client';
import { fetchApiServer } from '~/utils/fetchApi/fetchApi.server';

export interface UpdateBranding {
  remixRequest?: LoaderFunctionArgs | ActionFunctionArgs;
  brandingCode: string;
  brandingName: string;
  status: string;
  _id: string;
}

interface ResponseData {}

export const updateBranding = async ({ remixRequest, brandingCode, brandingName, status, _id }: UpdateBranding) => {
  const fetch = remixRequest ? await fetchApiServer(remixRequest) : fetchApiClient;

  const response = await fetch.request<ResponseDetailSuccess<ResponseData> | ResponseFailure>({
    url: `/merchants/category/branding/${_id}`,
    method: 'PUT',
    data: {
      brandingCode,
      brandingName,
      status,
    },
  }).axiosPromise;

  if (isResponseError(response)) {
    throw new ServiceException(response.data.message, response.data);
  }
  return response.data as ResponseDetailSuccess<ResponseData>;
};
