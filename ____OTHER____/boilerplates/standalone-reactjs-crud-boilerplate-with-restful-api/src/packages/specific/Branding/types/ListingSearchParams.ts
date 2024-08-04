import { lisitngUrlSearchParamsUtils } from '../utils/listingUrlSearchParams';
import { GetTypeOfSearchParamsFromUrlParamsUtils } from '~/overrides/remixjs/client';

export type ListingSearchParams = GetTypeOfSearchParamsFromUrlParamsUtils<typeof lisitngUrlSearchParamsUtils>;
