import { Anchor, DateField, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

const FORM_EXAMPLE = `// schema.ts
export const eventSchema = z.object({ eventDate: z.iso.date() });

// event-form.tsx
const eventDate = form.field('eventDate');

<FormControl
  errorText={eventDate.error}
  invalid={eventDate.invalid}
  label="Date"
  required={eventDate.required}
  renderInput={(props) => <DateField {...props} {...eventDate.input} />}
/>`;

export default function DateFieldPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="DateField" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">DateField</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.dateField.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-date-field--default`}
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
        <CodeBlock code="import { DateField } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<DateField aria-label="Date" defaultValue="2026-09-25" name="eventDate" />'>
            <div className="w-full max-w-xs">
              <DateField
                aria-label="Date"
                defaultValue="2026-09-25"
                name="eventDate"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dateField.minMaxTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.dateField.minMaxDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<DateField
  aria-label="Date"
  defaultValue="2026-09-25"
  max="2026-12-31"
  min="2026-09-01"
/>`}
          >
            <div className="w-full max-w-xs">
              <DateField
                aria-label="Date"
                defaultValue="2026-09-25"
                max="2026-12-31"
                min="2026-09-01"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dateField.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<DateField aria-label="Date" defaultValue="2026-09-25" disabled />'>
            <div className="w-full max-w-xs">
              <DateField aria-label="Date" defaultValue="2026-09-25" disabled />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dateField.invalidTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<DateField aria-label="Date" invalid />'>
            <div className="w-full max-w-xs">
              <DateField aria-label="Date" invalid />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dateField.formTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.dateField.formDescription()}</Rich>
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
          inherits={inheritsOf('DateField')}
          items={propsOf('DateField')}
        />
      </section>
    </div>
  );
}
