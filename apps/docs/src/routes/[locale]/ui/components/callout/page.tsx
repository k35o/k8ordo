import { Anchor, Callout, Code, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function CalloutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Callout" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Callout</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.callout.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-feedback-callout--info`}
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
        <CodeBlock code="import { Callout } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Callout label="Note" tone="info">
  <p>Values stay in the DOM, so typing never re-renders.</p>
</Callout>`}
          >
            <Callout label="Note" tone="info">
              <p>Values stay in the DOM, so typing never re-renders.</p>
            </Callout>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.callout.tonesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Callout label="Supported" tone="success">…</Callout>
<Callout label="Note" tone="info">…</Callout>
<Callout label="Pitfall" tone="warning">…</Callout>
<Callout label="Deprecated" tone="error">…</Callout>`}
          >
            <div className="flex w-full flex-col gap-3">
              <Callout label="Supported" tone="success">
                <p>Works in every core browser.</p>
              </Callout>
              <Callout label="Note" tone="info">
                <p>The browser checks the input before it is sent.</p>
              </Callout>
              <Callout label="Pitfall" tone="warning">
                <p>A controlled field is not restored by a form reset.</p>
              </Callout>
              <Callout label="Deprecated" tone="error">
                <p>This option goes away in the next major.</p>
              </Callout>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.callout.richTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.callout.richDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Callout label="Pitfall" tone="warning">
  <p>
    Passing <Code>value</Code> makes the field controlled, and a form
    reset no longer restores it.
  </p>
  <p>
    Pass <Code>defaultValue</Code> instead. See{' '}
    <Anchor href="https://react.dev/reference/react-dom/components/input">
      the input reference
    </Anchor>
    .
  </p>
</Callout>

<Callout tone="info">
  <p>This article reflects the API as of July 2023.</p>
</Callout>`}
          >
            <div className="flex w-full flex-col gap-3">
              <Callout label="Pitfall" tone="warning">
                <p>
                  Passing <Code>value</Code> makes the field controlled, and a
                  form reset no longer restores it.
                </p>
                <p>
                  Pass <Code>defaultValue</Code> instead. See{' '}
                  <Anchor href="https://react.dev/reference/react-dom/components/input">
                    the input reference
                  </Anchor>
                  .
                </p>
              </Callout>
              <Callout tone="info">
                <p>This article reflects the API as of July 2023.</p>
              </Callout>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.callout.versusAlertTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.callout.versusAlertDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Callout')}
          items={propsOf('Callout')}
          messagesNote
        />
      </section>
    </div>
  );
}
