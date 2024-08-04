import { useNavigate, useRouteError } from '@remix-run/react';
import { useEffect } from 'react';

export const PageErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('PageErrorBoundary', error);
    navigate('/500');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return null;
};
