import classNames from 'classnames';
import { keys } from 'ramda';
import { Props } from '../Scrollbar';
import { StyleClasses } from '../types/StyleClasses';

const defaultClasses: StyleClasses = {
  container: 'Scrollbar__container',
  content: 'Scrollbar__content',
  trackVertical: 'Scrollbar__track Scrollbar__track--v',
  trackHorizontal: 'Scrollbar__track Scrollbar__track--h',
  thumbVertical: 'Scrollbar__thumb Scrollbar__thumb--v',
  thumbHorizontal: 'Scrollbar__thumb Scrollbar__thumb--h',
};

/**
 * Merges provided classes with default classes.
 * @param {StyleClasses} defaultClasses - The default style classes.
 * @param {Partial<StyleClasses>} providedClasses - Partial style classes provided by the user.
 * @returns {StyleClasses} The merged style classes.
 */
const mergeClasses = (defaultClasses: StyleClasses, providedClasses: Partial<StyleClasses>): StyleClasses => {
  return providedClasses
    ? keys(defaultClasses).reduce<StyleClasses>((result, classKey) => {
        result[classKey] = classNames(defaultClasses[classKey], providedClasses[classKey]);
        return result;
      }, {} as StyleClasses)
    : defaultClasses;
};

/**
 * Computes the final set of style classes based on the provided props.
 * @param {Props} props - The props object containing class names.
 * @returns {StyleClasses} The final set of style classes.
 */
export const getFinalClasses = (props: Props): StyleClasses => {
  const { classes } = props;

  return {
    ...mergeClasses(defaultClasses, props.classes ?? {}),
    container: classNames(defaultClasses.container, classes?.container),
  };
};
