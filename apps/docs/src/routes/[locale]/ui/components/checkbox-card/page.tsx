import { Anchor, CheckboxCard, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
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
      <PageTitle name="CheckboxCard" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">CheckboxCard</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.checkboxCard.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-checkbox-card--default`}
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
          code="import { CheckboxCard } from '@k8ordo/ui';"
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
            <Rich>{m.components.checkboxCard.defaultValueTitle()}</Rich>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('CheckboxCard')}
          items={propsOf('CheckboxCard')}
        />
      </section>
    </div>
  );
}
