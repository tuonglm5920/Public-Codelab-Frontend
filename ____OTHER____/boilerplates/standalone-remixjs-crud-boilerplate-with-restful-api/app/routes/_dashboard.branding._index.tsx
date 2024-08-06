import { LoaderFunctionArgs, TypedResponse, json } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionResponse as ActionDeleteBrandingResponse,
  action as actionDeleteBranding,
} from './_dashboard.branding.$id.delete';
import type {
  ActionResponse as ActionEditBrandingResponse,
  action as actionEditBranding,
} from './_dashboard.branding.$id.edit';
import type {
  ActionResponse as ActionCreateBrandingResponse,
  action as actionCreateBranding,
} from './_dashboard.branding.create';
import { PageErrorBoundary } from '~/components/PageErrorBoundary/PageErrorBoundary';
import { i18nServer } from '~/packages/common/I18n/i18n.server';
import { BrandingFormMutation } from '~/packages/specific/Branding/components/FormMutation/FormMutation';
import { FormSearchNFilter } from '~/packages/specific/Branding/components/Listing/FormSearchNFilter';
import { TableListing } from '~/packages/specific/Branding/components/Listing/TableListing';
import { RecordsPerPage } from '~/packages/specific/Branding/constants/RecordsPerPage';
import { Branding } from '~/packages/specific/Branding/models/Branding';
import { getBrandings } from '~/packages/specific/Branding/services/getBrandings';
import { ListingSearchParams } from '~/packages/specific/Branding/types/ListingSearchParams';
import { lisitngUrlSearchParamsUtils } from '~/packages/specific/Branding/utils/listingUrlSearchParams';
import { Button, Modal, ModalDelete, notification, useWindowReactive } from '~/shared/reactjs';
import { SimpleListingResponse, useListingData } from '~/shared/remixjs/client';
import { updateURLSearchParamsOfBrowserWithoutNavigation } from '~/shared/utilities';
import { fetcherFormData } from '~/utils/functions/formData/fetcherFormData';
import { handleCatchClauseAsMessage } from '~/utils/functions/handleErrors/handleCatchClauseSimple';
import { handleGetMessageToToast } from '~/utils/functions/handleErrors/handleGetMessageToToast';
import { preventRevalidateOnListingPage } from '~/utils/functions/preventRevalidateOnListingPage';

export const loader = async (
  remixRequest: LoaderFunctionArgs,
): Promise<TypedResponse<SimpleListingResponse<Branding>>> => {
  const { request } = remixRequest;
  const t = await i18nServer.getFixedT(request, ['common', 'branding']);
  const { page = 1, pageSize = RecordsPerPage, search, status } = lisitngUrlSearchParamsUtils.decrypt(request);
  try {
    const response = await getBrandings({
      remixRequest,
      page,
      pageSize,
      searcher: {
        status: { operator: 'eq', value: status },
        BrandingName: { operator: 'contains', value: search },
      },
      sorter: {},
    });

    return json({
      info: {
        hits: response.data.hits,
        pagination: {
          totalPages: response.data.pagination.totalPages,
          totalRecords: response.data.pagination.totalRows,
        },
      },
      page: Math.min(page, response.data.pagination.totalPages || 1),
    });
  } catch (error) {
    return json({
      page,
      info: {
        hits: [] as Branding[],
        pagination: { pageSize: 0, totalPages: 1, totalRecords: 0 },
      },
      toastMessageError: handleCatchClauseAsMessage({ error, t }),
    });
  }
};

