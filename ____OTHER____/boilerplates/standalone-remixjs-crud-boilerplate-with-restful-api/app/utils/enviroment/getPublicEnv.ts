import { isBrowser } from '~/shared/utilities';

declare global {
  interface Window {
    ENV: typeof process.env;
  }
  namespace NodeJS {
    export interface ProcessEnv {
      PUBLIC_DEFAULT_LANGUAGE: string;
      SENTRY_DSN: string;
    }
  }
}

export const getPublicEnv = (key: keyof typeof process.env) => {
  const value = isBrowser() ? window.ENV?.[key] : process.env[key];
  if (!value) {
    console.error(`"${key}" is not exist in env variables`);
  }
  return value;
};
