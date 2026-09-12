'use client';

import { Button, Heading } from '@k8ordo/ui';

import { PageTitle } from '../../components/page-title';
import { locales, useTranslation } from '../../i18n';

export default function NotFound() {
  const { t, locale } = useTranslation();

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 px-6 py-12 md:px-8">
      <PageTitle k="notFound.title" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">{t('notFound.title')}</Heading>
        <p className="text-fg-mute">{t('notFound.description')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button
          renderItem={({ className, children }) => (
            <a className={className} href={locales.localize('/', locale)}>
              {children}
            </a>
          )}
          size="md"
          variant="solid"
        >
          {t('nav.home')}
        </Button>
        <Button
          color="base"
          renderItem={({ className, children }) => (
            <a
              className={className}
              href={locales.localize('/ui/get-started', locale)}
            >
              {children}
            </a>
          )}
          size="md"
          variant="outline"
        >
          {t('nav.getStarted')}
        </Button>
      </div>
    </div>
  );
}
