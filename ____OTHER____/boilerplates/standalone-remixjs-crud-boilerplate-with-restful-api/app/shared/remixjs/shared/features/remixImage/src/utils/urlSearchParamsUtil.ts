import { transformOptions } from './transformOptionsSchema';
import { UrlSearchParamsUtils } from '~/shared/utilities';

export const urlSearchParamsUtil = new UrlSearchParamsUtils({
  zodSchema: transformOptions,
});
