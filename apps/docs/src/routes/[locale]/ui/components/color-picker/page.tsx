import { Anchor, ColorPicker, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import {
  ColorPickerControlledPreview,
  SWATCHES,
} from '../../../../../demos/ui/components/color-picker-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/color-picker.module.css';

const SWATCHES_CODE = `const swatches = [
  { value: '#0d9488', label: 'Teal' },
  { value: '#2563eb', label: 'Blue' },
  { value: '#f97316', label: 'Orange' },
  { value: '#e11d48', label: 'Rose' },
  { value: '#171717', label: 'Black' },
];`;

const FORM_EXAMPLE = `// schema.ts
export const themeSchema = z.object({
  accent: z.string().regex(/^#[0-9a-f]{6}$/),
});

// theme-form.tsx
const accent = form.field('accent');

<FormControl
  errorText={accent.error}
  invalid={accent.invalid}
  label="Accent color"
  required={accent.required}
  renderInput={(props) => <ColorPicker {...props} {...accent.input} />}
/>`;

export default function ColorPickerPage() {
  return (
    <div className={page.page}>
      <PageTitle name="ColorPicker" />
      <div className={page.stack}>
        <Heading level="h1">ColorPicker</Heading>
        <p className={page.lead}>
          <Rich>{m.components.colorPicker.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-color-picker--default`}
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
        <CodeBlock code="import { ColorPicker } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.colorPicker.usageDescription()}</Rich>
          </p>
          <ComponentPreview code='<ColorPicker aria-label="Accent color" defaultValue="#0d9488" name="accent" />'>
            <div className={styles.frame}>
              <ColorPicker
                aria-label="Accent color"
                defaultValue="#0d9488"
                name="accent"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.colorPicker.swatchesTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.colorPicker.swatchesDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`${SWATCHES_CODE}

<ColorPicker
  aria-label="Accent color"
  defaultValue="#f97316"
  swatches={swatches}
/>`}
          >
            <div className={styles.frame}>
              <ColorPicker
                aria-label="Accent color"
                defaultValue="#f97316"
                swatches={SWATCHES}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.colorPicker.controlledTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.colorPicker.controlledDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`const [color, setColor] = useState('#2563eb');

<ColorPicker
  aria-label="Accent color"
  onChange={setColor}
  swatches={swatches}
  value={color}
/>`}
          >
            <ColorPickerControlledPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.colorPicker.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<ColorPicker aria-label="Accent color" defaultValue="#0d9488" disabled />'>
            <div className={styles.frame}>
              <ColorPicker
                aria-label="Accent color"
                defaultValue="#0d9488"
                disabled
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.colorPicker.formTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.colorPicker.formDescription()}</Rich>
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
          inherits={inheritsOf('ColorPicker')}
          items={propsOf('ColorPicker')}
          messagesNote
        />
      </section>
    </div>
  );
}
