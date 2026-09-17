import type { Message } from '@k8ordo/i18n';
import { Heading, Separator } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { locateSection } from '../data/packages';
import type { SitePath } from '../links';
import * as m from '../messages';
import { LocaleAnchor } from './locale-anchor';
import { PageTitle } from './page-title';
import { Rich } from './rich';

type DocPageProps = {
  /** The page's own pattern. Its title and its neighbours come from `PACKAGES`. */
  path: SitePath;
  introduction: Message;
  children: ReactNode;
};

/**
 * One section page of a package's guide. The title is the section's label in
 * `PACKAGES` rather than a prop, so the header, the footer, the pager and the
 * page itself cannot name the same page differently.
 */
export function DocPage({ path, introduction, children }: DocPageProps) {
  const { pkg, section, previous, next } = locateSection(path);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name={`${section.label()} — ${pkg.name}`} />
      <div className="flex flex-col gap-4">
        <span className="text-fg-mute text-sm">
          <LocaleAnchor path={pkg.path}>{pkg.name}</LocaleAnchor>
        </span>
        <Heading level="h1">{section.label()}</Heading>
        <p className="text-fg-mute text-lg leading-relaxed">
          <Rich>{introduction()}</Rich>
        </p>
      </div>
      {children}
      <Separator color="mute" />
      <nav
        aria-label={m.docPage.pager()}
        className="flex flex-wrap justify-between gap-4 text-sm"
      >
        <span className="flex flex-col gap-1">
          <span className="text-fg-subtle">{m.docPage.previous()}</span>
          <LocaleAnchor path={previous.path}>{previous.label()}</LocaleAnchor>
        </span>
        {next !== undefined && (
          <span className="flex flex-col items-end gap-1">
            <span className="text-fg-subtle">{m.docPage.next()}</span>
            <LocaleAnchor path={next.path}>{next.label()}</LocaleAnchor>
          </span>
        )}
      </nav>
    </div>
  );
}

type DocSectionProps = {
  title: Message;
  description?: Message;
  children?: ReactNode;
};

/** A top-level section of a guide page: a rule, an h2, its lead, its body. */
export function DocSection({ title, description, children }: DocSectionProps) {
  return (
    <>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{title()}</Rich>
        </Heading>
        {description !== undefined && (
          <p className="text-fg-mute leading-relaxed">
            <Rich>{description()}</Rich>
          </p>
        )}
        {children}
      </section>
    </>
  );
}
