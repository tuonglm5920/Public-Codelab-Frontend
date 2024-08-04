import { ActionFunctionArgs, LoaderFunctionArgs } from '~/overrides/remix';
import { ResponseDetailSuccess, ResponseFailure } from '~/services/types/Response';
import { isResponseError } from '~/services/utils/isResponseError';
import { ServiceException } from '~/services/utils/ServiceException';
import { fetchApiClient } from '~/utils/fetchApi/fetchApi.client';
import { fetchApiServer } from '~/utils/fetchApi/fetchApi.server';

export interface CreateBranding {
  remixRequest?: LoaderFunctionArgs | ActionFunctionArgs;
  brandingCode: string;
  brandingName: string;
  status: string;
}

interface ResponseData {
  _id: string;
  merchantCode: string;
  brandingCode: string;
  brandingName: string;
  createdBy: string;
  updatedBy: string;
  status: 'ACTIVE' | 'DEACTIVE';
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

export const createBranding = async ({ remixRequest, brandingCode, brandingName, status }: CreateBranding) => {
  const fetch = remixRequest ? await fetchApiServer(remixRequest) : fetchApiClient;

  const response = await fetch.request<ResponseDetailSuccess<ResponseData> | ResponseFailure>({
    url: `/merchants/category/branding`,
    method: 'POST',
    data: { brandingCode, brandingName, status },
  }).axiosPromise;

  if (isResponseError(response)) {
    throw new ServiceException(response.data.message, response.data);
  }
  return response.data as ResponseDetailSuccess<ResponseData>;
};
