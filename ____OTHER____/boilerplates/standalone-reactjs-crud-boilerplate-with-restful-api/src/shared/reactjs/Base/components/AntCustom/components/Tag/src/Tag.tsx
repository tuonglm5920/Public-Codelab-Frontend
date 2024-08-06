import { Tag as AntTag, TagProps as AntTagProps } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import { useInitializeContext } from '../../../base';

export interface Props extends Pick<AntTagProps, 'children' | 'className' | 'color' | 'bordered' | 'icon'> {}

/**
 * Tag component that extends the functionality of the Ant Design Tag component
 * by providing additional customization options and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Tag component.
 * @param {ReactNode} [props.children] - The content of the tag.
 * @param {string} [props.className] - Custom CSS class for styling the tag.
 * @param {string} [props.color] - Color of the tag.
 * @param {boolean} [props.bordered=true] - Whether the tag has a border.
 * @param {ReactNode} [props.icon] - Icon to be displayed in the tag.
 * @returns {ReactNode} The rendered Tag component.
 */
export const Tag: FC<Props> = ({ bordered = true, children, className, color, icon }) => {
  useInitializeContext();

  return (
    <AntTag
      bordered={bordered}
      children={children}
      className={classNames('Tag__container', className)}
      color={color}
      icon={icon}
    />
  );
};
