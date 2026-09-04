import { Anchor, Heading, Separator, Switch } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { SwitchControlledPreview } from '../_previews/switch-previews';

export default function SwitchPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Switch</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.switch.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-switch--docs`}
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
        <CodeBlock code="import { Switch } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.switch.defaultCheckedTitle" />
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
            <T k="components.switch.controlledTitle" />
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
            <T k="components.switch.disabledTitle" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Switch')} items={propsOf('Switch')} />
      </section>
    </div>
  );
}
