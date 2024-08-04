import { useMatches } from '@remix-run/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  /** The path to the translation files. */
  loadPath: string;
}

/**
 * Preload the translation files for the current language and the namespaces required by the routes.
 * It receives a single `loadPath` prop with the path to the translation files.
 *
 * @example
 * <PreloadTranslations loadPath="/locales/{{lng}}/{{ns}}.json" />
 *
 * @param loadPath The path to the translation files.
 */
export const PreloadTranslations: FC<Props> = ({ loadPath }) => {
  const { i18n } = useTranslation();

  const namespaces = [
    ...new Set(
      useMatches()
        .filter(route => (route.handle as { i18n?: string | string[] })?.i18n !== undefined)
        .flatMap(route => (route.handle as { i18n: string | string[] }).i18n),
    ),
  ];

  const lang = i18n.language;

  return (
    <>
      {namespaces.map(namespace => {
        return (
          <link
            key={namespace}
            rel="preload"
            as="fetch"
            href={loadPath.replace('{{lng}}', lang).replace('{{ns}}', namespace)}
          />
        );
      })}
    </>
  );
};
