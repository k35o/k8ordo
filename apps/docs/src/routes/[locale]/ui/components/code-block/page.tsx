import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/code-block.module.css';

const SAMPLE = `export function Total({ items }: { items: Item[] }) {
  const done = items.filter((item) => item.done).length;
  return <p>{done} / {items.length}</p>;
}`;

const RATE = `const done = items.filter((item) => item.done).length;
const rate = done / items.length;
const rate = items.length === 0 ? 0 : done / items.length;`;

export default function CodeBlockPage() {
  return (
    <div className={page.page}>
      <PageTitle name="CodeBlock" />
      <div className={page.stack}>
        <Heading level="h1">CodeBlock</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <p className={page.mute}>
          <Rich>{m.components.codeBlock.importDescription()}</Rich>
        </p>
        <CodeBlock
          code="import { CodeBlock } from '@k8ordo/ui/code-block';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            stage="article"
            code='<CodeBlock code={source} lang="tsx" />'
          >
            <div className={styles.frame}>
              <CodeBlock code={SAMPLE} lang="tsx" />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.codeBlock.titleTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.codeBlock.titleDescription()}</Rich>
          </p>
          <ComponentPreview
            stage="article"
            code='<CodeBlock code={source} lang="tsx" title="total.tsx" />'
          >
            <div className={styles.frame}>
              <CodeBlock code={SAMPLE} lang="tsx" title="total.tsx" />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.codeBlock.marksTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.codeBlock.marksDescription()}</Rich>
          </p>
          <ComponentPreview
            stage="article"
            code={`<CodeBlock
  code={source}
  lang="ts"
  marks={{ 1: 'highlight', 2: 'remove', 3: 'add' }}
/>`}
          >
            <div className={styles.frame}>
              <CodeBlock
                code={RATE}
                lang="ts"
                marks={{ 1: 'highlight', 2: 'remove', 3: 'add' }}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.codeBlock.calloutsTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.codeBlock.calloutsDescription()}</Rich>
          </p>
          <ComponentPreview
            stage="article"
            code={`<CodeBlock
  callouts={{ 3: 'Guard the division when the list is empty' }}
  code={source}
  lang="ts"
/>`}
          >
            <div className={styles.frame}>
              <CodeBlock
                callouts={{ 3: 'Guard the division when the list is empty' }}
                code={RATE}
                lang="ts"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.codeBlock.colorsTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.codeBlock.colorsDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
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
