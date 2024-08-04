import { json as jsonReactRouterDom } from 'react-router-dom';
import { TypedResponse } from '..';

type JsonFunction = <Data>(data: Data, init?: number | ResponseInit) => TypedResponse<Data>;

export const json = jsonReactRouterDom as JsonFunction;
