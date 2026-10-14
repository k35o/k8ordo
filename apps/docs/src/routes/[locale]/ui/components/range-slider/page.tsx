import { Anchor, Heading, RangeSlider, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { RangeSliderControlledPreview } from '../../../../../demos/ui/components/range-slider-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/range-slider.module.css';

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
    <div className={page.page}>
      <PageTitle name="RangeSlider" />
      <div className={page.stack}>
        <Heading level="h1">RangeSlider</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { RangeSlider } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<RangeSlider aria-label="Price" defaultValue={[20, 80]} />'>
            <div className={styles.frame}>
              <RangeSlider aria-label="Price" defaultValue={[20, 80]} />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
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

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.rangeSlider.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<RangeSlider aria-label="Price" defaultValue={[20, 80]} disabled />'>
            <div className={styles.frame}>
              <RangeSlider
                aria-label="Price"
                defaultValue={[20, 80]}
                disabled
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.rangeSlider.formTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.rangeSlider.formDescription()}</Rich>
          </p>
          <CodeBlock code={FORM_EXAMPLE} lang="tsx" />
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
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
