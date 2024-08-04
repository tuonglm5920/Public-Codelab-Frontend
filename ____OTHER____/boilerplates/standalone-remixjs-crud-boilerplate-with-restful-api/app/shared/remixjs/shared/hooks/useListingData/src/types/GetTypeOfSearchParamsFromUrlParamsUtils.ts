import { TypeOf } from 'zod';
import { GetGeneric } from '~/shared/typescript-utilities';
import { UrlSearchParamsUtils } from '~/shared/utilities';

export type GetTypeOfSearchParamsFromUrlParamsUtils<T extends UrlSearchParamsUtils<any>> = TypeOf<
  // @ts-ignore
  GetGeneric<Exclude<T['_zodSchema'], undefined>>
>;
