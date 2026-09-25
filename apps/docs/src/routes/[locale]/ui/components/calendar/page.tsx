import { Anchor, Calendar, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function CalendarPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Calendar" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Calendar</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.calendar.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-calendar--default`}
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
        <CodeBlock code="import { Calendar } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Calendar defaultValue="2026-09-25" onChange={setDay} />'>
            <Calendar defaultValue="2026-09-25" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.calendar.minMaxTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Calendar
  defaultValue="2026-09-25"
  max="2026-09-30"
  min="2026-09-10"
/>`}
          >
            <Calendar
              defaultValue="2026-09-25"
              max="2026-09-30"
              min="2026-09-10"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.calendar.keyboardTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.calendar.keyboardDescription()}</Rich>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.calendar.localeTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.calendar.localeDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Calendar')}
          items={propsOf('Calendar')}
          messagesNote
        />
      </section>
    </div>
  );
}
