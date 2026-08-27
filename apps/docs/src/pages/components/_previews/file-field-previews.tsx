'use client';

import { Button, FileField } from '@k8ordo/ui';

export function FileFieldBasicPreview() {
  return (
    <FileField.Root accept="image/*" multiple={false}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            Select File
          </Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldAcceptTypesPreview() {
  return (
    <FileField.Root accept=".pdf,.doc,.docx" multiple={false}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            Select Document
          </Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldMultiplePreview() {
  return (
    <FileField.Root maxFiles={3} multiple>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            Select Files (max 3)
          </Button>
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
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            Select File
          </Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}

export function FileFieldInvalidPreview() {
  return (
    <FileField.Root invalid multiple={false}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            Select File
          </Button>
        )}
      />
      <FileField.ItemList clearable />
    </FileField.Root>
  );
}
