import { Breadcrumb as AntBreadcrumb, BreadcrumbProps as AntBreadcrumbProps } from 'antd';
import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import './styles.css';
import { useInitializeContext } from '../../../base';

export interface Props extends Pick<AntBreadcrumbProps, 'separator' | 'className'> {
  /** An array of breadcrumb items. */
  items: Array<{
    title: ReactNode;
    onClick?: () => void;
    className?: string;
  }>;
}

/**
 * Breadcrumb component that extends the functionality of the Ant Design Breadcrumb component
 * by providing support type safety. It enforces  stricter type checks compared to the standard Ant Design Breadcrumb component.
 *
 * @param {Props} props - The properties for the Breadcrumb component.
 * @param {Array<{ title: ReactNode; onClick?: () => void; className?: string; }>} props.items - An array of breadcrumb items.
 * @param {string} [props.className] - Custom CSS class for styling the component.
 * @param {ReactNode} [props.separator] - Custom separator element for the breadcrumb.
 * @returns {ReactNode} The rendered Breadcrumb component.
 */
export const Breadcrumb: FC<Props> = ({ items, className = '', separator = '/' }) => {
  useInitializeContext();

  return (
    <AntBreadcrumb items={items} className={classNames('Breadcrumb__container', className)} separator={separator} />
  );
};
