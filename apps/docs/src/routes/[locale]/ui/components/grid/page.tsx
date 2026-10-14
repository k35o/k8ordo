import { Anchor, Card, Grid, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/grid.module.css';

function Cell({ children }: { children: string }) {
  return (
    <Card variant="outline">
      <div className={styles.cell}>{children}</div>
    </Card>
  );
}

export default function GridPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Grid" />
      <div className={page.stack}>
        <Heading level="h1">Grid</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { Grid } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
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

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.grid.colsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Grid cols={2} gap="sm">…</Grid>
<Grid cols={4} gap="sm">…</Grid>`}
          >
            <div className={page.stack}>
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

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.grid.autoFillTitle()}</Rich>
          </Heading>
          <p className={styles.note}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Grid')} items={propsOf('Grid')} />
      </section>
    </div>
  );
}
