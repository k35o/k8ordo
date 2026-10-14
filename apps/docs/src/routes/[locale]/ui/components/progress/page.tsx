import { Anchor, Heading, Progress, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/progress.module.css';

export default function ProgressPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Progress" />
      <div className={page.stack}>
        <Heading level="h1">Progress</Heading>
        <p className={page.lead}>
          <Rich>{m.components.progress.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-feedback-progress--primary`}
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
        <CodeBlock code="import { Progress } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code="<Progress max={100} value={60} />">
            <div className={styles.frame}>
              <Progress max={100} value={60} />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.progress.differentValuesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Progress max={100} value={20} />
<Progress max={100} value={50} />
<Progress max={100} value={80} />
<Progress max={100} value={100} />`}
          >
            <div className={styles.column}>
              <Progress max={100} value={20} />
              <Progress max={100} value={50} />
              <Progress max={100} value={80} />
              <Progress max={100} value={100} />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.progress.withLabelTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Progress
  label="Upload progress"
  max={100}
  value={75}
/>`}
          >
            <div className={styles.frame}>
              <Progress label="Upload progress" max={100} value={75} />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.progress.indeterminateTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.progress.indeterminateDescription()}</Rich>
          </p>
          <ComponentPreview code='<Progress label="Uploading" />'>
            <div className={styles.frame}>
              <Progress label="Uploading" />
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
          inherits={inheritsOf('Progress')}
          items={propsOf('Progress')}
        />
      </section>
    </div>
  );
}
