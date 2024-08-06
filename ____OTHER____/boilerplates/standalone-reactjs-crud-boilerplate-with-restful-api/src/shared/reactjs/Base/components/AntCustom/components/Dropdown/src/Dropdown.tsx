import { Dropdown as AntDropdown, DropdownProps as AntDropdownProps, theme } from 'antd';
import classNames from 'classnames';
import { ReactNode, cloneElement } from 'react';
import { useInitializeContext } from '../../../base';
import { Divider } from '../../Divider';
import './styles.css';

export interface Item {
  /** The unique key for the menu item. */
  key: string;
  /** The label of the menu item. */
  label: ReactNode;
  /** The children items of the menu item. */
  children?: Array<Group | Item | Divider>;
  /** The icon for the menu item. */
  icon?: ReactNode;
  /** Whether the menu item is disabled. */
  disabled?: boolean;
  /** Whether the menu item is marked as dangerous. */
  danger?: boolean;
  /** The function to be called when the menu item is clicked. */
  onClick?: () => void;
  /** If true, the item will be hidden. */
  hidden?: boolean;
  /** The class name to be applied to the item. */
  className?: string;
}

export interface Group {
  /** Specifies that this item is a group. */
  type: 'group';
  /** The label of the group. */
  label: ReactNode;
  /** The children items of the group. */
  children: Array<Group | Item | Divider>;
}

export interface Divider {
  /** Specifies that this item is a divider. */
  type: 'divider';
}

export interface Props extends Pick<AntDropdownProps, 'children' | 'className' | 'trigger' | 'arrow'> {
  /** The menu items to be displayed. */
  items?: Item[];
  /** The icon for expanding the menu items. */
  expandIcon?: ReactNode;
  /** The footer to be displayed at the bottom of the dropdown. */
  footer?: ReactNode;
}

/**
 * Dropdown component that extends the functionality of the Ant Design Dropdown component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Dropdown component.
 * @param {ReactNode} [props.children] - The trigger element for the dropdown.
 * @param {string} [props.className] - Custom CSS class for styling the dropdown.
 * @param {Array<Item>} [props.items] - The menu items to be displayed.
 * @param {ReactNode} [props.expandIcon] - The icon for expanding the menu items.
 * @param {ReactNode} [props.footer] - The footer to be displayed at the bottom of the dropdown.
 * @param {boolean} [props.arrow=true] - Whether to show the arrow on the dropdown.
 * @param {string[]} [props.trigger] - The trigger mode of the dropdown.
 * @returns {ReactNode} The rendered Dropdown component.
 */
export const Dropdown = ({
  children,
  className,
  arrow = true,
  trigger = ['click'],
  items = [],
  expandIcon,
  footer,
}: Props): ReactNode => {
  useInitializeContext();
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const dropdownRender: AntDropdownProps['dropdownRender'] = menu => {
    if (footer) {
      return (
        <div style={contentStyle}>
          {cloneElement(menu as React.ReactElement, { style: menuStyle })}
          <Divider className="Dropdown__divider" />
          <div className="Dropdown__footer">{footer}</div>
        </div>
      );
    }
    return menu;
  };

  return (
    <AntDropdown
      children={children}
      destroyPopupOnHide
      arrow={arrow}
      trigger={trigger}
      overlayClassName="Dropdown__overlay"
      className={classNames('Dropdown__container', className)}
      dropdownRender={dropdownRender}
      menu={{ items, expandIcon }}
    />
  );
};
