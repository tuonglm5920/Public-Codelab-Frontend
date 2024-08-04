import axios, { AxiosResponse } from 'axios';
import { SessionExpiredFullUrl } from '~/packages/common/Auth/constants/SessionExpired';
import { RefreshTokenResponse, RefreshTokenData } from '~/routes/_auth.refresh-token';
import { FetchAPI } from '~/shared/utilities';

export const fetchApiClient = new FetchAPI({
  baseConfig: {
    baseURL: 'https://express-for-boilerplates-with-restful-api.vercel.app',
  },
  refreshTokenConfig: {
    request: async ({ accessToken, refreshToken }) => {
      const response = await axios.request<
        RefreshTokenResponse | undefined,
        AxiosResponse<RefreshTokenResponse | undefined>,
        RefreshTokenData
      >({
        method: 'POST',
        url: '/refresh-token',
        data: {
          accessToken,
          refreshToken,
        },
      });
      return response;
    },
    success: response => {
      console.log('Token refreshed successfully!', response.data?.info);
      fetchApiClient.setAccessToken = () => response.data?.info.session.accessToken ?? '';
      fetchApiClient.setRefreshToken = () => response.data?.info.session.refreshToken ?? '';
    },
    failure: error => {
      console.log('Token refreshed failure!', error);
      return window.location.replace(SessionExpiredFullUrl);
    },
    setRefreshCondition: error => {
      return error.response?.status === 403;
    },
  },
  setAccessToken: () => {
    return '';
  },
  setConditionApplyAccessToken: () => {
    return true;
  },
  setRefreshToken: () => {
    return '';
  },
});
