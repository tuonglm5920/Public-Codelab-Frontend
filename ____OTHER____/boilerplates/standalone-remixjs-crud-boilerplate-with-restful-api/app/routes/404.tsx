import { useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Button, Result } from '~/shared/reactjs';

const Page404 = () => {
  const { t } = useTranslation(['page404']);
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title={t('page404:title')}
      subTitle={t('page404:description')}
      extra={
        <Button onClick={() => navigate('/')} color="primary">
          {t('page404:back_to_home')}
        </Button>
      }
    />
  );
};

export default Page404;
