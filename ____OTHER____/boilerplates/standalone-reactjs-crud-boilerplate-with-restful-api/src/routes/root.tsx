import { FC, Suspense } from 'react';
import { Outlet, ScrollRestoration, useNavigation } from '~/overrides/remix';
import { FixedProgressLoader, Notification, usePrevious } from '~/shared/reactjs';

export const Page: FC = () => {
  const navigation = useNavigation();
  const prevFormAction = usePrevious(navigation);

  return (
    <Suspense fallback={null}>
      <Notification />
      <FixedProgressLoader
        hidden={!!prevFormAction?.formAction || !!navigation.formAction}
        done={navigation.state === 'idle'}
      />
      <Outlet />
      <ScrollRestoration />
    </Suspense>
  );
};

export default Page;
