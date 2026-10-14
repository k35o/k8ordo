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

import styles from './doc-page.module.css';

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
  // oxlint-disable-next-line react/no-react-children
  Children.toArray(children).flatMap((child): TableOfContentsItem[] => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return outlineOf(child.props.children);
    }
    if (!isSection(child, [DocSection, Playground, ApiEntry])) return [];
    // oxlint-disable-next-line react/no-react-children
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
    className={styles.pager}
    data-direction={direction}
    href={href(section.path)}
  >
    <span className={styles.pagerDirection}>
      {direction === 'previous' ? m.docPage.previous() : m.docPage.next()}
    </span>
    <span className={styles.pagerLabel}>{section.label()}</span>
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
    <div className={styles.page}>
      <article className={styles.article}>
        <PageTitle name={`${section.label()} — ${pkg.name}`} />
        <header className={styles.header}>
          <Breadcrumb.List size="sm">
            <Breadcrumb.Item>
              <Breadcrumb.Link href={href(pkg.path)}>
                {pkg.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <span className={styles.group}>{group.label()}</span>
            </Breadcrumb.Item>
          </Breadcrumb.List>
          <Heading level="h1">{section.label()}</Heading>
          <p className={styles.introduction}>
            <Rich>{introduction()}</Rich>
          </p>
        </header>
        {outline.length > 0 && (
          <details className={styles.outline}>
            <summary className={styles.outlineSummary}>
              {m.docPage.onThisPage()}
            </summary>
            <div className={styles.outlineBody}>
              <TableOfContents items={outline} label={m.docPage.onThisPage()} />
            </div>
          </details>
        )}
        <div className={styles.sections}>{children}</div>
        <footer className={styles.footer}>
          <nav aria-label={m.docPage.pager()} className={styles.pagers}>
            <PagerCard direction="previous" section={previous} />
            {next !== undefined && (
              <PagerCard direction="next" section={next} />
            )}
          </nav>
          <a
            className={styles.edit}
            href={sourceOf(path)}
            rel="noopener noreferrer"
            target="_blank"
          >
            {m.docPage.editOnGitHub()}
          </a>
        </footer>
      </article>
      {outline.length > 0 && (
        <aside className={styles.toc}>
          <TableOfContents items={outline} label={m.docPage.onThisPage()} />
        </aside>
      )}
    </div>
  );
}

/** A top-level section of a page: a rule, an h2, then its text. */
export function DocSection({ id, title, children }: SectionProps) {
  return (
    <section aria-labelledby={id} className={styles.section}>
      <Heading id={id} level="h2">
        <Rich>{title()}</Rich>
      </Heading>
      <Prose>{children}</Prose>
    </section>
  );
}

/** A subsection inside a `DocSection`: an h3 the contents list under it. */
export function DocSubsection({ id, title, children }: SectionProps) {
  return (
    <section aria-labelledby={id} className={styles.subsection}>
      <Heading id={id} level="h3">
        <Rich>{title()}</Rich>
      </Heading>
      {children}
    </section>
  );
}