const FORM_UPDATE = 'FormUpdate';
const FORM_CREATE = 'FormCreate';
export const Page = () => {
  const { t } = useTranslation(['branding']);

  const navigate = useNavigate();

  //#region Listing
  const paramsInUrl = lisitngUrlSearchParamsUtils.decrypt(lisitngUrlSearchParamsUtils.getUrlSearchParams().toString());
  const fetcherData = useFetcher<typeof loader>();
  const loaderData = useLoaderData<typeof loader>();

  const handleRequest = (params: ListingSearchParams) => {
    const searchParamsToLoader = lisitngUrlSearchParamsUtils.encrypt({
      ...paramsInUrl,
      ...params,
    });
    fetcherData.load('/branding' + searchParamsToLoader);
    updateURLSearchParamsOfBrowserWithoutNavigation(searchParamsToLoader);
  };

  const { data, isFetchingList } = useListingData({
    fetcherData: fetcherData,
    loaderData: loaderData,
    getNearestPageAvailable: page => handleRequest({ page }),
  });
  useWindowReactive({ enabled: !isFetchingList, callback: () => handleRequest({}) });
  //#endregion

  //#region Delete
  const deleteBrandingFetcher = useFetcher<typeof actionDeleteBranding>();

  const [isOpenModalDelete, setIsOpenModalDelete] = useState<Branding | null>(null);

  const isDeleting = useMemo(() => {
    return deleteBrandingFetcher.state === 'loading' || deleteBrandingFetcher.state === 'submitting';
  }, [deleteBrandingFetcher]);

  useEffect(() => {
    if (deleteBrandingFetcher.data && deleteBrandingFetcher.state === 'idle') {
      const response = deleteBrandingFetcher.data as ActionDeleteBrandingResponse;
      if (response.hasError) {
        notification.error({
          message: t('branding:delete_error').toString(),
          description: handleGetMessageToToast(t, response),
        });
      } else {
        notification.success({
          message: t('branding:delete_success').toString(),
          description: '',
        });
        handleRequest({});
        setIsOpenModalDelete(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBrandingFetcher.state]);
  //#endregion

  //#region Create
  const createServiceFetcher = useFetcher<typeof actionCreateBranding>();

  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);

  const isCreating = useMemo(() => {
    return createServiceFetcher.state === 'loading' || createServiceFetcher.state === 'submitting';
  }, [createServiceFetcher]);

  useEffect(() => {
    if (createServiceFetcher.data && createServiceFetcher.state === 'idle') {
      const response = createServiceFetcher.data as ActionCreateBrandingResponse;
      if (response.hasError) {
        notification.error({
          message: t('branding:create_error').toString(),
          description: handleGetMessageToToast(t, response),
        });
      } else {
        notification.success({
          message: t('branding:create_success').toString(),
          description: '',
        });
        handleRequest({});
        setIsOpenModalCreate(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createServiceFetcher.state]);

  //#endregion

  //#region Edit
  const editBrandingFetcher = useFetcher<typeof actionEditBranding>();

  const [isOpenModalEdit, setIsOpenModalEdit] = useState<Branding | null>(null);

  const isEdting = useMemo(() => {
    return editBrandingFetcher.state === 'loading' || editBrandingFetcher.state === 'submitting';
  }, [editBrandingFetcher]);

  useEffect(() => {
    if (editBrandingFetcher.data && editBrandingFetcher.state === 'idle') {
      const response = editBrandingFetcher.data as ActionEditBrandingResponse;
      if (response.hasError) {
        notification.error({
          message: t('branding:edit_error').toString(),
          description: handleGetMessageToToast(t, response),
        });
      } else {
        notification.success({
          message: t('branding:edit_success').toString(),
          description: '',
        });
        handleRequest({});
        setIsOpenModalEdit(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editBrandingFetcher.state]);
  //#endregion

  return (
    <>
      <div className="flex h-full flex-col gap-3">
        <Button
          onClick={() => {
            getBrandings({ page: 1, pageSize: 10, searcher: {}, sorter: {} }).then(console.log);
          }}
        >
          Fetch client & auto refresh token at server
        </Button>
        <Button onClick={() => navigate('/branding/create')} color="primary">
          Create new but in a page
        </Button>
        <FormSearchNFilter
          defaultValues={{
            search: paramsInUrl.search,
            status: paramsInUrl.status,
          }}
          onRefresh={() => handleRequest({})}
          onChange={values => {
            handleRequest({
              ...values,
              status: values.status,
              search: values.search,
              page: 1,
            });
          }}
        />
        <TableListing
          isLoading={isFetchingList}
          currentPage={data.page}
          pageSize={paramsInUrl.pageSize ?? RecordsPerPage}
          totalRecords={data.info.pagination.totalRecords}
          data={data.info.hits}
          onChange={(page, pageSize) => handleRequest({ page, pageSize })}
          onCreate={() => setIsOpenModalCreate(true)}
          onEdit={record => setIsOpenModalEdit(record)}
          onDelete={record => setIsOpenModalDelete(record)}
        />
      </div>
      <Modal
        open={!!isOpenModalEdit}
        title={t('branding:edit_title').toString()}
        confirmLoading={isEdting}
        okButtonProps={{ form: FORM_UPDATE, htmlType: 'submit' }}
        onCancel={() => setIsOpenModalEdit(null)}
        onOk={() => {
          /** empty */
        }}
      >
        <BrandingFormMutation
          // statusUpdatable
          fieldsError={editBrandingFetcher.data?.fieldsError}
          uid={FORM_UPDATE}
          defaultValues={{
            code: isOpenModalEdit?.brandingCode,
            status: isOpenModalEdit?.status,
            name: isOpenModalEdit?.brandingName,
          }}
          onSubmit={values => {
            editBrandingFetcher.submit(fetcherFormData.encrypt(values), {
              method: 'put',
              action: `/branding/${isOpenModalEdit?._id}/edit`,
            });
          }}
          isSubmiting={isEdting}
        />
      </Modal>

      <Modal
        open={isOpenModalCreate}
        title={t('branding:create_title').toString()}
        confirmLoading={isCreating}
        okButtonProps={{ form: FORM_CREATE, htmlType: 'submit' }}
        onCancel={() => setIsOpenModalCreate(false)}
        okText={t('branding:create')}
        onOk={() => {
          /** empty */
        }}
      >
        <BrandingFormMutation
          fieldsError={createServiceFetcher.data?.fieldsError}
          uid={FORM_CREATE}
          defaultValues={{
            status: 'ACTIVE',
            code: undefined,
            name: undefined,
          }}
          onSubmit={values => {
            createServiceFetcher.submit(fetcherFormData.encrypt(values), {
              method: 'post',
              action: '/branding/api/create',
            });
          }}
          isSubmiting={isCreating}
        />
      </Modal>

      <ModalDelete
        open={!!isOpenModalDelete}
        title={t('branding:delete_title').toString()}
        description={t('branding:delete_description').toString()}
        confirmLoading={isDeleting}
        onCancel={() => setIsOpenModalDelete(null)}
        onOk={() => {
          deleteBrandingFetcher.submit({}, { method: 'delete', action: `/branding/${isOpenModalDelete?._id}/delete` });
        }}
      />
    </>
  );
};

export const shouldRevalidate = preventRevalidateOnListingPage;

export const ErrorBoundary = PageErrorBoundary;

export default Page;
