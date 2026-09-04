import { Anchor, Heading, Separator, Slider } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function SliderPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Slider</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.slider.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-slider--docs`}
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
        <CodeBlock code="import { Slider } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.slider.minMaxStepTitle" />
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
            <T k="components.slider.disabledTitle" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Slider')} items={propsOf('Slider')} />
      </section>
    </div>
  );
}
