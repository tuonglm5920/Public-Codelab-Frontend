import { Props as AutoCompleteProps } from '../AutoComplete';

type FilterOption = AutoCompleteProps<any>['filterOption'];

/**
 * Default filter function for options in a AutoComplete component.
 * @param input The input string to filter options with.
 * @param option The option being filtered.
 * @returns Whether the option matches the input string.
 */
export const baseFilterOption: FilterOption = (input, option) => {
  if (option?.searchValue) {
    return !!option?.searchValue?.toLowerCase().replace(/\s/g, '').includes(input.toLowerCase().replace(/\s/g, ''));
  }
  return !!option?.value.toString().includes(input.toString());
};
