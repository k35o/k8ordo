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
import styles from '../../../../../styles/pages/ui/components/separator.module.css';

export default function SeparatorPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Separator" />
      <div className={page.stack}>
        <Heading level="h1">Separator</Heading>
        <p className={page.lead}>
          <Rich>{m.components.separator.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-layout-separator--block`}
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
        <CodeBlock code="import { Separator } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Separator color="mute" />'>
            <div className={styles.frame}>
              <Separator color="mute" />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.separator.orientationsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Separator orientation="horizontal" />
<Separator orientation="vertical" />`}
          >
            <div className={styles.column}>
              <div className={styles.slot}>
                <Separator orientation="horizontal" />
              </div>
              <div className={styles.verticalSlot}>
                <Separator orientation="vertical" />
              </div>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.separator.colorsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Separator color="base" />
<Separator color="mute" />
<Separator color="subtle" />`}
          >
            <div className={styles.column}>
              <div className={styles.slot}>
                <Separator color="base" />
              </div>
              <div className={styles.slot}>
                <Separator color="mute" />
              </div>
              <div className={styles.slot}>
                <Separator color="subtle" />
              </div>
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
          inherits={inheritsOf('Separator')}
          items={propsOf('Separator')}
        />
      </section>
    </div>
  );
}
