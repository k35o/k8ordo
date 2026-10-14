import { Anchor, Heading, Kbd, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/kbd.module.css';

export default function KbdPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Kbd" />
      <div className={page.stack}>
        <Heading level="h1">Kbd</Heading>
        <p className={page.lead}>
          <Rich>{m.components.kbd.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-kbd--default`}
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
        <CodeBlock code="import { Kbd } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code="<Kbd>Esc</Kbd>">
            <Kbd>Esc</Kbd>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.kbd.combinationTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.kbd.combinationDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Kbd>Ctrl</Kbd>
<Kbd>Shift</Kbd>
<Kbd>P</Kbd>`}
          >
            <span className={styles.keys}>
              <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>P</Kbd>
            </span>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.kbd.labelTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.kbd.labelDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Kbd label="Command">⌘</Kbd>
<Kbd>K</Kbd>`}
          >
            <span className={styles.keys}>
              <Kbd label="Command">⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Kbd')} items={propsOf('Kbd')} />
      </section>
    </div>
  );
}
