import { ActionFunctionArgs, LoaderFunctionArgs } from '~/overrides/remix';
import { ResponseFailure, ResponseListSuccess } from '~/services/types/Response';
import { Sorter, Searcher } from '~/services/types/SearchParams';
import { getSearchParams } from '~/services/utils/getSearchParams';
import { getSortParams } from '~/services/utils/getSortParams';
import { isResponseError } from '~/services/utils/isResponseError';
import { ServiceException } from '~/services/utils/ServiceException';
import { fetchApiClient } from '~/utils/fetchApi/fetchApi.client';
import { fetchApiServer } from '~/utils/fetchApi/fetchApi.server';

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

interface GetBrandings {
  remixRequest?: LoaderFunctionArgs | ActionFunctionArgs;
  page: number;
  pageSize: number;
  sorter: Sorter<ResponseData>;
  searcher: Searcher<ResponseData>;
}
export const getBrandings = async ({ remixRequest, page, pageSize, searcher, sorter }: GetBrandings) => {
  const fetch = remixRequest ? await fetchApiServer(remixRequest) : fetchApiClient;

  const response = await fetch.request<ResponseListSuccess<ResponseData> | ResponseFailure>({
    url: '/merchants/category/branding',
    params: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      ...getSortParams(sorter),
      ...getSearchParams(searcher),
    },
  }).axiosPromise;

  if (isResponseError(response)) {
    throw new ServiceException(response.data.message, response.data);
  }
  return response.data as ResponseListSuccess<ResponseData>;
};
