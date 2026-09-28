import { Anchor, Heading, Separator, Slider } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function SliderPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Slider" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Slider</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.slider.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-slider--default`}
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
        <CodeBlock code="import { Slider } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Slider
  defaultValue={50}
  disabled={false}
  invalid={false}
  required={false}
/>`}
          >
            <div className="w-full">
              <Slider
                defaultValue={50}
                disabled={false}
                invalid={false}
                required={false}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.slider.minMaxStepTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Slider
  defaultValue={20}
  disabled={false}
  invalid={false}
  required={false}
  max={50}
  min={10}
  step={5}
/>`}
          >
            <div className="w-full">
              <Slider
                defaultValue={20}
                disabled={false}
                invalid={false}
                required={false}
                max={50}
                min={10}
                step={5}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.slider.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Slider
  defaultValue={30}
  disabled
  invalid={false}
  required={false}
/>`}
          >
            <div className="w-full">
              <Slider
                defaultValue={30}
                disabled
                invalid={false}
                required={false}
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
        <PropsTable inherits={inheritsOf('Slider')} items={propsOf('Slider')} />
      </section>
    </div>
  );
}
