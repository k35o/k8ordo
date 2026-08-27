import { Anchor, Card, Grid, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { inheritsOf, propsOf } from '../../data/component-props';

function Cell({ children }: { children: string }) {
  return (
    <Card variant="outline">
      <div className="px-3 py-2 text-center text-sm">{children}</div>
    </Card>
  );
}

export function GridPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Grid</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.grid.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-grid--docs`}
            openInNewTab
          >
            <T k="components.common.storybookLink" />
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.importTitle" />
        </Heading>
        <CodeBlock code="import { Grid } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.grid.colsTitle" />
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
            <T k="components.grid.autoFillTitle" />
          </Heading>
          <p className="text-fg-mute text-sm">
            <T k="components.grid.autoFillDescription" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Grid')} items={propsOf('Grid')} />
      </section>
    </div>
  );
}
