import { cssBundleHref } from '@remix-run/css-bundle';
import { LinksFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import antdResetCss from 'antd/dist/reset.css';
import enUs from 'antd/locale/en_US';
import { isbot } from 'isbot';
import { keys, pick } from 'ramda';
import { FC } from 'react';
import { Empty, FixedProgressLoader, ImplicitFixSSR, Notification, ThemeProvider, usePrevious } from '~/shared/reactjs';
import { useChangeLanguage } from '~/shared/remixjs/client';
import { PageErrorBoundary } from './components/PageErrorBoundary/PageErrorBoundary';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import sharedCss from './css/shared.css';
import tailwindCss from './css/tailwind.css';
import { i18nServer, localeCookie } from './packages/common/I18n/i18n.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: antdResetCss },
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: sharedCss },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),

  // Font
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
];

export const ErrorBoundary = PageErrorBoundary;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18nServer.getLocale(request);
  const isBot = isbot(request.headers.get('user-agent') ?? '');

  const publicEnv = keys(pick(['PUBLIC_DEFAULT_LANGUAGE', 'SENTRY_DSN'], process.env)).reduce<Record<string, string>>(
    (result, item) => {
      const value = process.env[item];
      if (value) {
        return {
          ...result,
          [item]: value,
        };
      }
      return result;
    },
    {},
  );

  return json(
    {
      locale,
      env: publicEnv,
      isBot,
    },
    {
      headers: {
        'Set-Cookie': await localeCookie.serialize(locale),
      },
    },
  );
};

export const meta: MetaFunction = () => {
  return [
    {
      charset: 'utf-8',
      title: 'Remixjs boilerplate',
      viewport: 'width=device-width,initial-scale=1',
    },
  ];
};

const App: FC = () => {
  const navigation = useNavigation();
  const prevFormAction = usePrevious(navigation);
  const { locale, env, isBot } = useLoaderData<typeof loader>();

  const { i18n } = useChangeLanguage(locale);

  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
      </head>
      <body>
        <ImplicitFixSSR
          isBot={isBot}
          LoadingScreen={<SplashScreen />}
          App={
            <ThemeProvider isSSR locale={enUs} renderEmpty={() => <Empty />}>
              <Notification />
              <FixedProgressLoader
                hidden={!!prevFormAction?.formAction || !!navigation.formAction}
                done={navigation.state === 'idle'}
              />
              <Outlet />
            </ThemeProvider>
          }
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default App;
