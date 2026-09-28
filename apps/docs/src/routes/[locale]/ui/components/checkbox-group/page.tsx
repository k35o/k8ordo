import {
  Anchor,
  Checkbox,
  CheckboxGroup,
  Heading,
  Separator,
} from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { CheckboxGroupControlledPreview } from '../_previews/checkbox-group-previews';

export default function CheckboxGroupPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="CheckboxGroup" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">CheckboxGroup</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.checkboxGroup.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-checkbox-group--default`}
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
        <CodeBlock
          code="import { Checkbox, CheckboxGroup } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [value, setValue] = useState(['react']);

<p id="frameworks-label">Frameworks</p>
<CheckboxGroup.Root
  aria-labelledby="frameworks-label"
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
          <Heading level="h3">
            <Rich>{m.components.checkboxGroup.defaultValueTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<p id="frameworks-default-label">Frameworks</p>
<CheckboxGroup.Root
  aria-labelledby="frameworks-default-label"
  defaultValue={['vue']}
  name="frameworks-default"
>
  <Checkbox itemValue="react" label="React" />
  <Checkbox itemValue="vue" label="Vue" />
  <Checkbox itemValue="svelte" label="Svelte" />
</CheckboxGroup.Root>`}
          >
            <div>
              <p
                className="text-fg-base mb-2 font-medium"
                id="frameworks-default-label"
              >
                Frameworks
              </p>
              <CheckboxGroup.Root
                aria-labelledby="frameworks-default-label"
                defaultValue={['vue']}
                name="frameworks-default"
              >
                <Checkbox itemValue="react" label="React" />
                <Checkbox itemValue="vue" label="Vue" />
                <Checkbox itemValue="svelte" label="Svelte" />
              </CheckboxGroup.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.checkboxGroup.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<p id="frameworks-disabled-label">Frameworks</p>
<CheckboxGroup.Root
  aria-labelledby="frameworks-disabled-label"
  defaultValue={['vue']}
  disabled
  name="frameworks-disabled"
>
  <Checkbox itemValue="react" label="React" />
  <Checkbox itemValue="vue" label="Vue" />
  <Checkbox itemValue="svelte" label="Svelte" />
</CheckboxGroup.Root>`}
          >
            <div>
              <p
                className="text-fg-base mb-2 font-medium"
                id="frameworks-disabled-label"
              >
                Frameworks
              </p>
              <CheckboxGroup.Root
                aria-labelledby="frameworks-disabled-label"
                defaultValue={['vue']}
                disabled
                name="frameworks-disabled"
              >
                <Checkbox itemValue="react" label="React" />
                <Checkbox itemValue="vue" label="Vue" />
                <Checkbox itemValue="svelte" label="Svelte" />
              </CheckboxGroup.Root>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">CheckboxGroup.Root</Heading>
        <PropsTable items={propsOf('CheckboxGroup.Root')} />
        <Heading level="h3">CheckboxGroup.Item</Heading>
        <PropsTable items={propsOf('CheckboxGroup.Item')} />
      </section>
    </div>
  );
}
