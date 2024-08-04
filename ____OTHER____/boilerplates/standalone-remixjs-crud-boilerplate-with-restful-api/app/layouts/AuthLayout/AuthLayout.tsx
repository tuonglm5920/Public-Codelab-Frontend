import { Outlet } from '@remix-run/react';
import { Suspense } from 'react';

export const AuthLayout = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
};
