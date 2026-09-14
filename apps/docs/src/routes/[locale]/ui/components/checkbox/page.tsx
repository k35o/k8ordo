import { Anchor, Checkbox, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  CheckboxControlledPreview,
  CheckboxGroupControlledPreview,
  CheckboxGroupDisabledPreview,
} from '../_previews/checkbox-previews';

export default function CheckboxPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Checkbox" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Checkbox</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.checkbox.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-checkbox--docs`}
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
        <CodeBlock code="import { Checkbox } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Checkbox label="I agree to the terms" />'>
            <Checkbox label="I agree to the terms" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.checkbox.defaultCheckedTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Checkbox defaultChecked label="Checked by default" />'>
            <Checkbox defaultChecked label="Checked by default" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.checkbox.controlledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  label="Controlled checkbox"
  onChange={(checked) => setChecked(checked)}
/>`}
          >
            <CheckboxControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.checkbox.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Checkbox disabled label="Unchecked disabled" />
<Checkbox defaultChecked disabled label="Checked disabled" />`}
          >
            <Checkbox disabled label="Unchecked disabled" />
            <Checkbox defaultChecked disabled label="Checked disabled" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">Group</Heading>
          <ComponentPreview
            code={`<p id="checkbox-group-label">Frameworks</p>
<CheckboxGroup.Root
  aria-labelledby="checkbox-group-label"
  name="frameworks"
  onChange={setValue}
  value={value}
>
  <Checkbox itemValue="react" label="React" />
  <Checkbox itemValue="vue" label="Vue" />
  <Checkbox itemValue="svelte" label="Svelte" />
</CheckboxGroup.Root>`}
          >
            <CheckboxGroupControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">Group Disabled</Heading>
          <ComponentPreview
            code={`<p id="checkbox-group-disabled-label">Frameworks</p>
<CheckboxGroup.Root
  aria-labelledby="checkbox-group-disabled-label"
  defaultValue={['vue']}
  disabled
  name="frameworks-disabled"
>
  <Checkbox itemValue="react" label="React" />
  <Checkbox itemValue="vue" label="Vue" />
  <Checkbox itemValue="svelte" label="Svelte" />
</CheckboxGroup.Root>`}
          >
            <CheckboxGroupDisabledPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Checkbox')}
          items={propsOf('Checkbox')}
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">CheckboxGroup.Root Props</Heading>
        <PropsTable
          inherits={inheritsOf('CheckboxGroup.Root')}
          items={propsOf('CheckboxGroup.Root')}
        />
      </section>
    </div>
  );
}
