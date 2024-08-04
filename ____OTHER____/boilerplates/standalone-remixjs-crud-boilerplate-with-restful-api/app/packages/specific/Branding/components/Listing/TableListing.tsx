import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getStatusMappingToLabels } from '../../constants/StatusMappingToLabels';
import { StatusMappingToTagColor } from '../../constants/StatusMappingToTagColor';
import { Branding } from '../../models/Branding';
import { HeaderListing } from '~/components/HeaderListing/HeaderListing';
import { TableColumnType, TableActions, Table } from '~/shared/reactjs';
import { Tag } from '~/shared/reactjs';
import { dayjs } from '~/shared/utilities';

interface Props {
  isLoading: boolean;
  data: Branding[];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  onChange?: (page: number, pageSize: number) => void;
  onEdit?: (record: Branding) => void;
  onDelete?: (record: Branding) => void;
  onCreate?: () => void;
}

export const TableListing = ({
  isLoading,
  data,
  currentPage,
  pageSize,
  onEdit,
  onDelete,
  onCreate,
  totalRecords,
  onChange,
}: Props) => {
  const { t } = useTranslation(['common', 'branding'] as const);

  const StatusMappingToLabels = useMemo(() => {
    return getStatusMappingToLabels(t);
  }, [t]);

  const columns: Array<TableColumnType<Branding>> = [
    {
      title: '#',
      width: 48,
      align: 'center',
      render: (_, __, index) => pageSize * (currentPage - 1) + index + 1,
    },
    {
      title: t('branding:code'),
      width: 320,
      render: (_, record) => {
        return <div>{record.brandingCode}</div>;
      },
    },
    {
      title: t('branding:name'),
      width: 320,
      render: (_, record) => record.brandingName,
    },
    {
      title: t('branding:status'),
      width: 160,
      align: 'center',
      render: (_, record) => {
        return <Tag color={StatusMappingToTagColor[record.status]}>{StatusMappingToLabels[record.status]}</Tag>;
      },
    },
    {
      title: t('branding:updated_by'),
      width: 320,
      render: (_, record) => {
        return record.updatedBy || record.createdBy;
      },
    },
    {
      title: t('branding:updated_at'),
      width: 160,
      render: (_, record) => {
        return dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm');
      },
    },
    {
      title: t('branding:action'),
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <TableActions
            items={[
              {
                key: '1',
                label: t('branding:edit'),
                icon: <EditOutlined />,
                onClick: () => onEdit?.(record),
              },
              {
                key: '2',
                danger: true,
                label: <div>{t('branding:delete')}</div>,
                icon: <DeleteOutlined />,
                onClick: () => onDelete?.(record),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <HeaderListing
        onCreate={onCreate}
        title={t('branding:brandings')}
        createBtn={t('branding:create')}
        exportBtn={t('branding:export_data')}
        importBtn={t('branding:import_data')}
      />
      <Table
        rowKey={record => record._id}
        onChange={onChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalRecords={totalRecords}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        plural={({ from, to }) => t('common:showing_range_results', { from, to, total: totalRecords })}
        singular={({ from, to }) => t('common:showing_range_result', { from, to, total: totalRecords })}
        paginationClassName="!-mx-4 md:!-mx-8"
      />
    </div>
  );
};
