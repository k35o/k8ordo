'use client';

import { Button, GitHubIcon, Heading } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { localizeHref, useTranslation } from '../i18n';
import type { MessageKey } from '../i18n/types';
import { T } from './t';

export type PackageFeature = {
  title: MessageKey;
  description: MessageKey;
  icon: ReactNode;
};

export type PackageLandingProps = {
  /** The published name, e.g. `@k8ordo/router`. */
  name: string;
  /** The directory under `packages/`. */
  directory: string;
  description: MessageKey;
  featuresTitle: MessageKey;
  features: readonly PackageFeature[];
  docsTitle: MessageKey;
  docsDescription: MessageKey;
  /** Anything the package wants between the hero and its features. */
  children?: ReactNode;
};

/**
 * Every package's landing page says the same things in the same order, so the
 * shape lives here and each page brings only what is its own.
 */
export function PackageLanding({
  name,
  directory,
  description,
  featuresTitle,
  features,
  docsTitle,
  docsDescription,
  children,
}: PackageLandingProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col justify-center gap-8">
          <Heading level="h1">{name}</Heading>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {t(description)}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children: label }) => (
                <a
                  className={className}
                  href={`https://www.npmjs.com/package/${name}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {label}
                </a>
              )}
              size="md"
              variant="solid"
            >
              npm
            </Button>
            <Button
              color="base"
              renderItem={({ className, children: label }) => (
                <a
                  className={className}
                  href={`https://github.com/k35o/k8ordo/tree/main/packages/${directory}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {label}
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

      {children}

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t(featuresTitle)}</Heading>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
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
        <Heading level="h2">{t(docsTitle)}</Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <T k={docsDescription} />
        </p>
        <div className="mt-6">
          <Button
            color="base"
            renderItem={({ className, children: label }) => (
              <a className={className} href={localizeHref('/', locale)}>
                {label}
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
