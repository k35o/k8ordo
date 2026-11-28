'use client';

import { Button, FileField, FormControl } from '@k8ordo/ui';

export function FileFieldBasicPreview() {
  return (
    <FileField.Root accept="image/*" multiple={false}>
      <FileField.Trigger
        renderItem={(wiring) => <Button {...wiring}>Select File</Button>}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldLabelledPreview() {
  return (
    <FormControl
      helpText="PDF, up to 5 MB"
      label="Attachment"
      labelAs="group"
      renderInput={(props) => (
        <FileField.Root {...props} accept=".pdf" multiple={false}>
          <FileField.Trigger
            renderItem={(wiring) => <Button {...wiring}>Select File</Button>}
          />
          <FileField.ItemList clearable />
        </FileField.Root>
      )}
      required
    />
  );
}

export function FileFieldAcceptTypesPreview() {
  return (
    <FileField.Root accept=".pdf,.doc,.docx" multiple={false}>
      <FileField.Trigger
        renderItem={(wiring) => <Button {...wiring}>Select Document</Button>}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldMultiplePreview() {
  return (
    <FileField.Root maxFiles={3} multiple>
      <FileField.Trigger
        renderItem={(wiring) => (
          <Button {...wiring}>Select Files (max 3)</Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldDisabledPreview() {
  return (
    <FileField.Root disabled multiple={false}>
      <FileField.Trigger
        renderItem={(wiring) => <Button {...wiring}>Select File</Button>}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldInvalidPreview() {
  return (
    <FileField.Root invalid multiple={false}>
      <FileField.Trigger
        renderItem={(wiring) => <Button {...wiring}>Select File</Button>}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldDropzonePreview() {
  return (
    <FileField.Root accept="image/*" multiple>
      <FileField.Dropzone />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}
