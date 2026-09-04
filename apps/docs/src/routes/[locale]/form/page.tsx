'use client';

import {
  AccessibilityIcon,
  AtomIcon,
  Button,
  FormIcon,
  GitHubIcon,
  Heading,
  LockIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { T } from '../../../components/t';
import { localizeHref, useTranslation } from '../../../i18n';
import type { MessageKey } from '../../../i18n/types';

type Feature = {
  title: MessageKey;
  description: MessageKey;
  icon: ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: 'form.featureSchema',
    description: 'form.featureSchemaDescription',
    icon: <FormIcon />,
  },
  {
    title: 'form.featureNoJs',
    description: 'form.featureNoJsDescription',
    icon: <SparklesIcon />,
  },
  {
    title: 'form.featureDom',
    description: 'form.featureDomDescription',
    icon: <AtomIcon />,
  },
  {
    title: 'form.featureTypes',
    description: 'form.featureTypesDescription',
    icon: <ShieldCheckIcon />,
  },
  {
    title: 'form.featureLoud',
    description: 'form.featureLoudDescription',
    icon: <AccessibilityIcon />,
  },
  {
    title: 'form.featureSecrets',
    description: 'form.featureSecretsDescription',
    icon: <LockIcon />,
  },
];

export default function Form() {
  const { t, locale } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col justify-center gap-8">
          <Heading level="h1">@k8ordo/form</Heading>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {t('form.description')}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href="https://www.npmjs.com/package/@k8ordo/form"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              npm
            </Button>
            <Button
              color="base"
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href="https://github.com/k35o/k8ordo/tree/main/packages/form"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )}
              size="md"
              startIcon={<GitHubIcon />}
              variant="skeleton"
            >
              {t('common.github')}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('form.featuresTitle')}</Heading>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <li
              className="border-border-mute flex flex-col gap-3 rounded-lg border p-6"
              key={feature.title}
            >
              <span className="text-primary-border flex items-center gap-2">
                {feature.icon}
                <span className="text-fg-base font-medium">
                  {t(feature.title)}
                </span>
              </span>
              <span className="text-fg-mute text-sm leading-relaxed">
                <T k={feature.description} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('form.docsTitle')}</Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <T k="form.docsDescription" />
        </p>
        <div className="mt-6">
          <Button
            color="base"
            renderItem={({ className, children }) => (
              <a className={className} href={localizeHref('/', locale)}>
                {children}
              </a>
            )}
            size="md"
            variant="skeleton"
          >
            {t('nav.home')}
          </Button>
        </div>
      </section>
    </div>
  );
}
