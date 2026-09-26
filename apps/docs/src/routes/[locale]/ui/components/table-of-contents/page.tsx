import { Anchor, Heading, Separator, TableOfContents } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';
import type { ReactNode } from 'react';

import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

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
  <div className="scroll-mt-32" id={id}>
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
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12 md:px-8">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <PageTitle name="TableOfContents" />
        <div className="flex flex-col gap-4">
          <Heading level="h1">TableOfContents</Heading>
          <p className="text-fg-mute text-lg">
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

        <section className="flex flex-col gap-4">
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

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Section id="usage">
              <Heading level="h2">
                <Rich>{m.components.common.usageTitle()}</Rich>
              </Heading>
            </Section>
            <p className="text-fg-mute">
              <Rich>{m.components.tableOfContents.basicDescription()}</Rich>
            </p>
            <CodeBlock code={USAGE} lang="tsx" />
          </div>

          <div className="flex flex-col gap-4">
            <Section id="active">
              <Heading level="h3">
                <Rich>{m.components.tableOfContents.activeTitle()}</Rich>
              </Heading>
            </Section>
            <p className="text-fg-mute">
              <Rich>{m.components.tableOfContents.activeDescription()}</Rich>
            </p>
          </div>
        </section>
        <Separator color="mute" />

        <section className="flex flex-col gap-4">
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
      <aside className="sticky top-32 hidden w-56 shrink-0 self-start xl:block">
        <TableOfContents items={ITEMS()} />
      </aside>
    </div>
  );
}
