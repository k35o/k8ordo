import { Anchor, Heading, Select, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export default function SelectPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Select" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Select</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.select.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-select--default`}
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
        <CodeBlock code="import { Select } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

<Select
  id="select-basic"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required={false}
  options={options}
/>`}
          >
            <Select
              aria-describedby={undefined}
              id="select-basic"
              disabled={false}
              invalid={false}
              required={false}
              options={options}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.select.requiredTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Select
  id="select-required"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required
  options={options}
/>`}
          >
            <Select
              aria-describedby={undefined}
              id="select-required"
              disabled={false}
              invalid={false}
              required
              options={options}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.select.defaultValueTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Select
  id="select-default-value"
  defaultValue="cherry"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required={false}
  options={options}
/>`}
          >
            <Select
              defaultValue="cherry"
              aria-describedby={undefined}
              id="select-default-value"
              disabled={false}
              invalid={false}
              required={false}
              options={options}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.select.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Select
  id="select-disabled"
  aria-describedby={undefined}
  disabled
  invalid={false}
  required={false}
  options={options}
/>`}
          >
            <Select
              aria-describedby={undefined}
              id="select-disabled"
              disabled
              invalid={false}
              required={false}
              options={options}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.select.invalidTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Select
  id="select-invalid"
  aria-describedby={undefined}
  disabled={false}
  invalid
  required={false}
  options={options}
/>`}
          >
            <Select
              aria-describedby={undefined}
              id="select-invalid"
              disabled={false}
              invalid
              required={false}
              options={options}
            />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Select')} items={propsOf('Select')} />
      </section>
    </div>
  );
}
