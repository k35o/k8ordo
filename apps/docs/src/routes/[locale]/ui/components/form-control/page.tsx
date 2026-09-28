import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  FormControlBasicPreview,
  FormControlDisabledPreview,
  FormControlErrorTextPreview,
  FormControlHelpTextPreview,
  FormControlRequiredPreview,
} from '../_previews/form-control-previews';

export default function FormControlPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="FormControl" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">FormControl</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.formControl.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-form-control--default`}
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
        <CodeBlock code="import { FormControl } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
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
            <Rich>{m.components.formControl.helpTextTitle()}</Rich>
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
            <Rich>{m.components.formControl.errorTextTitle()}</Rich>
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
            <Rich>{m.components.formControl.requiredTitle()}</Rich>
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
            <Rich>{m.components.formControl.disabledTitle()}</Rich>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('FormControl')}
          items={propsOf('FormControl')}
        />
      </section>
    </div>
  );
}
