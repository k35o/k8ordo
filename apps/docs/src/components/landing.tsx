import type { Message } from '@k8ordo/i18n';
import { GitHubIcon, Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';
import type { ReactNode } from 'react';

import { PACKAGES } from '../data/packages';
import { docsPathOf } from '../data/shipped-docs';
import { href } from '../links';
import type { SitePath } from '../links';
import * as m from '../messages';
import { InstallTabs } from './install-tabs';
import { LinkButton } from './link-button';
import { LocaleAnchor } from './locale-anchor';
import { PageTitle } from './page-title';
import { Rich } from './rich';

type LandingHeroProps = {
  /** The published name, e.g. `@k8ordo/form`. */
  name: string;
  /** The directory under `packages/`. */
  directory: string;
  /** One sentence: what the package is for. */
  tagline: Message;
  /** What to install, after the package manager's own command. */
  install: string;
  /** The smallest code that shows the point, beside the name. */
  code: ReactNode;
};

/** The top of a package's landing: what it is, how to get it, and the point in code. */
export function LandingHero({
  name,
  directory,
  tagline,
  install,
  code,
}: LandingHeroProps) {
  const pkg = PACKAGES.find((entry) => entry.name === name);
  if (pkg === undefined) throw new Error(`${name} is not in PACKAGES`);
  const [start] = pkg.groups[0].sections;

  return (
    <section className="grid items-center gap-12 pt-16 pb-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:pt-24">
      <PageTitle name={name} />
      <div className="flex flex-col gap-6">
        <Heading level="h1">{name}</Heading>
        <p className="text-fg-base break-phrase text-xl leading-relaxed">
          <Rich>{tagline()}</Rich>
        </p>
        <InstallTabs
          npm={<CodeBlock code={`npm install ${install}`} lang="bash" />}
          pnpm={<CodeBlock code={`pnpm add ${install}`} lang="bash" />}
          yarn={<CodeBlock code={`yarn add ${install}`} lang="bash" />}
        />
        <div className="flex flex-wrap items-center gap-4">
          <LinkButton href={href(start.path)} variant="solid">
            {start.label()}
          </LinkButton>
          <LinkButton
            color="base"
            external
            href={`https://github.com/k35o/k8ordo/tree/main/packages/${directory}`}
            startIcon={<GitHubIcon />}
          >
            {m.common.github()}
          </LinkButton>
          <LinkButton
            color="base"
            external
            href={`https://www.npmjs.com/package/${name}`}
          >
            npm
          </LinkButton>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3">{code}</div>
    </section>
  );
}

type LandingClaimProps = {
  title: Message;
  /** Two or three sentences, one message each. */
  body: readonly Message[];
  /** The code or demo that backs the claim. */
  children: ReactNode;
};

/** One thing the package promises: the claim, a few sentences, and the proof beside them. */
export function LandingClaim({ title, body, children }: LandingClaimProps) {
  return (
    <section className="grid gap-8 py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
      <div className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{title()}</Rich>
        </Heading>
        {body.map((sentence) => (
          <p className="text-fg-base leading-loose" key={sentence()}>
            <Rich>{sentence()}</Rich>
          </p>
        ))}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

type NextStep = { path: SitePath; label: Message; description: Message };

type NextStepsProps = {
  steps: readonly NextStep[];
  /** The published name, for where the site serves its shipped GUIDE.md. */
  name: string;
};

/** Where to go from the landing: a plain list, one line each. */
export function NextSteps({ steps, name }: NextStepsProps) {
  return (
    <section className="pt-14 pb-24">
      <Heading level="h2">{m.landing.nextTitle()}</Heading>
      <ul className="border-border-mute mt-6 flex flex-col border-t">
        {steps.map((step) => (
          <li className="border-border-mute border-b" key={step.path}>
            <LocaleAnchor
              className="hover:bg-bg-mute focus-visible:ring-border-info flex flex-col gap-1 px-2 py-4 transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden sm:flex-row sm:items-baseline sm:gap-6"
              path={step.path}
              unstyled
            >
              <span className="text-fg-base font-bold sm:w-56 sm:shrink-0">
                {step.label()}
              </span>
              <span className="text-fg-mute text-sm">
                <Rich>{step.description()}</Rich>
              </span>
            </LocaleAnchor>
          </li>
        ))}
      </ul>
      <p className="text-fg-mute mt-6 text-sm leading-relaxed">
        {m.landing.agents()}{' '}
        <a
          className="text-fg-base underline underline-offset-4"
          href={`${docsPathOf(name)}GUIDE.md`}
        >
          GUIDE.md
        </a>
      </p>
    </section>
  );
}
