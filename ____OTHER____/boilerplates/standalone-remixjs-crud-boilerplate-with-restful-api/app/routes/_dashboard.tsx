import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { PageErrorBoundary } from '~/components/PageErrorBoundary/PageErrorBoundary';
import { DashboardLayout } from '~/layouts/DashboardLayout/DashboardLayout';
import { SessionExpiredFullUrl } from '~/packages/common/Auth/constants/SessionExpired';
import { SessionData } from '~/packages/common/Auth/models/SessionData';
import { getProfile } from '~/packages/common/Auth/services/getProfile';
import { authSessionStorage } from '~/packages/common/Auth/utils/sessionStorage';
import { fetchApiClient } from '~/utils/fetchApi/fetchApi.client';

export interface LoaderResponse {
  sessionData: SessionData;
}

export const loader = async (remixRequest: LoaderFunctionArgs) => {
  const { request } = remixRequest;
  const sessionData = await authSessionStorage.guard({ request });
  try {
    const response = await getProfile({ remixRequest });
    sessionData.set('profile', {
      avatar: '',
      fullName: `Latest ${response.data.member.memberName} - ${Date.now()}`,
      role: response.data.member.role,
    });
    const headers = await authSessionStorage.commitSessionAsHeaders(sessionData);

    return json({ sessionData: sessionData.data }, { headers });
  } catch (error) {
    console.log(error);
    return redirect(SessionExpiredFullUrl);
  }
};

const DashboardLayoutRoot = () => {
  const { sessionData } = useLoaderData<typeof loader>();

  useEffect(() => {
    fetchApiClient.setAccessToken = () => sessionData.accessToken ?? '';
    fetchApiClient.setRefreshToken = () => sessionData.refreshToken;
  }, [sessionData]);

  if (sessionData) {
    return <DashboardLayout sessionData={sessionData} />;
  }
  return <PageErrorBoundary />;
};

export default DashboardLayoutRoot;
