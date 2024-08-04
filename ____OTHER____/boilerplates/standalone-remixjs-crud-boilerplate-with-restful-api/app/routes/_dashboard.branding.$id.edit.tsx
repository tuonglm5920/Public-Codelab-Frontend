import { ActionFunctionArgs, TypedResponse, json, redirect } from '@remix-run/node';
import { validateFormData } from 'remix-hook-form';
import { PageErrorBoundary } from '~/components/PageErrorBoundary/PageErrorBoundary';
import { i18nServer } from '~/packages/common/I18n/i18n.server';
import {
  BrandingFormMutationProps,
  BrandingFormMutationValues,
} from '~/packages/specific/Branding/components/FormMutation/FormMutation';
import { getFormMutationResolver } from '~/packages/specific/Branding/components/FormMutation/zodResolver';
import { Branding } from '~/packages/specific/Branding/models/Branding';
import { updateBranding } from '~/packages/specific/Branding/services/updateBranding';
import { SimpleResponse } from '~/types/SimpleResponse';
import { fetcherFormData } from '~/utils/functions/formData/fetcherFormData';
import { handleCatchClauseAsSimpleResponse } from '~/utils/functions/handleErrors/handleCatchClauseSimple';
import { handleFormResolverError } from '~/utils/functions/handleErrors/handleFormResolverError';

export type ActionResponse = SimpleResponse<Pick<Branding, '_id'>, BrandingFormMutationProps['fieldsError']>;
export const action = async (remixRequest: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> => {
  const { request, params } = remixRequest;
  if (!params['id']) {
    return redirect('/branding');
  }
  try {
    const t = await i18nServer.getFixedT(request, ['common', 'branding'] as const);
    const { errors, data } = await validateFormData<BrandingFormMutationValues>(
      await fetcherFormData.decrypt(request),
      getFormMutationResolver(t),
    );
    if (data) {
      await updateBranding({
        remixRequest,
        brandingCode: data.code,
        brandingName: data.name,
        status: data.status,
        _id: params['id'],
      });

      return json({
        hasError: false,
        message: 'Saved',
        info: undefined,
      });
    }
    return json(...handleFormResolverError(errors));
  } catch (error) {
    return handleCatchClauseAsSimpleResponse(error);
  }
};

export const ErrorBoundary = PageErrorBoundary;
