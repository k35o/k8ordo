import { Anchor, Heading, RangeSlider, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { RangeSliderControlledPreview } from '../_previews/range-slider-previews';

const FORM_EXAMPLE = `// schema.ts
export const filterSchema = z.object({
  priceMin: z.coerce.number().int().min(0).max(100),
  priceMax: z.coerce.number().int().min(0).max(100),
});

// filter-form.tsx
const priceMin = form.field('priceMin');
const priceMax = form.field('priceMax');

<FormControl
  label="Price"
  renderInput={(props) => (
    <RangeSlider
      {...props}
      defaultValue={[20, 80]}
      max={100}
      min={0}
      name={[priceMin.input.name, priceMax.input.name]}
    />
  )}
/>`;

export default function RangeSliderPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="RangeSlider" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">RangeSlider</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.rangeSlider.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-range-slider--default`}
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
        <CodeBlock code="import { RangeSlider } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<RangeSlider aria-label="Price" defaultValue={[20, 80]} />'>
            <div className="w-full">
              <RangeSlider aria-label="Price" defaultValue={[20, 80]} />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.rangeSlider.controlledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [value, setValue] = useState<readonly [number, number]>([18, 26]);

<RangeSlider
  aria-label="Temperature"
  max={40}
  min={0}
  onChange={setValue}
  value={value}
/>`}
          >
            <RangeSliderControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.rangeSlider.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<RangeSlider aria-label="Price" defaultValue={[20, 80]} disabled />'>
            <div className="w-full">
              <RangeSlider
                aria-label="Price"
                defaultValue={[20, 80]}
                disabled
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.rangeSlider.formTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.rangeSlider.formDescription()}</Rich>
          </p>
          <CodeBlock code={FORM_EXAMPLE} lang="tsx" />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('RangeSlider')}
          items={propsOf('RangeSlider')}
          messagesNote
        />
      </section>
    </div>
  );
}
