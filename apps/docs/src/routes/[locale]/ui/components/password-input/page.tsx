import { Anchor, Heading, PasswordInput, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { PasswordInputControlledPreview } from '../../../../../demos/ui/components/password-input-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function PasswordInputPage() {
  return (
    <div className={page.page}>
      <PageTitle name="PasswordInput" />
      <div className={page.stack}>
        <Heading level="h1">PasswordInput</Heading>
        <p className={page.lead}>
          <Rich>{m.components.passwordInput.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-password-input--default`}
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
        <CodeBlock
          code="import { PasswordInput } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
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

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.passwordInput.controlledTitle()}</Rich>
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

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.passwordInput.disabledTitle()}</Rich>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
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
