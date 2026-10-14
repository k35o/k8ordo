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
import styles from '../../../../../styles/pages/ui/components/heading.module.css';

export default function HeadingPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Heading" />
      <div className={page.stack}>
        <Heading level="h1">Heading</Heading>
        <p className={page.lead}>
          <Rich>{m.components.heading.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-heading--h-1`}
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
        <CodeBlock code="import { Heading } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Heading level="h2">Section Title</Heading>'>
            <Heading level="h2">Section Title</Heading>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.heading.typesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Heading level="h1">Heading 1</Heading>
<Heading level="h2">Heading 2</Heading>
<Heading level="h3">Heading 3</Heading>
<Heading level="h4">Heading 4</Heading>
<Heading level="h5">Heading 5</Heading>
<Heading level="h6">Heading 6</Heading>`}
          >
            <div className={page.stack}>
              <Heading level="h1">Heading 1</Heading>
              <Heading level="h2">Heading 2</Heading>
              <Heading level="h3">Heading 3</Heading>
              <Heading level="h4">Heading 4</Heading>
              <Heading level="h5">Heading 5</Heading>
              <Heading level="h6">Heading 6</Heading>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.heading.lineClampTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Heading lineClamp={1} level="h3">
  This is a very long heading text that will be
  truncated to a single line using line clamp
</Heading>`}
          >
            <div className={styles.frame}>
              <Heading lineClamp={1} level="h3">
                This is a very long heading text that will be truncated to a
                single line using line clamp
              </Heading>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Heading')}
          items={propsOf('Heading')}
        />
      </section>
    </div>
  );
}
