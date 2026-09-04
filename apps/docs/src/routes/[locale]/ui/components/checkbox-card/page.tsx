import { Anchor, CheckboxCard, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { CheckboxCardControlledPreview } from '../_previews/checkbox-card-previews';

const options = [
  {
    value: 'history',
    label: 'Version history',
    description: 'Keep every change and roll back when needed.',
  },
  {
    value: 'comments',
    label: 'Inline comments',
    description: 'Leave feedback directly on each section.',
  },
  {
    value: 'share',
    label: 'Share links',
    description: 'Publish read-only share links in seconds.',
  },
] as const;

export default function CheckboxCardPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">CheckboxCard</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.checkboxCard.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-checkbox-card--docs`}
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
          code="import { CheckboxCard } from '@k8ordo/ui';"
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
            code={`import { CheckboxCard } from '@k8ordo/ui';
import { useState } from 'react';

const options = [
  {
    value: 'history',
    label: 'Version history',
    description: 'Keep every change and roll back when needed.',
  },
  {
    value: 'comments',
    label: 'Inline comments',
    description: 'Leave feedback directly on each section.',
  },
  {
    value: 'share',
    label: 'Share links',
    description: 'Publish read-only share links in seconds.',
  },
];

const [value, setValue] = useState(['comments']);

<p id="features-label">Choose features to enable</p>
<CheckboxCard
  disabled={false}
  invalid={false}
  aria-labelledby="features-label"
  onChange={setValue}
  options={options}
  value={value}
/>`}
          >
            <CheckboxCardControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.checkboxCard.defaultValueTitle" />
          </Heading>
          <ComponentPreview
            code={`const options = [
  {
    value: 'history',
    label: 'Version history',
    description: 'Keep every change and roll back when needed.',
  },
  {
    value: 'comments',
    label: 'Inline comments',
    description: 'Leave feedback directly on each section.',
  },
  {
    value: 'share',
    label: 'Share links',
    description: 'Publish read-only share links in seconds.',
  },
];

<p id="features-default-label">Choose features to enable</p>
<CheckboxCard
  defaultValue={['history', 'share']}
  disabled={false}
  invalid={false}
  aria-labelledby="features-default-label"
  options={options}
/>`}
          >
            <div className="w-full max-w-2xl">
              <p
                className="text-fg-base mb-3 font-medium"
                id="features-default-label"
              >
                Choose features to enable
              </p>
              <CheckboxCard
                defaultValue={['history', 'share']}
                disabled={false}
                invalid={false}
                aria-labelledby="features-default-label"
                options={options}
              />
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('CheckboxCard')}
          items={propsOf('CheckboxCard')}
        />
      </section>
    </div>
  );
}
