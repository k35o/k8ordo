'use client';

import { AlertIcon, Button, Heading } from '@k8ordo/ui';
import type { FC } from 'react';

import type { Locale } from '../i18n';
import { messages } from '../i18n';

type ErrorFallbackProps = {
  resetErrorBoundary: () => void;
  fullScreen?: boolean;
  locale?: Locale;
};

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  resetErrorBoundary,
  fullScreen = false,
  locale = 'ja',
}) => {
  const t = (key: 'error.title' | 'error.description' | 'error.retry') =>
    messages[locale][key];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 p-8 ${fullScreen ? 'h-dvh' : 'h-full'}`}
    >
      <div className="text-fg-error">
        <AlertIcon size="lg" status="error" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Heading level="h2">{t('error.title')}</Heading>
        <p className="text-fg-mute text-sm">{t('error.description')}</p>
      </div>
      <Button onClick={resetErrorBoundary} variant="outline">
        {t('error.retry')}
      </Button>
    </div>
  );
};
