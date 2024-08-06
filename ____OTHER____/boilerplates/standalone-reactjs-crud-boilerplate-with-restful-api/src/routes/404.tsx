import { useTranslation } from 'react-i18next';
import { useNavigate } from '~/overrides/remix';
import { Button, Result } from '~/shared/reactjs';

export const Page = () => {
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

export default Page;
