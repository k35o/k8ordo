import type { Message } from '@k8ordo/i18n';
import { Breadcrumb, Heading, Prose, TableOfContents } from '@k8ordo/ui';
import type { TableOfContentsItem } from '@k8ordo/ui';
import { Children, Fragment, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { locateSection } from '../data/packages';
import type { PackageSection } from '../data/packages';
import { href } from '../links';
import type { SitePath } from '../links';
import * as m from '../messages';
import { ApiEntry } from './api-entry';
import { PageTitle } from './page-title';
import { Playground } from './playground';
import { Rich } from './rich';

type SectionProps = {
  id: string;
  title: Message;
  children?: ReactNode;
};

// 目次が読む見出し。ApiEntry は文言ではなく export の名前を見出しにする
type OutlineProps = {
  id: string;
  title?: Message;
  name?: string;
  children?: ReactNode;
};

// 目次には見出しの文字だけを出す。`code` の印は Rich が描くときにしか要らない
const plain = (text: string): string => text.replaceAll('`', '');

const labelOf = ({ title, name }: OutlineProps): string =>
  plain(title?.() ?? name ?? '');

const isSection = (
  node: ReactNode,
  types: readonly unknown[],
): node is ReactElement<OutlineProps> =>
  isValidElement(node) && types.includes(node.type);

/**
 * The page's own headings, read off its children on the server: every
 * `DocSection` and `Playground` is an h2 and every `DocSubsection` inside one
 * an h3, so the contents cannot list a heading the page does not have.
 */
const outlineOf = (children: ReactNode): TableOfContentsItem[] =>
  Children.toArray(children).flatMap((child): TableOfContentsItem[] => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return outlineOf(child.props.children);
    }
    if (!isSection(child, [DocSection, Playground, ApiEntry])) return [];
    const subsections = Children.toArray(child.props.children)
      .filter((node) => isSection(node, [DocSubsection]))
      .map((node) => ({ id: node.props.id, label: labelOf(node.props) }));
    return [
      {
        id: child.props.id,
        label: labelOf(child.props),
        ...(subsections.length > 0 ? { children: subsections } : {}),
      },
    ];
  });

// ページの元は routes の下のディレクトリにあり、[locale] は URL では :locale
const sourceOf = (path: SitePath): string =>
  `https://github.com/k35o/k8ordo/edit/main/apps/docs/src/routes/%5Blocale%5D${path.replace('/:locale', '')}/page.tsx`;

const PagerCard = ({
  direction,
  section,
}: {
  direction: 'previous' | 'next';
  section: PackageSection;
}) => (
  <a
    className="border-border-mute hover:bg-bg-mute focus-visible:ring-border-info flex flex-1 flex-col gap-1 rounded-lg border px-5 py-4 transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden data-[direction=next]:items-end data-[direction=next]:text-end"
    data-direction={direction}
    href={href(section.path)}
  >
    <span className="text-fg-mute text-sm">
      {direction === 'previous' ? m.docPage.previous() : m.docPage.next()}
    </span>
    <span className="text-fg-base font-bold">{section.label()}</span>
  </a>
);

type DocPageProps = {
  /** The page's own pattern. Its title, group and neighbours come from `PACKAGES`. */
  path: SitePath;
  introduction: Message;
  children: ReactNode;
};

/**
 * One page of a package's documentation. The title is the section's label in
 * `PACKAGES` rather than a prop, so the sidebar, the pager and the page itself
 * cannot name the same page differently; the contents on the right are the
 * page's own sections.
 */
export function DocPage({ path, introduction, children }: DocPageProps) {
  const { pkg, group, section, previous, next } = locateSection(path);
  const outline = outlineOf(children);

  return (
    <div className="flex gap-8 py-10">
      <article className="min-w-0 flex-1 [&_[id]]:scroll-mt-[calc(var(--header-h)+1.5rem)]">
        <PageTitle name={`${section.label()} — ${pkg.name}`} />
        <header className="flex flex-col gap-4">
          <Breadcrumb.List size="sm">
            <Breadcrumb.Item>
              <Breadcrumb.Link href={href(pkg.path)}>
                {pkg.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <span className="text-fg-mute">{group.label()}</span>
            </Breadcrumb.Item>
          </Breadcrumb.List>
          <Heading level="h1">{section.label()}</Heading>
          <p className="text-fg-base text-lg leading-relaxed">
            <Rich>{introduction()}</Rich>
          </p>
        </header>
        {outline.length > 0 && (
          <details className="border-border-mute mt-8 rounded-lg border px-4 py-3 xl:hidden">
            <summary className="text-fg-base cursor-pointer text-sm font-bold">
              {m.docPage.onThisPage()}
            </summary>
            <div className="mt-3">
              <TableOfContents items={outline} label={m.docPage.onThisPage()} />
            </div>
          </details>
        )}
        <div className="mt-12 flex flex-col gap-12">{children}</div>
        <footer className="mt-16 flex flex-col gap-6">
          <nav
            aria-label={m.docPage.pager()}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <PagerCard direction="previous" section={previous} />
            {next !== undefined && (
              <PagerCard direction="next" section={next} />
            )}
          </nav>
          <a
            className="text-fg-mute hover:text-fg-base text-sm underline-offset-4 hover:underline"
            href={sourceOf(path)}
            rel="noopener noreferrer"
            target="_blank"
          >
            {m.docPage.editOnGitHub()}
          </a>
        </footer>
      </article>
      {outline.length > 0 && (
        <aside className="sticky top-[calc(var(--header-h)+2.5rem)] hidden max-h-[calc(100dvh-var(--header-h)-5rem)] w-48 shrink-0 self-start overflow-y-auto xl:block">
          <TableOfContents items={outline} label={m.docPage.onThisPage()} />
        </aside>
      )}
    </div>
  );
}

type DocSectionProps = SectionProps & {
  description?: Message;
};

/** A top-level section of a page: a rule, an h2, then its text. */
export function DocSection({
  id,
  title,
  description,
  children,
}: DocSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="border-border-mute flex flex-col gap-4 border-t pt-10"
    >
      <Heading id={id} level="h2">
        <Rich>{title()}</Rich>
      </Heading>
      <Prose>
        {description !== undefined && (
          <p>
            <Rich>{description()}</Rich>
          </p>
        )}
        {children}
      </Prose>
    </section>
  );
}

/** A subsection inside a `DocSection`: an h3 the contents list under it. */
export function DocSubsection({ id, title, children }: SectionProps) {
  return (
    <section aria-labelledby={id} className="mt-8 flex flex-col gap-3">
      <Heading id={id} level="h3">
        <Rich>{title()}</Rich>
      </Heading>
      {children}
    </section>
  );
}
