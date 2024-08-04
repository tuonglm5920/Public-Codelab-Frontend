import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActionFunctionArgs } from '~/overrides/remix';
import { PageErrorBoundary } from '~/components/PageErrorBoundary/PageErrorBoundary';
import { json } from '~/overrides/remix';
import { useActionData, useNavigation, useSearchParams } from '~/overrides/remix';
import { getValidatedFormData } from '~/overrides/remix-hook-form';
import { SimpleResponse } from '~/overrides/remixjs/client';
import { FormLogin, FormLoginValues } from '~/packages/common/Auth/components/FormLogin';
import { SessionExpiredParams } from '~/packages/common/Auth/constants/SessionExpired';
import { getFormLoginResolver } from '~/packages/common/Auth/constants/zodResolver';
import { login } from '~/packages/common/Auth/services/login';
import { authSessionStorage } from '~/packages/common/Auth/utils/sessionStorage';
import { i18nServer } from '~/packages/common/I18n/i18n';
import { notification } from '~/shared/reactjs';
import { updateURLSearchParamsOfBrowserWithoutNavigation } from '~/shared/utilities';
import { handleCatchClauseAsSimpleResponse } from '~/utils/functions/handleErrors/handleCatchClauseSimple';
import { handleFormResolverError } from '~/utils/functions/handleErrors/handleFormResolverError';
import { handleGetMessageToToast } from '~/utils/functions/handleErrors/handleGetMessageToToast';

export type ActionResponse = SimpleResponse<undefined, FormLoginValues>;
export const action = async (remixRequest: ActionFunctionArgs) => {
  const { request } = remixRequest;
  const t = await i18nServer.getFixedT(request, ['common', 'auth']);

  const { data, errors } = await getValidatedFormData<FormLoginValues>(request, getFormLoginResolver(t));

  const redirectTo = new URL(request.url).searchParams.get('redirectTo');
  try {
    if (data) {
      const loginResponse = await login({ password: data.password, email: data.email, remixRequest });
      return authSessionStorage.createSession({
        request,
        redirectTo: redirectTo ?? '/dashboard',
        remember: data?.remember ?? false,
        sessionData: {
          accessToken: [loginResponse.data.payload.type, loginResponse.data.payload.accessToken].join(' '),
          refreshToken: loginResponse.data.payload.refreshToken,
          profile: {
            avatar: '',
            fullName: loginResponse.data.member.memberName,
            role: loginResponse.data.member.role,
          },
        },
      });
    }
    return json(...handleFormResolverError(errors));
  } catch (error) {
    console.log(error);
    return handleCatchClauseAsSimpleResponse(error);
  }
};

export const Page = () => {
  const { t } = useTranslation(['auth']);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [currentUrlSearchParams] = useSearchParams();

  const isSubmiting = useMemo(() => {
    return navigation.state === 'loading' || navigation.state === 'submitting';
  }, [navigation.state]);

  useEffect(() => {
    if (actionData?.hasError) {
      notification.error({
        message: t('auth:login_error'),
        description: handleGetMessageToToast(t, actionData),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    console.log(111);
    if (currentUrlSearchParams.get(SessionExpiredParams) !== null) {
      notification.error({
        message: t('auth:session_expired'),
        description: '',
      });
      currentUrlSearchParams.delete(SessionExpiredParams);
      updateURLSearchParamsOfBrowserWithoutNavigation(currentUrlSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrlSearchParams]);

  return (
    <>
      <h1 className="mb-6 text-[48px] font-semibold text-neutral-700">{t('auth:login')}</h1>
      <FormLogin loading={isSubmiting} />
    </>
  );
};

export const ErrorBoundary = PageErrorBoundary;

export default Page;
