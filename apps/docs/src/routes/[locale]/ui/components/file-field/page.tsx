import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import {
  FileFieldAcceptTypesPreview,
  FileFieldBasicPreview,
  FileFieldDisabledPreview,
  FileFieldInvalidPreview,
  FileFieldMultiplePreview,
} from '../_previews/file-field-previews';

export default function FileFieldPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">FileField</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.fileField.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-form-file-field--docs`}
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
        <CodeBlock code="import { FileField } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<FileField.Root accept="image/*" multiple={false}>
  <FileField.Trigger
    renderItem={({ disabled, onClick }) => (
      <Button disabled={disabled} onClick={onClick}>
        Select File
      </Button>
    )}
  />
  <FileField.ItemList clearable />
</FileField.Root>`}
          >
            <FileFieldBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.fileField.acceptTypesTitle" />
          </Heading>
          <ComponentPreview
            code={`{/* Accept only PDF and Word documents */}
<FileField.Root accept=".pdf,.doc,.docx" multiple={false}>
  <FileField.Trigger
    renderItem={({ disabled, onClick }) => (
      <Button disabled={disabled} onClick={onClick}>
        Select Document
      </Button>
    )}
  />
  <FileField.ItemList clearable />
</FileField.Root>`}
          >
            <FileFieldAcceptTypesPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.fileField.multipleFilesTitle" />
          </Heading>
          <ComponentPreview
            code={`<FileField.Root maxFiles={3} multiple>
  <FileField.Trigger
    renderItem={({ disabled, onClick }) => (
      <Button disabled={disabled} onClick={onClick}>
        Select Files (max 3)
      </Button>
    )}
  />
  <FileField.ItemList clearable />
</FileField.Root>`}
          >
            <FileFieldMultiplePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.fileField.disabledTitle" />
          </Heading>
          <ComponentPreview
            code={`<FileField.Root disabled multiple={false}>
  <FileField.Trigger
    renderItem={({ disabled, onClick }) => (
      <Button disabled={disabled} onClick={onClick}>
        Select File
      </Button>
    )}
  />
  <FileField.ItemList clearable />
</FileField.Root>`}
          >
            <FileFieldDisabledPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.fileField.invalidTitle" />
          </Heading>
          <ComponentPreview
            code={`<FileField.Root invalid multiple={false}>
  <FileField.Trigger
    renderItem={({ disabled, onClick }) => (
      <Button disabled={disabled} onClick={onClick}>
        Select File
      </Button>
    )}
  />
  <FileField.ItemList clearable />
</FileField.Root>`}
          >
            <FileFieldInvalidPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <Heading level="h3">FileField.Root</Heading>
        <PropsTable
          inherits={inheritsOf('FileField.Root')}
          items={propsOf('FileField.Root')}
        />
        <Heading level="h3">FileField.Trigger</Heading>
        <PropsTable items={propsOf('FileField.Trigger')} />
        <Heading level="h3">FileField.ItemList</Heading>
        <PropsTable items={propsOf('FileField.ItemList')} />
      </section>
    </div>
  );
}
