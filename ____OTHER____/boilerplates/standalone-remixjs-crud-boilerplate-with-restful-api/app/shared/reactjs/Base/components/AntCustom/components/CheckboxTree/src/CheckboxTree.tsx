import { Tree as AntTree, TreeProps as AntTreeProps } from 'antd';
import { SwitcherIcon } from 'antd/es/tree/Tree';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { ReactNode, useMemo, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo, useIsMounted } from '../../../../../hooks';
import { useInitializeContext } from '../../../base';
import './styles.css';
import { Leaf } from './types/Leaf';
import { TreeDataNode } from './types/TreeDataNode';
import { leavesToAntTreeData } from './utils/leavesToAntTreeData';

export interface Props<Model> extends Pick<AntTreeProps, 'className' | 'disabled' | 'height' | 'defaultExpandAll'> {
  /** The array of leaf nodes that make up the tree data. */
  data: Leaf<Model>[];
  /** Callback function triggered when a node's value state changes. */
  onChange?: (
    keys: undefined | string[],
    options: undefined | Array<Omit<Leaf<Model>, 'disabled' | 'hidden' | 'parent'>>,
  ) => void;
  /** Customize expand/collapse icons for tree nodes (with default rotate angular style). */
  iconExpand?: (props: { expanded: boolean }) => ReactNode;
  /** The keys of the currently expanded nodes. */
  expandedKeys?: string[];
  /** Callback function triggered when a node's expanded state changes. */
  onExpand?: (keys: string[]) => void;
  /** If true, the tree is read-only and cannot be changed by the user. */
  readOnly?: boolean;
  /** Determines if the tree is in a controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
  /** The keys of the currently selected nodes. */
  value?: string[];
}

/**
 * CheckboxTree component that extends the functionality of the Ant Design Tree component
 * by providing additional customization and support for stricter type safety.
 *
 * @template Model - The type of the raw data associated with each leaf.
 * @param {Props<Model>} props - The props for the CheckboxTree component.
 * @param {string} [props.className] - The CSS class for styling the tree component.
 * @param {Leaf<Model>[]} props.data - The array of leaf nodes that make up the tree data.
 * @param {boolean} [props.disabled] - Whether the entire tree is disabled.
 * @param {number} [props.height] - The height of the tree component.
 * @param {boolean} [props.defaultExpandAll] - Whether to expand all tree nodes by default.
 * @param {(keys: undefined | string[], options: undefined | Array<Omit<Leaf<Model>, 'disabled' | 'hidden' | 'parent'>>) => void} [props.onChange] - Callback function triggered when a node's value state changes.
 * @param {(props: { expanded: boolean }) => ReactNode} [props.iconExpand] - Customize expand/collapse icons for tree nodes (with default rotate angular style).
 * @param {string[]} [props.expandedKeys] - The keys of the currently expanded nodes.
 * @param {(keys: string[]) => void} [props.onExpand] - Callback function triggered when a node's expanded state changes.
 * @param {boolean} [props.readOnly] - If true, the tree is read-only and cannot be changed by the user.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the tree is in a controlled or uncontrolled state.
 * @param {string[]} [props.value] - The keys of the currently selected nodes.
 * @returns {ReactNode} The rendered CheckboxTree component.
 */

export const CheckboxTree = <Model,>({
  className,
  data,
  value = [],
  disabled,
  height,
  onChange,
  iconExpand,
  expandedKeys,
  onExpand,
  defaultExpandAll = true,
  readOnly = false,
  valueVariant = 'uncontrolled-state',
}: Props<Model>): ReactNode => {
  useInitializeContext();
  const isMounted = useIsMounted();
  const [valueState, setValueState] = useState<string[]>(value);

  const treeData = useMemo(() => {
    return leavesToAntTreeData(data);
  }, [data]);

  const handleCheck: AntTreeProps<TreeDataNode>['onCheck'] = (keys, info) => {
    if (readOnly) {
      return;
    }
    const isUndefined = isEmpty(keys) || null;
    const nextState = isUndefined ? undefined : (keys as string[]);
    setValueState(nextState ?? []);
    onChange?.(
      nextState,
      isUndefined
        ? undefined
        : info.checkedNodes.map(node => ({
            label: node.checkboxLabel,
            rawData: node.rawData,
            value: node.checkboxValue,
            isLeaf: node.isLeaf,
          })),
    );
  };

  const switcherIcon: SwitcherIcon = ({ expanded }) => {
    return iconExpand?.({ expanded: !!expanded });
  };

  useDeepCompareEffect(() => {
    setValueState(value);
  }, [value]);

  const mergedValueState = useDeepCompareMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    return valueVariant === 'controlled-state' ? value : valueState;
  }, [value, valueState, isMounted, valueVariant]);

  return (
    <AntTree<TreeDataNode>
      // Fixed props
      autoExpandParent
      blockNode
      checkable
      draggable={false}
      focusable
      multiple={false}
      selectable={false}
      showIcon={false}
      showLine={false}
      virtual
      // Customizable props
      defaultExpandAll={defaultExpandAll}
      onExpand={data => onExpand?.(data as string[])}
      switcherIcon={switcherIcon}
      disabled={disabled}
      className={classNames('CheckboxTree__container', readOnly ? 'CheckboxTree__readOnly' : '', className)}
      height={height}
      fieldNames={{
        title: 'checkboxLabel',
        key: 'checkboxValue',
      }}
      tabIndex={readOnly ? -1 : undefined}
      {...(expandedKeys ? { expandedKeys } : {})}
      treeData={treeData}
      onCheck={handleCheck}
      checkedKeys={mergedValueState}
    />
  );
};
