import { Anchor, Heading, Radio, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { RadioControlledPreview } from '../_previews/radio-previews';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
] as const;

export default function RadioPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Radio" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Radio</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.radio.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-radio--default`}
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
        <CodeBlock code="import { Radio } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { Radio } from '@k8ordo/ui';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

<p id="radio-label">Framework</p>
<Radio
  defaultValue="vue"
  disabled={false}
  aria-labelledby="radio-label"
  options={options}
/>`}
          >
            <div className="w-full max-w-md">
              <p className="text-fg-base mb-3 font-medium" id="radio-label">
                Framework
              </p>
              <Radio
                defaultValue="vue"
                disabled={false}
                aria-labelledby="radio-label"
                options={options}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.radio.controlledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [value, setValue] = useState('react');

<p id="radio-controlled-label">Framework</p>
<Radio
  disabled={false}
  aria-labelledby="radio-controlled-label"
  onChange={(value) => setValue(value)}
  options={options}
  value={value}
/>`}
          >
            <RadioControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.radio.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<p id="radio-disabled-label">Framework</p>
<Radio
  defaultValue="vue"
  disabled
  aria-labelledby="radio-disabled-label"
  options={options}
/>`}
          >
            <div className="w-full max-w-md">
              <p
                className="text-fg-base mb-3 font-medium"
                id="radio-disabled-label"
              >
                Framework
              </p>
              <Radio
                defaultValue="vue"
                disabled
                aria-labelledby="radio-disabled-label"
                options={options}
              />
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Radio')} items={propsOf('Radio')} />
      </section>
    </div>
  );
}
