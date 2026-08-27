import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { propsOf } from '../../data/component-props';
import {
  FormControlBasicPreview,
  FormControlDisabledPreview,
  FormControlErrorTextPreview,
  FormControlHelpTextPreview,
  FormControlRequiredPreview,
} from './_previews/form-control-previews';

export function FormControlPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">FormControl</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.formControl.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-form-control--docs`}
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
        <CodeBlock code="import { FormControl } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<FormControl
  label="Name"
  renderInput={(props) => (
    <TextField
      {...props}
      placeholder="Enter your name"
    />
  )}
/>`}
          >
            <FormControlBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.formControl.helpTextTitle" />
          </Heading>
          <ComponentPreview
            code={`<FormControl
  helpText="Please enter a valid email address."
  label="Email"
  renderInput={(props) => (
    <TextField
      {...props}
      placeholder="you@example.com"
    />
  )}
/>`}
          >
            <FormControlHelpTextPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.formControl.errorTextTitle" />
          </Heading>
          <ComponentPreview
            code={`<FormControl
  errorText="This field is required."
  invalid
  label="Email"
  renderInput={(props) => (
    <TextField {...props} />
  )}
/>`}
          >
            <FormControlErrorTextPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.formControl.requiredTitle" />
          </Heading>
          <ComponentPreview
            code={`<FormControl
  required
  label="Username"
  renderInput={(props) => (
    <TextField
      {...props}
      placeholder="Required field"
    />
  )}
/>`}
          >
            <FormControlRequiredPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.formControl.disabledTitle" />
          </Heading>
          <ComponentPreview
            code={`<FormControl
  disabled
  label="Username"
  renderInput={(props) => (
    <TextField
      {...props}
      placeholder="Disabled field"
    />
  )}
/>`}
          >
            <FormControlDisabledPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable items={propsOf('FormControl')} />
      </section>
    </div>
  );
}
