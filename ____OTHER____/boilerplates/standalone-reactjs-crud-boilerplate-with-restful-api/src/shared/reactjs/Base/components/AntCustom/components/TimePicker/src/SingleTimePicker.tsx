import { SizeType } from 'antd/es/config-provider/SizeContext';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { FC, ReactNode, useMemo, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo, useIsMounted } from '../../../../../hooks';
import { useInitializeContext } from '../../../base';
import { AntDatePicker, AntDatePickerProps } from '../../../base/AntDatePicker';
import './css/SingleTimePicker.css';
import { Format } from './types/Format';
import { detectTimeComponents } from './utils/detectTimeComponents';
import { Dayjs, dayjs } from '~/shared/utilities';

export interface Props
  extends Pick<
    AntDatePickerProps<Dayjs>,
    'className' | 'allowClear' | 'placeholder' | 'disabled' | 'showNow' | 'suffixIcon' | 'locale'
  > {
  /** A function that returns an array of disabled hours. */
  disabledHours?: () => number[];
  /**  A function that returns an array of disabled minutes based on the provided hour. */
  disabledMinutes?: (params: { hours: number }) => number[];
  /** A function that returns an array of disabled seconds based on the provided hour and minute. */
  disabledSeconds?: (params: { hours: number; minutes: number }) => number[];
  /** The format in which the date and/or time is displayed. */
  format?: Format;
  /** The currently selected date and time value. */
  value?: Dayjs | string | number;
  /** A function to handle changes to the selected date and time value. */
  onChange?: (value: Dayjs | undefined) => void;
  /** Preset ranges for quick selection. */
  presets?: Array<{ label: ReactNode; value: Dayjs }>;
  /** If true, the select is read-only and cannot be changed by the user. */
  readOnly?: boolean;
  /** Determines if the select is controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
  /** The size of picker. */
  size?: SizeType;
}

/**
 * `SingleTimePicker` is a component that allows users to select a single time, with optional time components.
 * It provides various customization options such as disabling specific hours, minutes, and seconds.
 *
 * @param {Props} props - The properties for the RangeTimePicker component.
 * @param {string} [props.className] - Custom CSS class for the date picker.
 * @param {boolean} [props.allowClear] - Whether to show a clear button.
 * @param {string | [string, string]} [props.placeholder] - Placeholder text for the input.
 * @param {boolean} [props.disabled] - Whether the date picker is disabled.
 * @param {boolean} [props.showNow] - Whether to show the "Now" button.
 * @param {ReactNode} [props.suffixIcon] - Custom suffix icon for the date picker.
 * @param {Object} [props.locale] - Locale configuration for the date picker.
 * @param {() => number[]} [props.disabledHours] - Function to specify disabled hours.
 * @param {(params: { hours: number }) => number[]} [props.disabledMinutes] - Function to specify disabled minutes for a given hour.
 * @param {(params: { hours: number; minutes: number }) => number[]} [props.disabledSeconds] - Function to specify disabled seconds for a given hour and minute.
 * @param {Format} [props.format] - The format for displaying the date and/or time.
 * @param {Dayjs} [props.value] - The currently selected date and time.
 * @param {(value: Dayjs | undefined) => void} [props.onChange] - Callback for when the selected date and time changes.
 * @param {Array<{ label: ReactNode; value: Dayjs }>} props.presets - Preset ranges for quick selection.
 * @param {boolean} props.readOnly - If true, the select is read-only and cannot be changed by the user.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the select is controlled or uncontrolled state.
 * @param {string} [props.size] - The size of picker.
 * @returns {JSX.Element} The rendered `SingleTimePicker` component.
 */
export const SingleTimePicker: FC<Props> = ({
  allowClear = true,
  className,
  disabled,
  placeholder = 'Select time',
  format = 'HH:mm',
  presets,
  showNow = true,
  suffixIcon,
  disabledHours = (): number[] => [],
  disabledMinutes = (): number[] => [],
  disabledSeconds = (): number[] => [],
  locale,
  onChange,
  value,
  readOnly = false,
  valueVariant = 'uncontrolled-state',
  size,
}: Props) => {
  useInitializeContext();
  const [valueState, setValueState] = useState(value ? dayjs(value) : undefined);
  const isMounted = useIsMounted();

  const { hasHour, hasMinute, hasSecond } = useMemo(() => {
    return detectTimeComponents(format);
  }, [format]);

  const handleChange: Props['onChange'] = value => {
    if (readOnly) {
      return;
    }
    let value_ = value;
    if (hasSecond) {
      value_ = value?.startOf('second');
    } else if (hasMinute) {
      value_ = value?.startOf('minute');
    } else if (hasHour) {
      value_ = value?.startOf('hour');
    } else {
      value_ = value?.startOf('day');
    }

    const isUndefined = isEmpty(value_) || null;
    setValueState(isUndefined ? undefined : value_);
    onChange?.(isUndefined ? undefined : value_);
  };

  const handleFocus: AntDatePickerProps['onFocus'] = event => {
    if (readOnly) {
      event.target.blur();
    }
  };

  useDeepCompareEffect(() => {
    setValueState(value ? dayjs(value) : undefined);
  }, [value?.valueOf()]);

  const mergedValueState = useDeepCompareMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    if (valueVariant === 'controlled-state') {
      return value ? dayjs(value) : undefined;
    }
    return valueState;
  }, [value, valueState, isMounted, valueVariant]);

  return (
    <AntDatePicker
      size={size}
      needConfirm
      picker="time"
      locale={locale}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      format={format}
      presets={presets}
      showNow={showNow}
      showTime={{
        showHour: hasHour,
        showMinute: hasMinute,
        showSecond: hasSecond,
        showMillisecond: false,
        disabledTime: () => ({
          disabledHours,
          disabledMinutes: hours => disabledMinutes({ hours }),
          disabledSeconds: (hours, minutes) => disabledSeconds({ hours, minutes }),
        }),
      }}
      suffixIcon={suffixIcon}
      popupClassName="SingleTimePicker__popup"
      className={classNames('SingleTimePicker__container', readOnly ? 'SingleTimePicker__readOnly' : '', className)}
      onFocus={handleFocus}
      onChange={handleChange}
      value={mergedValueState}
    />
  );
};
