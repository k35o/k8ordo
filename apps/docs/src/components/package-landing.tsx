import type { Message } from '@k8ordo/i18n';
import { GitHubIcon, Heading } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { getLocale, locales } from '../i18n';
import * as m from '../messages';
import { LinkButton } from './link-button';
import { PageTitle } from './page-title';
import { Rich } from './rich';

export type PackageFeature = {
  title: Message;
  description: Message;
  icon: ReactNode;
};

export type PackageLandingProps = {
  /** The published name, e.g. `@k8ordo/router`. */
  name: string;
  /** The directory under `packages/`. */
  directory: string;
  description: Message;
  featuresTitle: Message;
  features: readonly PackageFeature[];
  docsTitle: Message;
  docsDescription: Message;
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
  const locale = getLocale();

  return (
    <div className="flex flex-1 flex-col">
      <PageTitle name={name} />
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col justify-center gap-8">
          <Heading level="h1">{name}</Heading>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {description()}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton
              external
              href={`https://www.npmjs.com/package/${name}`}
              variant="solid"
            >
              npm
            </LinkButton>
            <LinkButton
              color="base"
              external
              href={`https://github.com/k35o/k8ordo/tree/main/packages/${directory}`}
              startIcon={<GitHubIcon />}
            >
              {m.common.github()}
            </LinkButton>
          </div>
        </div>
      </section>

      {children}

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{featuresTitle()}</Heading>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <li
              className="border-border-mute flex flex-col gap-3 rounded-lg border p-6"
              key={feature.title()}
            >
              <span className="text-primary-border flex items-center gap-2">
                {feature.icon}
                <span className="text-fg-base font-medium">
                  {feature.title()}
                </span>
              </span>
              <span className="text-fg-mute text-sm leading-relaxed">
                <Rich>{feature.description()}</Rich>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{docsTitle()}</Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <Rich>{docsDescription()}</Rich>
        </p>
        <div className="mt-6">
          <LinkButton color="base" href={locales.localize('/', locale)}>
            {m.nav.home()}
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
