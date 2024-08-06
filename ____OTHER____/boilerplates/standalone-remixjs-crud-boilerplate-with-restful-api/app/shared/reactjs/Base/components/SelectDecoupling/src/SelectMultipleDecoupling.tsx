import { isEmpty, prop, uniqBy } from 'ramda';
import { DependencyList, ReactNode, useMemo, useState } from 'react';
import { useDeepCompareEffect, useIsMounted } from '../../../hooks';
import { SelectMultiple, SelectMultipleProps, SelectOption } from '../../AntCustom';
import { AnyRecord } from '~/shared/typescript-utilities';

interface OnPrepareDoneParameters<ModelId extends string | number> {
  /**
   * A flag indicating whether there was a warning. This flag will be `true`
   * if `itemsState` contains any item with type 'unmatched', and `false` otherwise.
   */
  isWarning: boolean;
  /** An array representing the state of items, whether they matched or not. */
  itemsState: Array<{
    /** The type of the item state, either matched or unmatched. */
    type: 'matched' | 'unmatched';
    /** The value of the item. */
    value: ModelId;
  }>;
}

export interface Props<Model extends AnyRecord, ModelId extends string | number>
  extends Omit<
    SelectMultipleProps<ModelId>,
    'options' | 'onChange' | 'filterOption' | 'onDropdownVisibleChange' | 'open' | 'searchValue' | 'onSearch'
  > {
  /** A function to fetch data from a service. */
  service: () => Promise<Model[]> | Model[];
  /** A function to transform the fetched model data into options for the Select component. */
  transformToOption: (model: Model, index?: number) => SelectOption<ModelId, Model>;
  /** Callback function triggered when the selected values change. */
  onChange?: (value: ModelId[] | undefined, options: SelectOption<ModelId, Model>[] | undefined) => void;
  /** An array of dependencies to watch for fetching data. */
  depsFetch?: DependencyList;
  /** An array of dependencies to watch for transforming options. */
  depsTransformOption?: DependencyList;
  /** Used to display options while fetching models. */
  defaultModels?: Model[];
  /** Used to display additional options. For example, if a model is deleted in the database and the fetch fails to retrieve it from the API, it will not be displayed correctly. */
  additionalModels?: Model[];
  /**
   * Callback function triggered when the preparation is done. This function can be used to handle warnings if the value passed to this component is not found in the response of the service.
   * @param {Object} params - The parameters object.
   * @param {boolean} params.isWarning - A flag indicating whether there was a warning. This flag will be `true` if `itemsState` contains any item with type 'unmatched', and `false` otherwise.
   * @param {Array<{ type: 'matched' | 'unmatched', value: ModelId }>} params.itemsState - The data associated with the preparation.
   */
  onPrepareDone?: (params: OnPrepareDoneParameters<ModelId>) => void;
  /**
   * A text message to display when there is a warning, such as when the `value` passed to the component is not found in the response from the `service`. This can be a static message or a function that returns a message based on the `value` passed.
   * @param {ModelId} value - The value that was passed to the component and not found in the service response.
   * @returns {string} - The warning text message.
   */
  warningText?: (value: ModelId) => string;
  /**
   * A function to provide a custom loading message while fetching data. This function takes the current `value` and returns a string that represents the loading state.
   * @param {ModelId} value - The current value being processed or selected. This can be used to tailor the loading message based on the specific value.
   * @returns {string} - A custom loading message.
   */
  loadingText?: (value: ModelId) => string;
}

/**
 * SelectMultipleDecoupling component provides a more flexible approach for working with Select components,
 * allowing for separate data fetching and option transformation functions.
 * @template Model - The type of the data model.
 * @template ModelId - The type of the selected model IDs.
 * @param {Props<Model, ModelId>} props - The component props.
 * @returns {ReactNode} - The rendered SelectMultipleDecoupling component.
 */
export const SelectMultipleDecoupling = <Model extends AnyRecord, ModelId extends string | number>({
  transformToOption,
  service,
  onChange,
  loading,
  depsFetch = [],
  depsTransformOption = [],
  allowClear = true,
  autoClearSearchValue,
  className,
  direction,
  disabled,
  notFoundContent,
  optionLabelProp,
  placeholder,
  value = [],
  defaultModels = [],
  additionalModels = [],
  onPrepareDone,
  warningText,
  loadingText,
  readOnly,
  valueVariant,
}: Props<Model, ModelId>): ReactNode => {
  const isMounted = useIsMounted();
  const [isFetching, setIsFetching] = useState(false);
  const [serviceResponseState, setServiceResponseState] = useState<Model[]>(defaultModels.concat(additionalModels));

  const [state, setState] = useState<{
    options: SelectOption<ModelId, Model>[];
    valueState: ModelId[];
    isPreparedDateOnce: boolean;
  }>({
    options: defaultModels.concat(additionalModels).map(transformToOption),
    valueState: value,
    isPreparedDateOnce: false,
  });

  const handleSelect: SelectMultipleProps<ModelId, Model>['onChange'] = (values, options) => {
    const isUndefined = isEmpty(values) || null;
    onChange?.(isUndefined ? undefined : values, isUndefined ? undefined : options);
  };

  const handleTransformServiceResponse = (serviceResponse?: Model[]): void => {
    const prepareDoneParameters: OnPrepareDoneParameters<ModelId> = {
      isWarning: false,
      itemsState: value.map(item => {
        return {
          type: 'unmatched',
          value: item,
        };
      }),
    };
    const response = serviceResponse ?? serviceResponseState;
    const transformData = response.map((item, index) => {
      const option: SelectOption<ModelId, Model> = {
        ...transformToOption(item, index),
        rawData: item,
      };
      const indexOfRecordInValue = value.findIndex(record => option.value === record);
      if (indexOfRecordInValue !== -1) {
        prepareDoneParameters.itemsState[indexOfRecordInValue] = {
          ...prepareDoneParameters.itemsState[indexOfRecordInValue],
          type: 'matched',
        };
      } else {
        prepareDoneParameters.isWarning = true;
      }
      return option;
    });

    setState({
      options: uniqBy(prop('value'), transformData),
      valueState: prepareDoneParameters.itemsState.map(item => {
        if (item.type === 'unmatched' && warningText) {
          return warningText(item.value) as ModelId;
        }
        return item.value;
      }),
      isPreparedDateOnce: true,
    });
    onPrepareDone?.(prepareDoneParameters);
  };

  const handleFetch = async (): Promise<void> => {
    setIsFetching(true);
    try {
      const items = await service();
      setServiceResponseState(items.concat(additionalModels));
      handleTransformServiceResponse(items.concat(additionalModels));
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useDeepCompareEffect(() => {
    handleFetch();
  }, [...depsFetch]);

  useDeepCompareEffect(() => {
    if (!isMounted || isFetching) {
      return;
    }
    handleTransformServiceResponse();
  }, [value, ...depsTransformOption]);

  const mergedValue = useMemo(() => {
    if (loadingText && !state.isPreparedDateOnce) {
      return value.map(item => loadingText(item));
    }
    return state.valueState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPreparedDateOnce, state.valueState]);

  return (
    <SelectMultiple
      options={state.options}
      loading={loading || isFetching}
      allowClear={allowClear}
      autoClearSearchValue={autoClearSearchValue}
      className={className}
      direction={direction}
      disabled={disabled || !state.isPreparedDateOnce}
      notFoundContent={notFoundContent}
      optionLabelProp={optionLabelProp}
      placeholder={placeholder}
      readOnly={readOnly}
      valueVariant={valueVariant}
      onChange={handleSelect}
      value={mergedValue as ModelId[]}
    />
  );
};
