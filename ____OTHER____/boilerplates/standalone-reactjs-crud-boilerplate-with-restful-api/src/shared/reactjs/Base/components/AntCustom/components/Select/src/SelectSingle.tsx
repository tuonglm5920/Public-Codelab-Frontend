import { SelectProps as AntSelectProps, Select } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { FC, MouseEvent, ReactNode, useMemo, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo, useIsMounted } from '../../../../../hooks';
import { Loading } from '../../../../Loading';
import { useInitializeContext } from '../../../base';
import './css/SelectSingle.css';
import { Option } from './types/Option';
import { OptionValueType } from './types/OptionValueType';
import { baseFilterOption } from './utils/baseFilterOption';

export interface Props<ValueType extends OptionValueType, RawData = any>
  extends Pick<
    AntSelectProps<ValueType, Option<ValueType>>,
    | 'className'
    | 'allowClear'
    | 'loading'
    | 'notFoundContent'
    | 'placeholder'
    | 'disabled'
    | 'autoClearSearchValue'
    | 'filterOption'
    | 'direction'
    | 'searchValue'
    | 'open'
    | 'onSearch'
    | 'onDropdownVisibleChange'
    | 'size'
    | 'showSearch'
  > {
  /** An array of options for the SelectSingle component. */
  options: Option<ValueType, RawData>[];
  /** The current value of the SelectSingle component. */
  value?: ValueType;
  /**
   * Callback function invoked when the value of the SelectSingle component changes.
   * @param value The new value of the SelectSingle component.
   * @param options The selected options associated with the new value.
   */
  onChange?: (value: ValueType | undefined, options: undefined | Option<ValueType, RawData>) => void;
  /**
   * Prop specifying the property of the option object to be used as the label.
   * If set, the value should be 'displayLabel'.
   */
  optionLabelProp?: 'displayLabel';
  /** If true, the select is read-only and cannot be changed by the user. */
  readOnly?: boolean;
  /** Determines if the select is controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
}

/**
 * SelectSingle component that extends the functionality of the Ant Design Select component
 * by providing support for selecting a single option while ensuring type safety. It enforces
 * stricter type checks compared to the standard Ant Design Select component.
 *
 * @template ValueType - The type of the value for the option.
 * @template RawData - The raw data type for each option.
 *
 * @param {Props<ValueType, RawData>} props - The properties for the SelectSingle component.
 * @param {ValueType} [props.value] - The current value of the SelectSingle component.
 * @param {(value: ValueType | undefined, option: undefined | Option<ValueType, RawData>) => void} [props.onChange] - Callback function invoked when the value of the SelectSingle component changes.
 * @param {boolean} [props.loading] - Whether the component is in a loading state.
 * @param {ReactNode} [props.notFoundContent] - Content to display when no options match the input.
 * @param {Option<ValueType, RawData>[]} props.options - An array of options for the SelectSingle component.
 * @param {boolean} [props.allowClear] - Whether to show a clear button allowing the user to clear the input.
 * @param {string} [props.placeholder] - Placeholder text to display when the input is empty.
 * @param {boolean} [props.disabled] - Whether the SelectSingle component is disabled.
 * @param {boolean} [props.autoClearSearchValue=true] - Whether to clear the search input when an option is selected.
 * @param {boolean | ((inputValue: string, option: Option<ValueType, RawData>) => boolean)} [props.filterOption=baseFilterOption] - Custom filter function to determine whether an option should be shown in the dropdown.
 * @param {string} [props.className] - Custom CSS class for styling the component.
 * @param {string} [props.direction] - The direction of the dropdown menu ('ltr' or 'rtl').
 * @param {'displayLabel'} [props.optionLabelProp] - Prop specifying the property of the option object to be used as the label. If set, the value should be 'displayLabel'.
 * @param {boolean} props.readOnly - If true, the select is read-only and cannot be changed by the user.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the select is controlled or uncontrolled state.
 * @param {boolean} [props.open] - Whether the dropdown menu is open.
 * @param {string} [props.searchValue] - The value of the search input.
 * @param {Function} [props.onDropdownVisibleChange] - Callback function that is triggered when the dropdown visibility changes.
 * @param {Function} [props.onSearch] - Callback function that is triggered when the search input value changes.
 * @param {string} [props.size] - The size of select.
 * @param {string} [props.showSearch] - Whether select is searchable.
 * @returns {ReactNode} The rendered SelectSingle component.
 */
export const SelectSingle = <ValueType extends OptionValueType = OptionValueType, RawData = any>({
  value,
  onChange,
  loading,
  notFoundContent,
  options,
  allowClear = true,
  placeholder,
  disabled,
  autoClearSearchValue = true,
  filterOption = baseFilterOption,
  className,
  direction,
  optionLabelProp,
  onDropdownVisibleChange,
  onSearch,
  open,
  searchValue,
  readOnly = false,
  valueVariant = 'uncontrolled-state',
  size,
  showSearch = true,
}: Props<ValueType, RawData>): ReactNode => {
  useInitializeContext();
  const [valueState, setValueState] = useState(value === '' ? undefined : value);
  const isMounted = useIsMounted();

  const handleChange: Props<ValueType, RawData>['onChange'] = (value, option) => {
    if (readOnly) {
      return;
    }
    const isUndefined = isEmpty(value) || null;
    setValueState(isUndefined ? undefined : value);
    onChange?.(isUndefined ? undefined : value, isUndefined ? undefined : option);
  };

  const handleClick = (event: MouseEvent): void => {
    event.stopPropagation();
  };

  useDeepCompareEffect(() => {
    setValueState(value === '' ? undefined : value);
  }, [value]);

  const renderLoadingAtDropdown: FC = () => {
    return (
      <div className="SelectSingle__loading">
        <Loading size={60} />
      </div>
    );
  };

  const options_ = useMemo(() => {
    return options.filter(item => !item.hidden);
  }, [options]);

  const mergedValueState = useDeepCompareMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    return valueVariant === 'controlled-state' ? value : valueState;
  }, [value, valueState, isMounted, valueVariant]);

  return (
    <Select
      popupMatchSelectWidth
      size={size}
      showSearch={showSearch}
      optionLabelProp={optionLabelProp}
      direction={direction}
      filterOption={filterOption}
      autoClearSearchValue={autoClearSearchValue}
      placeholder={placeholder}
      disabled={disabled}
      onClick={handleClick}
      notFoundContent={loading ? renderLoadingAtDropdown({}) : notFoundContent}
      allowClear={loading ? false : allowClear}
      className={classNames('SelectSingle__container', readOnly ? 'SelectSingle__readOnly' : '', className)}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onSearch={onSearch}
      open={open}
      searchValue={searchValue}
      loading={loading}
      tabIndex={readOnly ? -1 : undefined}
      onChange={handleChange as AntSelectProps<ValueType, Option<ValueType, RawData>>['onChange']}
      value={mergedValueState}
      options={loading ? [] : options_}
    />
  );
};
