import { Anchor, Badge, Heading, Separator, Stack } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

const sampleItems = ['Active', 'Pending', 'Error'] as const;
const SAMPLE_TONE = ['success', 'warning', 'error'] as const;

export default function StackPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Stack" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Stack</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.stack.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-stack--docs`}
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
        <CodeBlock code="import { Stack } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Stack direction="row" gap="sm">
  <Badge label="Active" tone="success" />
  <Badge label="Pending" tone="warning" />
  <Badge label="Error" tone="error" />
</Stack>`}
          >
            <Stack direction="row" gap="sm">
              {sampleItems.map((label, i) => (
                <Badge key={label} label={label} tone={SAMPLE_TONE[i]} />
              ))}
            </Stack>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.stack.directionTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Stack direction="column" gap="sm">…</Stack>
<Stack direction="row" gap="sm">…</Stack>`}
          >
            <Stack direction="column" gap="md">
              <Stack direction="column" gap="sm">
                {sampleItems.map((label, i) => (
                  <Badge key={label} label={label} tone={SAMPLE_TONE[i]} />
                ))}
              </Stack>
              <Stack direction="row" gap="sm">
                {sampleItems.map((label, i) => (
                  <Badge key={label} label={label} tone={SAMPLE_TONE[i]} />
                ))}
              </Stack>
            </Stack>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.stack.gapTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Stack direction="row" gap="none|sm|md|lg|xl">…</Stack>'>
            <Stack direction="column" gap="md">
              {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
                <Stack direction="row" gap={g} key={g}>
                  <Badge label={`gap=${g}`} tone="neutral" variant="outline" />
                  <Badge label="A" tone="info" />
                  <Badge label="B" tone="info" />
                  <Badge label="C" tone="info" />
                </Stack>
              ))}
            </Stack>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.stack.alignTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Stack direction="row" align="center" justify="between">…</Stack>'>
            <div className="bg-bg-mute rounded-lg p-3">
              <Stack align="center" direction="row" gap="md" justify="between">
                <Badge label="L" tone="info" />
                <Badge label="C" tone="success" />
                <Badge label="R" tone="warning" />
              </Stack>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Stack')} items={propsOf('Stack')} />
      </section>
    </div>
  );
}
