import type { Message } from '@k8ordo/i18n';
import { GitHubIcon, Heading } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { PACKAGES } from '../data/packages';
import { href } from '../links';
import * as m from '../messages';
import { LinkButton } from './link-button';
import { LocaleAnchor } from './locale-anchor';
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
  const pkg = PACKAGES.find((entry) => entry.name === name);
  if (pkg === undefined) throw new Error(`${name} is not in PACKAGES`);
  const [firstSection] = pkg.sections;

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
            <LinkButton href={href(firstSection.path)} variant="solid">
              {firstSection.label()}
            </LinkButton>
            <LinkButton
              color="base"
              external
              href={`https://www.npmjs.com/package/${name}`}
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
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pkg.sections.map((section, index) => (
            <li key={section.path}>
              <LocaleAnchor
                className="border-border-mute hover:bg-bg-mute focus-visible:ring-border-info flex items-baseline gap-3 rounded-lg border p-5 transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden"
                path={section.path}
                unstyled
              >
                <span className="text-fg-subtle text-sm tabular-nums">
                  {index + 1}
                </span>
                <span className="text-fg-base font-medium">
                  {section.label()}
                </span>
              </LocaleAnchor>
            </li>
          ))}
        </ol>
        <p className="text-fg-mute mt-8 max-w-2xl text-sm leading-relaxed">
          <Rich>{docsDescription()}</Rich>
        </p>
        <div className="mt-6">
          <LinkButton
            color="base"
            external
            href={`/${directory}/docs/GUIDE.md`}
          >
            GUIDE.md
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
