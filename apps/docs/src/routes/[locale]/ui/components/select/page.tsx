import { Anchor, Heading, Select, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export default function SelectPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Select</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.select.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-select--docs`}
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
        <CodeBlock code="import { Select } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.select.requiredTitle" />
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
            <T k="components.select.defaultValueTitle" />
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
            <T k="components.select.disabledTitle" />
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
            <T k="components.select.invalidTitle" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Select')} items={propsOf('Select')} />
      </section>
    </div>
  );
}
