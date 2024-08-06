import { AutoComplete as AntAutoComplete, AutoCompleteProps as AntAutoCompleteProps } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { FC, ReactNode, useMemo, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo, useIsMounted } from '../../../../../hooks';
import './styles.css';
import { Loading } from '../../../../Loading';
import { useInitializeContext } from '../../../base';
import { Option } from './types/Option';
import { OptionValueType } from './types/OptionValueType';
import { baseFilterOption } from './utils/baseFilterOption';

export interface Props<ValueType extends OptionValueType, RawData = any>
  extends Pick<
    AntAutoCompleteProps<ValueType, Option<ValueType, RawData>>,
    | 'allowClear'
    | 'disabled'
    | 'placeholder'
    | 'className'
    | 'notFoundContent'
    | 'filterOption'
    | 'searchValue'
    | 'open'
    | 'onSearch'
    | 'onDropdownVisibleChange'
    | 'size'
  > {
  /** The current input value. */
  value?: ValueType;
  /** Callback function that is triggered when the input value changes. */
  onChange?: (value: ValueType | undefined, option: Option<ValueType, RawData> | undefined) => void;
  /** Whether the component is in a loading state, showing a loading indicator. */
  loading?: boolean;
  /** Array of options to be displayed in the dropdown menu. */
  options?: Option<ValueType, RawData>[];
  /** If true, the select is read-only and cannot be changed by the user. */
  readOnly?: boolean;
  /** Determines if the select is controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
}

/**
 * AutoComplete component that provides an input field with dropdown suggestions based on user input.
 *
 * @template ValueType - The type of the value for each option.
 * @template RawData - The raw data type for each option.
 *
 * @param {Props<ValueType, RawData>} props - The properties for the AutoComplete component.
 * @param {boolean} [props.allowClear=true] - Whether to show a clear button allowing the user to clear the input.
 * @param {boolean} [props.disabled] - Whether the AutoComplete component is disabled.
 * @param {string} [props.placeholder] - Placeholder text to display when the input is empty.
 * @param {string} [props.className] - Custom CSS class for styling the component.
 * @param {ReactNode} [props.notFoundContent] - Content to display when no options match the input.
 * @param {boolean} [props.loading=false] - Whether the component is in a loading state.
 * @param {string} [props.value] - The current value of the input.
 * @param {(value: string | undefined, option: Option<ValueType, RawData> | undefined) => void} [props.onChange] - Callback function that is triggered when the input value changes.
 * @param {boolean | ((inputValue: string, option: Option<ValueType, RawData>) => boolean)} [props.filterOption=baseFilterOption] - Custom filter function to determine whether an option should be shown in the dropdown.
 * @param {Option<ValueType, RawData>[]} [props.options=[]] - Array of options to be displayed in the dropdown menu.
 * @param {boolean} [props.open] - Whether the dropdown menu is open.
 * @param {string} [props.searchValue] - The value of the search input.
 * @param {Function} [props.onDropdownVisibleChange] - Callback function that is triggered when the dropdown visibility changes.
 * @param {Function} [props.onSearch] - Callback function that is triggered when the search input value changes.
 * @param {boolean} props.readOnly - If true, the select is read-only and cannot be changed by the user.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the select is controlled or uncontrolled state.
 * @param {string} [props.size] - The size of the search input.
 * @returns {ReactNode} The rendered AutoComplete component.
 */
export const AutoComplete = <ValueType extends OptionValueType, RawData = any>({
  allowClear = true,
  disabled,
  placeholder,
  className,
  notFoundContent,
  loading = false,
  value,
  filterOption = baseFilterOption,
  options = [],
  open,
  searchValue,
  onChange,
  onDropdownVisibleChange,
  onSearch,
  readOnly = false,
  valueVariant = 'uncontrolled-state',
  size,
}: Props<ValueType, RawData>): ReactNode => {
  useInitializeContext();
  const [valueState, setValueState] = useState(value);
  const isMounted = useIsMounted();

  const handleChange: Props<ValueType>['onChange'] = (value, option) => {
    if (readOnly) {
      return;
    }
    const isUndefined = isEmpty(value) || null;
    setValueState(isUndefined ? undefined : value);
    onChange?.(isUndefined ? undefined : value, isUndefined ? undefined : option);
  };

  useDeepCompareEffect(() => {
    setValueState(value);
  }, [value]);

  const options_ = useMemo(() => {
    return options.filter(item => !item.hidden);
  }, [options]);

  const renderLoadingAtDropdown: FC = () => {
    return (
      <div className="AutoComplete__loading">
        <Loading size={60} />
      </div>
    );
  };

  const mergedValueState = useDeepCompareMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    if (valueVariant === 'controlled-state') {
      return value ? value : undefined;
    }
    return valueState;
  }, [value, valueState, isMounted, valueVariant]);

  return (
    <AntAutoComplete
      size={size}
      filterOption={filterOption}
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder}
      open={open}
      searchValue={searchValue}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onSearch={onSearch}
      notFoundContent={loading ? renderLoadingAtDropdown({}) : notFoundContent}
      className={classNames('AutoComplete__container', readOnly ? 'AutoComplete__readOnly' : '', className)}
      tabIndex={readOnly ? -1 : undefined}
      options={options_}
      value={mergedValueState}
      onChange={handleChange as AntAutoCompleteProps<ValueType, Option<ValueType, RawData>>['onChange']}
    />
  );
};
