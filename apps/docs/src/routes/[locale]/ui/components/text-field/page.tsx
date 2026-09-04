import { Anchor, Heading, Separator, TextField } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function TextFieldPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">TextField</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.textField.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-text-field--docs`}
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
        <CodeBlock code="import { TextField } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textField.placeholderTitle" />
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

        <div className="flex flex-col gap-4">
          <Heading level="h3">Type</Heading>
          <ComponentPreview
            code={`<TextField placeholder="you@example.com" type="email" />
<TextField placeholder="090-0000-0000" type="tel" />`}
          >
            <TextField placeholder="you@example.com" type="email" />
            <TextField placeholder="090-0000-0000" type="tel" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textField.disabledTitle" />
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

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textField.invalidTitle" />
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

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('TextField')}
          items={propsOf('TextField')}
        />
      </section>
    </div>
  );
}
