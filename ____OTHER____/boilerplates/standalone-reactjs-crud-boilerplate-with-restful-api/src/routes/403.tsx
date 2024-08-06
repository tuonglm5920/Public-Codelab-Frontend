import { useTranslation } from 'react-i18next';
import { useNavigate } from '~/overrides/remix';
import { Button, Result } from '~/shared/reactjs';

export const Page = () => {
  const { t } = useTranslation(['page403']);
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title={t('page403:title')}
      subTitle={t('page403:description')}
      extra={
        <Button onClick={() => navigate('/')} color="primary">
          {t('page403:back_to_home')}
        </Button>
      }
    />
  );
};

export default Page;
