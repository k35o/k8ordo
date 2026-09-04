import { Anchor, Heading, PasswordInput, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { PasswordInputControlledPreview } from '../_previews/password-input-previews';

export default function PasswordInputPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">PasswordInput</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.passwordInput.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-password-input--docs`}
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
        <CodeBlock
          code="import { PasswordInput } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<PasswordInput
  disabled={false}
  invalid={false}
  required={false}
  placeholder="Enter your password"
/>`}
          >
            <PasswordInput
              disabled={false}
              invalid={false}
              required={false}
              placeholder="Enter your password"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.passwordInput.controlledTitle" />
          </Heading>
          <ComponentPreview
            code={`const [value, setValue] = useState('hunter2');

<PasswordInput
  disabled={false}
  invalid={false}
  required={false}
  onChange={(event) => setValue(event.target.value)}
  value={value}
/>`}
          >
            <PasswordInputControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.passwordInput.disabledTitle" />
          </Heading>
          <ComponentPreview
            code={`<PasswordInput
  defaultValue="read-only-password"
  disabled
  invalid={false}
  required={false}
/>`}
          >
            <PasswordInput
              defaultValue="read-only-password"
              disabled
              invalid={false}
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
          inherits={inheritsOf('PasswordInput')}
          items={propsOf('PasswordInput')}
          messagesNote
        />
      </section>
    </div>
  );
}
