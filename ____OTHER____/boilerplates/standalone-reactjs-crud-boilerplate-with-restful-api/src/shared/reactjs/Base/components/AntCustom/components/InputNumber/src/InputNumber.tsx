import { InputNumber as AntInputNumber, InputNumberProps as AntInputNumberProps } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { FC, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo, useIsMounted } from '../../../../../hooks';
import { useInitializeContext } from '../../../base';
import './styles.css';

export interface Props
  extends Pick<
    AntInputNumberProps<number>,
    | 'addonAfter'
    | 'addonBefore'
    | 'className'
    | 'disabled'
    | 'formatter'
    | 'max'
    | 'min'
    | 'parser'
    | 'placeholder'
    | 'prefix'
    | 'step'
    | 'suffix'
    | 'readOnly'
    | 'size'
  > {
  /** Whether to show the controls. */
  controls?: boolean;
  /** The value of the input number. */
  value?: number;
  /** Callback function triggered when the input number value changes. */
  onChange?: (value?: number) => void;
  /** Determines if the input number is controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
}

/**
 * InputNumber component that extends the functionality of the Ant Design InputNumber component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the InputNumber component.
 * @param {ReactNode} [props.addonAfter] - The element to display on the right side of the input number field.
 * @param {ReactNode} [props.addonBefore] - The element to display on the left side of the input number field.
 * @param {boolean} [props.controls=true] - Whether to show the controls.
 * @param {string} [props.className] - Custom CSS class for styling the input number.
 * @param {boolean} [props.disabled] - Whether the input number is disabled.
 * @param {Function} [props.formatter] - Specifies the format of the value presented.
 * @param {number} [props.max] - The maximum value of the input number.
 * @param {number} [props.min=0] - The minimum value of the input number.
 * @param {Function} [props.parser] - Specifies the value extracted from the formatted value.
 * @param {string} [props.placeholder] - The placeholder text for the input number.
 * @param {ReactNode} [props.prefix] - The prefix icon or text for the input number.
 * @param {number} [props.step] - The step size for the input number.
 * @param {ReactNode} [props.suffix] - The suffix icon or text for the input number.
 * @param {boolean} [props.readOnly=false] - Whether the input number is read-only.
 * @param {number} [props.value] - The value of the input number.
 * @param {Function} [props.onChange] - Callback function triggered when the input number value changes.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the input number is controlled or uncontrolled state.
 * @param {string} [props.size] - The size of input.
 * @returns {ReactNode} The rendered InputNumber component.
 */
export const InputNumber: FC<Props> = ({
  addonAfter,
  addonBefore,
  className,
  controls = true,
  disabled,
  formatter,
  max,
  min = 0,
  onChange,
  parser,
  placeholder,
  prefix,
  step,
  suffix,
  value,
  readOnly = false,
  valueVariant = 'uncontrolled-state',
  size,
}) => {
  useInitializeContext();
  const isMounted = useIsMounted();
  const [valueState, setValueState] = useState(value);

  const handleChange: AntInputNumberProps<number>['onChange'] = value => {
    if (readOnly) {
      return;
    }
    const isUndefined = isEmpty(value) || null;
    const value_ = isUndefined ? undefined : Number(value);
    setValueState(value_);
    onChange?.(value_);
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
    <AntInputNumber<number>
      size={size}
      keyboard
      readOnly={readOnly}
      // FIXME: Only take number on change
      onKeyDown={event => {
        // User type Ctrl + A or Meta + A ==> Accept
        if (event.metaKey || event.ctrlKey) {
          return;
        }
        // Only type number
        if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
      step={step}
      controls={controls}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      className={classNames('InputNumber__container', readOnly ? 'InputNumber__readOnly' : '', className)}
      disabled={disabled}
      max={max}
      min={min}
      placeholder={placeholder}
      prefix={prefix}
      suffix={suffix}
      formatter={formatter}
      parser={parser}
      tabIndex={readOnly ? -1 : undefined}
      value={mergedValueState}
      onChange={handleChange}
    />
  );
};
