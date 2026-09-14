import { Anchor, Heading, Separator, Switch } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { SwitchControlledPreview } from '../_previews/switch-previews';

export default function SwitchPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Switch" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Switch</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.switchInput.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-switch--docs`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { Switch } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Switch
  disabled={false}
  invalid={false}
  required={false}
  label="Email notifications"
/>`}
          >
            <Switch
              disabled={false}
              invalid={false}
              required={false}
              label="Email notifications"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.switchInput.defaultCheckedTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Switch
  defaultChecked
  disabled={false}
  invalid={false}
  required={false}
  label="Automatic backups"
/>`}
          >
            <Switch
              defaultChecked
              disabled={false}
              invalid={false}
              required={false}
              label="Automatic backups"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.switchInput.controlledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [checked, setChecked] = useState(false);

<Switch
  checked={checked}
  disabled={false}
  invalid={false}
  required={false}
  label="Controlled switch"
  onChange={(next) => setChecked(next)}
/>`}
          >
            <SwitchControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.switchInput.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Switch disabled invalid={false} required={false} label="Airplane mode" />
<Switch defaultChecked disabled invalid={false} required={false} label="Offline sync" />`}
          >
            <Switch
              disabled
              invalid={false}
              required={false}
              label="Airplane mode"
            />
            <Switch
              defaultChecked
              disabled
              invalid={false}
              required={false}
              label="Offline sync"
            />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Switch')} items={propsOf('Switch')} />
      </section>
    </div>
  );
}
