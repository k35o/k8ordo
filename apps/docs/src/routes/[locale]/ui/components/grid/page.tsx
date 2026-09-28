import { Anchor, Card, Grid, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

function Cell({ children }: { children: string }) {
  return (
    <Card variant="outline">
      <div className="px-3 py-2 text-center text-sm">{children}</div>
    </Card>
  );
}

export default function GridPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Grid" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Grid</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.grid.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-layout-grid--default`}
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
        <CodeBlock code="import { Grid } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Grid cols={3} gap="md">
  {items.map((label) => <Card>{label}</Card>)}
</Grid>`}
          >
            <Grid cols={3} gap="md">
              {['A', 'B', 'C', 'D', 'E', 'F'].map((label) => (
                <Cell key={label}>{label}</Cell>
              ))}
            </Grid>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.grid.colsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Grid cols={2} gap="sm">…</Grid>
<Grid cols={4} gap="sm">…</Grid>`}
          >
            <div className="flex flex-col gap-4">
              {[2, 4].map((c) => (
                <Grid cols={c as 2 | 4} gap="sm" key={c}>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label) => (
                    <Cell key={label}>{label}</Cell>
                  ))}
                </Grid>
              ))}
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.grid.autoFillTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute text-sm">
            <Rich>{m.components.grid.autoFillDescription()}</Rich>
          </p>
          <ComponentPreview code='<Grid cols="auto-fill" minItemSize={32} gap="md">…</Grid>'>
            <Grid cols="auto-fill" gap="md" minItemSize={32}>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label) => (
                <Cell key={label}>{label}</Cell>
              ))}
            </Grid>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Grid')} items={propsOf('Grid')} />
      </section>
    </div>
  );
}
