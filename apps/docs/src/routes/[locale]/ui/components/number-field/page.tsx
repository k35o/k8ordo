import { Anchor, Heading, NumberField, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function NumberFieldPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="NumberField" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">NumberField</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.numberField.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-number-field--docs`}
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
        <CodeBlock code="import { NumberField } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<NumberField
  disabled={false}
  invalid={false}
  required={false}
/>`}
          >
            <NumberField disabled={false} invalid={false} required={false} />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.numberField.stepPrecisionTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<NumberField
  disabled={false}
  invalid={false}
  required={false}
  precision={2}
  step={0.25}
/>`}
          >
            <NumberField
              disabled={false}
              invalid={false}
              required={false}
              precision={2}
              step={0.25}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.numberField.minMaxTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<NumberField
  disabled={false}
  invalid={false}
  required={false}
  max={10}
  min={0}
  step={1}
/>`}
          >
            <NumberField
              disabled={false}
              invalid={false}
              required={false}
              max={10}
              min={0}
              step={1}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.numberField.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<NumberField
  disabled
  invalid={false}
  required={false}
/>`}
          >
            <NumberField disabled invalid={false} required={false} />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.numberField.invalidTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<NumberField
  disabled={false}
  invalid
  required={false}
/>`}
          >
            <NumberField disabled={false} invalid required={false} />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('NumberField')}
          items={propsOf('NumberField')}
        />
      </section>
    </div>
  );
}
