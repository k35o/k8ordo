import { Anchor, Heading, Separator, TableOfContents } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/table-of-contents.module.css';

const USAGE = `<TableOfContents
  items={[
    { id: 'import', label: 'Import' },
    {
      id: 'usage',
      label: 'Usage',
      children: [{ id: 'active', label: 'How the current heading is chosen' }],
    },
    { id: 'props', label: 'Props' },
  ]}
/>`;

// 目次はこのページ自身の見出しを指す。Heading はクラスを受けないので、
// id と scroll-margin は包む要素に付ける
const Section = ({ id, children }: { id: string; children: ReactNode }) => (
  <div className={styles.section} id={id}>
    {children}
  </div>
);

const ITEMS = () => [
  { id: 'import', label: m.components.common.importTitle() },
  {
    id: 'usage',
    label: m.components.common.usageTitle(),
    children: [
      { id: 'active', label: m.components.tableOfContents.activeTitle() },
    ],
  },
  { id: 'props', label: m.components.common.propsTitle() },
];

export default function TableOfContentsPage() {
  return (
    <div className={page.page}>
      <PageTitle name="TableOfContents" />
      <div className={page.stack}>
        <Heading level="h1">TableOfContents</Heading>
        <p className={page.lead}>
          <Rich>{m.components.tableOfContents.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-navigation-table-of-contents--default`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className={page.stack}>
        <Section id="import">
          <Heading level="h2">
            <Rich>{m.components.common.importTitle()}</Rich>
          </Heading>
        </Section>
        <CodeBlock
          code="import { TableOfContents } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Section id="usage">
            <Heading level="h2">
              <Rich>{m.components.common.usageTitle()}</Rich>
            </Heading>
          </Section>
          <p className={page.mute}>
            <Rich>{m.components.tableOfContents.basicDescription()}</Rich>
          </p>
          <ComponentPreview code={USAGE}>
            <div className={styles.frame}>
              <TableOfContents items={ITEMS()} />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Section id="active">
            <Heading level="h3">
              <Rich>{m.components.tableOfContents.activeTitle()}</Rich>
            </Heading>
          </Section>
          <p className={page.mute}>
            <Rich>{m.components.tableOfContents.activeDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Section id="props">
          <Heading level="h2">
            <Rich>{m.components.common.propsTitle()}</Rich>
          </Heading>
        </Section>
        <PropsTable
          inherits={inheritsOf('TableOfContents')}
          items={propsOf('TableOfContents')}
          messagesNote
        />
      </section>
    </div>
  );
}
