import { Anchor, Heading, Separator, Spinner } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function SpinnerPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Spinner" />
      <div className={page.stack}>
        <Heading level="h1">Spinner</Heading>
        <p className={page.lead}>
          <Rich>{m.components.spinner.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-feedback-spinner--default`}
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
        <CodeBlock code="import { Spinner } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code="<Spinner />">
            <Spinner />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.spinner.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
          >
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Spinner')}
          items={propsOf('Spinner')}
          messagesNote
        />
      </section>
    </div>
  );
}
