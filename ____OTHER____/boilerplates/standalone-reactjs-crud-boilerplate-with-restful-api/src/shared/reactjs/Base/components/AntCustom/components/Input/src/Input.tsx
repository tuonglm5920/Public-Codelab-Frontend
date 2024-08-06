import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDebouncedValue, useDeepCompareEffect, useDeepCompareMemo, useIsMounted } from '../../../../../hooks';
import { useInitializeContext } from '../../../base';
import './styles.css';
import { Mode } from './types/Mode';
import { takeAll } from './utils/takeAll';
import { takeOnlyNumber } from './utils/takeOnlyNumber';
import { takeOnlyWord } from './utils/takeOnlyWord';

export interface Props
  extends Pick<
    AntInputProps,
    | 'addonAfter'
    | 'addonBefore'
    | 'allowClear'
    | 'className'
    | 'disabled'
    | 'maxLength'
    | 'placeholder'
    | 'prefix'
    | 'suffix'
    | 'readOnly'
    | 'size'
    | 'showCount'
  > {
  /** The value of the input. */
  value?: string;
  /** Callback function triggered when the input value changes. */
  onChange?: (value: string | undefined) => void;
  /** Callback function that is triggered when the input value changes, but only after a debounce delay. */
  onDebounceChange?: (value: string | undefined) => void;
  /** Determines if the input is controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
  /** Specifies the mode of the input, determining what type of characters it accepts. */
  mode?: Mode;
}

/**
 * Input component that extends the functionality of the Ant Design Input component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Input component.
 * @param {ReactNode} [props.addonAfter] - The element to display on the right side of the input field.
 * @param {ReactNode} [props.addonBefore] - The element to display on the left side of the input field.
 * @param {boolean} [props.allowClear=true] - Whether a clear button is displayed when there is input.
 * @param {string} [props.className] - Custom CSS class for styling the input.
 * @param {boolean} [props.disabled=false] - Whether the input is disabled.
 * @param {number} [props.maxLength] - The maximum length of the input value.
 * @param {string} [props.placeholder] - The placeholder text for the input.
 * @param {ReactNode} [props.prefix] - The prefix icon or text for the input.
 * @param {ReactNode} [props.suffix] - The suffix icon or text for the input.
 * @param {boolean} [props.readOnly=false] - Whether the input is read-only.
 * @param {string} [props.value] - The value of the input.
 * @param {Function} [props.onChange] - Callback function triggered when the input value changes.
 * @param {Function} [props.onDebounceChange] - Callback function that is triggered when the input value changes, but only after a debounce delay.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the input is controlled or uncontrolled state.
 * @param {string} [props.size] - The size of input.
 * @param {string} [props.showCount] - Whether to display the character count.
 * @param {Mode} [props.mode] - Specifies the mode of the input, determining what type of characters it accepts.
 * @returns {ReactNode} The rendered Input component.
 */
export const Input: FC<Props> = ({
  addonAfter,
  addonBefore,
  allowClear = true,
  className,
  disabled = false,
  maxLength,
  onChange,
  onDebounceChange,
  placeholder,
  prefix,
  suffix,
  value = '',
  readOnly = false,
  valueVariant = 'uncontrolled-state',
  size,
  showCount = false,
  mode = 'takeAll',
}) => {
  useInitializeContext();
  const isMounted = useIsMounted();
  const [valueState, setValueState] = useState(value);
  const { value: valueStateDebounced, clearTimeout } = useDebouncedValue(valueState, { timeoutMs: 300 });

  const take = useMemo(() => {
    if (mode === 'takeOnlyNumber') {
      return takeOnlyNumber;
    }
    if (mode === 'takeOnlyWord') {
      return takeOnlyWord;
    }

    return takeAll;
  }, [mode]);

  const handleChange: AntInputProps['onChange'] = event => {
    if (readOnly) {
      return;
    }
    const isUndefined = isEmpty(event.target.value) || null;
    const value = isUndefined ? undefined : take(event);
    setValueState(value ?? '');
    onChange?.(value);
  };

  const handleBlur: AntInputProps['onBlur'] = event => {
    if (readOnly) {
      return;
    }
    const isUndefined = isEmpty(event.target.value) || null;
    const value = isUndefined ? undefined : take(event);
    clearTimeout();
    setValueState(value ?? '');
    onDebounceChange?.(value);
  };

  useDeepCompareEffect(() => {
    setValueState(value);
  }, [value]);

  useEffect(() => {
    if (isMounted) {
      onDebounceChange?.(valueStateDebounced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStateDebounced]);

  const mergedValueState = useDeepCompareMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    return valueVariant === 'controlled-state' ? value : valueState;
  }, [value, valueState, isMounted, valueVariant]);

  return (
    <AntInput
      size={size}
      readOnly={readOnly}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      allowClear={allowClear}
      className={classNames('Input__container', readOnly ? 'Input__readOnly' : '', className)}
      disabled={disabled}
      maxLength={maxLength}
      onBlur={handleBlur}
      placeholder={placeholder}
      prefix={prefix}
      suffix={suffix}
      showCount={showCount}
      tabIndex={readOnly ? -1 : undefined}
      onChange={handleChange}
      value={mergedValueState}
    />
  );
};
