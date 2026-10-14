import type { Message } from '@k8ordo/i18n';
import { GitHubIcon, Heading } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { PACKAGES } from '../data/packages';
import { href } from '../links';
import * as m from '../messages';
import { CodeBlock } from './code-block';
import { InstallTabs } from './install-tabs';
import { LinkButton } from './link-button';
import { PageTitle } from './page-title';
import { Rich } from './rich';

import styles from './landing.module.css';

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
    <section className={styles.hero}>
      <PageTitle name={name} />
      <div className={styles.intro}>
        <Heading level="h1">{name}</Heading>
        <p className={styles.tagline}>
          <Rich>{tagline()}</Rich>
        </p>
        <InstallTabs
          npm={<CodeBlock code={`npm install ${install}`} lang="bash" />}
          pnpm={<CodeBlock code={`pnpm add ${install}`} lang="bash" />}
          yarn={<CodeBlock code={`yarn add ${install}`} lang="bash" />}
        />
        <div className={styles.links}>
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
      <div className={styles.code}>{code}</div>
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
    <section className={styles.claim}>
      <div className={styles.claimText}>
        <Heading level="h2">
          <Rich>{title()}</Rich>
        </Heading>
        {body.map((sentence) => (
          <p className={styles.sentence} key={sentence()}>
            <Rich>{sentence()}</Rich>
          </p>
        ))}
      </div>
      <div className={styles.proof}>{children}</div>
    </section>
  );
}
