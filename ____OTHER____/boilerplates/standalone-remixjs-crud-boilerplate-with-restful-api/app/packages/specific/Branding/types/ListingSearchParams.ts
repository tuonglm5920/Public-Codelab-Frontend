import { lisitngUrlSearchParamsUtils } from '../utils/listingUrlSearchParams';
import { GetTypeOfSearchParamsFromUrlParamsUtils } from '~/shared/remixjs/client';

export type ListingSearchParams = GetTypeOfSearchParamsFromUrlParamsUtils<typeof lisitngUrlSearchParamsUtils>;
