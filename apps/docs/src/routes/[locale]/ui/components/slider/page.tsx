import { Anchor, Heading, Separator, Slider } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/slider.module.css';

export default function SliderPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Slider" />
      <div className={page.stack}>
        <Heading level="h1">Slider</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { Slider } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
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
            <div className={styles.frame}>
              <Slider
                defaultValue={50}
                disabled={false}
                invalid={false}
                required={false}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
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
            <div className={styles.frame}>
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

        <div className={page.stack}>
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
            <div className={styles.frame}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Slider')} items={propsOf('Slider')} />
      </section>
    </div>
  );
}
