import { BellOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Dropdown, Empty } from '~/shared/reactjs';
import { humanizeTimeago } from '~/shared/utilities';

const data = [{ id: '_1', content: 'Welcome to ReactJS CRUD boilerplate with Restful API', createdAt: Date.now() }];

export const Notification = () => {
  const { t } = useTranslation(['dashboard_layout', 'common']);

  return (
    <Dropdown
      arrow={{ pointAtCenter: true }}
      footer={
        <div className="flex justify-center">
          <Button type="link">{t('dashboard_layout:mark_all_as_read')}</Button>
        </div>
      }
      items={[
        {
          key: '1',
          disabled: true,
          className: '!cursor-default w-[420px] max-w-screen',
          label: (
            <div className="grid grid-cols-1 py-3 text-center">
              <Empty />
              <div>{t('common:no_data')}</div>
            </div>
          ),
        },
        ...data.map(item => ({
          key: item.id,
          className: 'w-[420px] max-w-screen',
          label: (
            <div className="grid grid-cols-1 py-3">
              <div className="font-medium">{item.content}</div>
              <div className="text-xs">{humanizeTimeago({ date: item.createdAt })}</div>
            </div>
          ),
        })),
      ]}
    >
      <Badge content={5} className="cursor-pointer">
        <BellOutlined className="text-xl" />
      </Badge>
    </Dropdown>
  );
};
