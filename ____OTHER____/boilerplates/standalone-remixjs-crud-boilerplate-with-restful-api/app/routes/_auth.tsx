import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { isEmpty } from 'ramda';
import { AuthLayout } from '~/layouts/AuthLayout/AuthLayout';
import { authSessionStorage } from '~/packages/common/Auth/utils/sessionStorage';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authSessionStorage.getSession(request);
  const { searchParams } = new URL(request.url);
  if (!isEmpty(session.data)) {
    throw redirect(searchParams.get('redirectTo') ?? '/');
  }
  return null;
};

const AuthLayoutRoot = () => {
  return <AuthLayout />;
};

export default AuthLayoutRoot;
