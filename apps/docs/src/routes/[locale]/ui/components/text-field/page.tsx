import { Anchor, Heading, Separator, TextField } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function TextFieldPage() {
  return (
    <div className={page.page}>
      <PageTitle name="TextField" />
      <div className={page.stack}>
        <Heading level="h1">TextField</Heading>
        <p className={page.lead}>
          <Rich>{m.components.textField.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-text-field--default`}
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
        <CodeBlock code="import { TextField } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<TextField
  disabled={false}
  invalid={false}
  required={false}
/>`}
          >
            <TextField disabled={false} invalid={false} required={false} />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.textField.placeholderTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<TextField
  disabled={false}
  invalid={false}
  required={false}
  placeholder="Enter your name"
/>`}
          >
            <TextField
              disabled={false}
              invalid={false}
              required={false}
              placeholder="Enter your name"
            />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">Type</Heading>
          <ComponentPreview
            code={`<TextField placeholder="you@example.com" type="email" />
<TextField placeholder="090-0000-0000" type="tel" />`}
          >
            <TextField placeholder="you@example.com" type="email" />
            <TextField placeholder="090-0000-0000" type="tel" />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.textField.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<TextField
  disabled
  invalid={false}
  required={false}
  placeholder="Disabled field"
/>`}
          >
            <TextField
              disabled
              invalid={false}
              required={false}
              placeholder="Disabled field"
            />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.textField.invalidTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<TextField
  disabled={false}
  invalid
  required={false}
  defaultValue="invalid value"
/>`}
          >
            <TextField
              defaultValue="invalid value"
              disabled={false}
              invalid
              required={false}
            />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('TextField')}
          items={propsOf('TextField')}
        />
      </section>
    </div>
  );
}
