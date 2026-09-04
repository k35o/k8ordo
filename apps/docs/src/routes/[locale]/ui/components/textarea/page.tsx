import { Anchor, Heading, Separator, Textarea } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function TextareaPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Textarea</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.textarea.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-textarea--docs`}
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
        <CodeBlock code="import { Textarea } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<Textarea
  id="textarea-basic"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required={false}
  placeholder="Enter text"
/>`}
          >
            <Textarea
              aria-describedby={undefined}
              id="textarea-basic"
              disabled={false}
              invalid={false}
              required={false}
              placeholder="Enter text"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textarea.rowsTitle" />
          </Heading>
          <ComponentPreview
            code={`<Textarea
  id="textarea-rows"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required={false}
  placeholder="6 rows"
  rows={6}
/>`}
          >
            <Textarea
              aria-describedby={undefined}
              id="textarea-rows"
              disabled={false}
              invalid={false}
              required={false}
              placeholder="6 rows"
              rows={6}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textarea.autoResizeTitle" />
          </Heading>
          <ComponentPreview
            code={`<Textarea
  id="textarea-auto"
  aria-describedby={undefined}
  autoResize
  disabled={false}
  invalid={false}
  required={false}
  placeholder="Type to auto-resize"
  rows={2}
/>`}
          >
            <Textarea
              autoResize
              aria-describedby={undefined}
              id="textarea-auto"
              disabled={false}
              invalid={false}
              required={false}
              placeholder="Type to auto-resize"
              rows={2}
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textarea.disabledTitle" />
          </Heading>
          <ComponentPreview
            code={`<Textarea
  id="textarea-disabled"
  aria-describedby={undefined}
  disabled
  invalid={false}
  required={false}
  placeholder="Disabled"
/>`}
          >
            <Textarea
              aria-describedby={undefined}
              id="textarea-disabled"
              disabled
              invalid={false}
              required={false}
              placeholder="Disabled"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.textarea.invalidTitle" />
          </Heading>
          <ComponentPreview
            code={`<Textarea
  id="textarea-invalid"
  aria-describedby={undefined}
  disabled={false}
  invalid
  required={false}
  defaultValue="invalid value"
/>`}
          >
            <Textarea
              defaultValue="invalid value"
              aria-describedby={undefined}
              id="textarea-invalid"
              disabled={false}
              invalid
              required={false}
            />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('Textarea')}
          items={propsOf('Textarea')}
        />
      </section>
    </div>
  );
}
