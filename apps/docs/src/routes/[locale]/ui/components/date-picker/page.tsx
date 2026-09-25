import { Anchor, DatePicker, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { DatePickerControlledPreview } from '../_previews/date-previews';

const FORM_EXAMPLE = `// schema.ts
export const bookingSchema = z.object({ checkIn: z.iso.date() });

// booking-form.tsx
const checkIn = form.field('checkIn');

<FormControl
  errorText={checkIn.error}
  invalid={checkIn.invalid}
  label="Check-in"
  required={checkIn.required}
  renderInput={(props) => <DatePicker {...props} {...checkIn.input} />}
/>`;

export default function DatePickerPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="DatePicker" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">DatePicker</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.datePicker.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-date-picker--default`}
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
        <CodeBlock code="import { DatePicker } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<DatePicker aria-label="Check-in" defaultValue="2026-09-25" name="checkIn" />'>
            <div className="w-full max-w-xs">
              <DatePicker
                aria-label="Check-in"
                defaultValue="2026-09-25"
                name="checkIn"
              />
            </div>
          </ComponentPreview>
          <p className="text-fg-mute text-sm">
            <Rich>{m.components.datePicker.firefoxNote()}</Rich>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.datePicker.controlledTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.datePicker.controlledDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`const [value, setValue] = useState('2026-09-25');

<DatePicker aria-label="Check-in" onChange={setValue} value={value} />`}
          >
            <DatePickerControlledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.datePicker.minMaxTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<DatePicker
  aria-label="Check-in"
  defaultValue="2026-09-25"
  max="2026-10-15"
  min="2026-09-20"
/>`}
          >
            <div className="w-full max-w-xs">
              <DatePicker
                aria-label="Check-in"
                defaultValue="2026-09-25"
                max="2026-10-15"
                min="2026-09-20"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.datePicker.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<DatePicker aria-label="Check-in" defaultValue="2026-09-25" disabled />'>
            <div className="w-full max-w-xs">
              <DatePicker
                aria-label="Check-in"
                defaultValue="2026-09-25"
                disabled
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.datePicker.formTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.datePicker.formDescription()}</Rich>
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
          inherits={inheritsOf('DatePicker')}
          items={propsOf('DatePicker')}
          messagesNote
        />
      </section>
    </div>
  );
}
