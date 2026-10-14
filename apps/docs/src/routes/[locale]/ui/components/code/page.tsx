import { Anchor, Code, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function CodePage() {
  return (
    <div className={page.page}>
      <PageTitle name="Code" />
      <div className={page.stack}>
        <Heading level="h1">Code</Heading>
        <p className={page.lead}>
          <Rich>{m.components.code.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-code--default`}
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
        <CodeBlock code="import { Code } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<p>
  Use the <Code>console.log()</Code> function
  to output values.
</p>`}
          >
            <p>
              Use the <Code>console.log()</Code> function to output values.
            </p>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.code.colorDetectionTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Code>#ff6347</Code>
<Code>#3498db</Code>
<Code>background: #22c55e</Code>`}
          >
            <Code>#ff6347</Code>
            <Code>#3498db</Code>
            <Code>background: #22c55e</Code>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Code')} items={propsOf('Code')} />
      </section>
    </div>
  );
}
