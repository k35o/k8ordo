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
  FormActionStatePreview,
  FormBasicPreview,
} from '../_previews/form-previews';

export default function FormPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Form" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Form</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.form.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-form--with-action`}
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
        <CodeBlock code="import { Form } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Form
  action={async (formData) => {
    const name = formData.get('name');
    await save(name);
  }}
>
  <FormControl
    label="Name"
    renderInput={(props) => <TextField {...props} name="name" />}
  />
  <Button type="submit">Submit</Button>
</Form>`}
          >
            <FormBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.form.actionStateTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [message, formAction] = useActionState(
  async (_prev, formData) => {
    const name = formData.get('name');
    await sleep(1000);
    return \`Hello, \${name}!\`;
  },
  '',
);

return (
  <Form action={formAction}>
    <FormControl
      label="Name"
      renderInput={(props) => <TextField {...props} name="name" />}
    />
    <Button type="submit">Submit</Button>
    <p>{message}</p>
  </Form>
);`}
          >
            <FormActionStatePreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Form')} items={propsOf('Form')} />
      </section>
    </div>
  );
}
