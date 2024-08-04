import { redirect as redirectReactRouterDom } from 'react-router-dom';
import { TypedResponse } from './types';

export const redirect = redirectReactRouterDom as unknown as (
  url: string,
  init?: number | ResponseInit,
) => TypedResponse<never>;
