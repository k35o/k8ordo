import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

const SAMPLE = `export function Total({ items }: { items: Item[] }) {
  const done = items.filter((item) => item.done).length;
  return <p>{done} / {items.length}</p>;
}`;

const RATE = `const done = items.filter((item) => item.done).length;
const rate = done / items.length;
const rate = items.length === 0 ? 0 : done / items.length;`;

export default function CodeBlockPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="CodeBlock" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">CodeBlock</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.codeBlock.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-code-block--default`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.components.codeBlock.importDescription()}</Rich>
        </p>
        <CodeBlock
          code="import { CodeBlock } from '@k8ordo/ui/code-block';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<CodeBlock code={source} lang="tsx" />'>
            <div className="w-full">
              <CodeBlock code={SAMPLE} lang="tsx" />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.codeBlock.titleTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.codeBlock.titleDescription()}</Rich>
          </p>
          <ComponentPreview code='<CodeBlock code={source} lang="tsx" title="total.tsx" />'>
            <div className="w-full">
              <CodeBlock code={SAMPLE} lang="tsx" title="total.tsx" />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.codeBlock.marksTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.codeBlock.marksDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<CodeBlock
  code={source}
  lang="ts"
  marks={{ 1: 'highlight', 2: 'remove', 3: 'add' }}
/>`}
          >
            <div className="w-full">
              <CodeBlock
                code={RATE}
                lang="ts"
                marks={{ 1: 'highlight', 2: 'remove', 3: 'add' }}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.codeBlock.calloutsTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.codeBlock.calloutsDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<CodeBlock
  callouts={{ 3: 'Guard the division when the list is empty' }}
  code={source}
  lang="ts"
/>`}
          >
            <div className="w-full">
              <CodeBlock
                callouts={{ 3: 'Guard the division when the list is empty' }}
                code={RATE}
                lang="ts"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.codeBlock.colorsTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.codeBlock.colorsDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('CodeBlock')}
          items={propsOf('CodeBlock')}
          messagesNote
        />
      </section>
    </div>
  );
}
