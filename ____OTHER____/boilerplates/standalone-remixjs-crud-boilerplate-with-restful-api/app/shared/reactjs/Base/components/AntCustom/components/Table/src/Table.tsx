import { PaginationProps as AntPaginationProps, Table as AntTable, TableProps as AntTableProps } from 'antd';
import { ColumnGroupType as AntColumnGroupType, ColumnType as AntColumnType } from 'antd/es/table';
import classNames from 'classnames';
import { sum } from 'ramda';
import { ReactNode, useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import { useInitializeContext } from '../../../base';
import { AnyRecord } from '~/shared/typescript-utilities';
import { pluralize } from '~/shared/utilities';
import './styles.css';

type TakeBaseProps = 'align' | 'title' | 'render' | 'className' | 'ellipsis' | 'fixed' | 'onCell';

type AntColumnTypeOrGroupColumnType<RecordType extends Record<string, any>> =
  | Pick<AntColumnGroupType<RecordType>, TakeBaseProps | 'children'>
  | Pick<AntColumnType<RecordType>, TakeBaseProps>;

export interface CellConfig {
  colSpan?: number;
  className?: string;
  onClick?: () => void;
}

export type ColumnType<RecordType extends Record<string, any>> = AntColumnTypeOrGroupColumnType<RecordType> & {
  width: number;
  hidden?: boolean;
  onCell?: (record: RecordType, index: number) => CellConfig;
};

export interface Props<RecordType extends AnyRecord>
  extends Pick<
    AntTableProps<RecordType>,
    | 'bordered'
    | 'className'
    | 'dataSource'
    | 'expandable'
    | 'direction'
    | 'indentSize'
    | 'loading'
    | 'rowKey'
    | 'summary'
    | 'size'
  > {
  /** The current page number. */
  currentPage: number;
  /** The number of items per page. */
  pageSize: number;
  /** The total number of records. */
  totalRecords: number;
  /** Callback function triggered when the page or pageSize changes. */
  onChange?: (page: number, pageSize: number) => void;
  /** Function to generate a plural label for the total count. */
  plural?: (params: { from: number; to: number }) => string;
  /** Function to generate a singular label for the total count. */
  singular?: (params: { from: number; to: number }) => string;
  /** The pagination mode. */
  paginationMode?: 'sticky' | 'none';
  /** An array of columns to be displayed in the table. */
  columns?: ColumnType<RecordType>[];
  /** Whether to disable pagination. */
  nonePagination?: boolean;
  /** Whether to show the size changer in pagination. */
  showSizeChanger?: boolean;
  /** Custom CSS class for the pagination. */
  paginationClassName?: string;
  /** Locale object for the pagination. */
  locale?: AntPaginationProps['locale'];
  /** Options for the size changer dropdown. */
  sizeChangerOptions?: number[];
}

/**
 * Table component that extends the functionality of the Ant Design Table component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props<RecordType>} props - The properties for the Table component.
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.pageSize - The number of items per page.
 * @param {number} props.totalRecords - The total number of records.
 * @param {Function} [props.onChange] - Callback function triggered when the page or pageSize changes.
 * @param {Function} [props.plural] - Function to generate a plural label for the total count.
 * @param {Function} [props.singular] - Function to generate a singular label for the total count.
 * @param {string} [props.paginationMode='sticky'] - The pagination mode.
 * @param {Array} [props.columns=[]] - An array of columns to be displayed in the table.
 * @param {boolean} [props.nonePagination] - Whether to disable pagination.
 * @param {boolean} [props.showSizeChanger=false] - Whether to show the size changer in pagination.
 * @param {string} [props.paginationClassName] - Custom CSS class for the pagination.
 * @param {Object} [props.locale] - Locale object for the pagination.
 * @param {Array} [props.sizeChangerOptions=[]] - Options for the size changer dropdown.
 * @returns {ReactNode} The rendered Table component.
 */
export const Table = <RecordType extends AnyRecord>({
  currentPage,
  pageSize,
  totalRecords,
  bordered = true,
  onChange,
  plural = (): string => '',
  singular = (): string => '',
  paginationMode = 'sticky',
  columns = [],
  nonePagination,
  className,
  dataSource,
  expandable,
  direction,
  indentSize,
  loading,
  rowKey,
  summary,
  size,
  showSizeChanger = false,
  paginationClassName,
  locale,
  sizeChangerOptions = [],
}: Props<RecordType>): ReactNode => {
  useInitializeContext();
  const from = Math.max((currentPage - 1) * pageSize, 0) + 1;
  const to = Math.min(currentPage * pageSize, totalRecords);

  const columns_ = useMemo(() => {
    return columns.filter(item => !item.hidden);
  }, [columns]);

  return (
    <AntTable
      tableLayout="auto"
      size={size}
      summary={summary}
      rowKey={rowKey}
      loading={loading}
      indentSize={indentSize}
      direction={direction}
      dataSource={dataSource}
      expandable={expandable}
      columns={columns_ as AntTableProps['columns']}
      className={classNames(
        'Table__container',
        paginationMode === 'sticky' ? 'Table--paginationSticky' : 'Table--paginationNone',
        className,
      )}
      scroll={{ x: sum(columns_.map(item => item.width)) }}
      bordered={bordered}
      pagination={
        nonePagination
          ? false
          : {
              className: classNames('Table__pagination', paginationClassName),
              showLessItems: true,
              showSizeChanger: showSizeChanger,
              total: totalRecords,
              current: currentPage,
              simple: false,
              hideOnSinglePage: false,
              pageSizeOptions: sizeChangerOptions,
              locale,
              pageSize,
              onChange,
              showTotal: (total): ReactNode => {
                if (!total) {
                  return null;
                }
                return (
                  <Highlighter
                    highlightClassName="Table__text-range--highlight"
                    searchWords={[/\d+/g]}
                    textToHighlight={pluralize({
                      count: totalRecords,
                      singular: singular({ from, to }),
                      plural: plural({ from, to }),
                    })}
                  />
                );
              },
            }
      }
    />
  );
};
