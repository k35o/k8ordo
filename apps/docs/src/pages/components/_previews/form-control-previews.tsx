'use client';

import { FormControl, TextField } from '@k8ordo/ui';

export function FormControlBasicPreview() {
  return (
    <FormControl
      label="Name"
      renderInput={(props) => (
        <TextField {...props} placeholder="Enter your name" />
      )}
    />
  );
}

export function FormControlHelpTextPreview() {
  return (
    <FormControl
      helpText="Please enter a valid email address."
      label="Email"
      renderInput={(props) => (
        <TextField {...props} placeholder="you@example.com" />
      )}
    />
  );
}

export function FormControlErrorTextPreview() {
  return (
    <FormControl
      errorText="This field is required."
      invalid
      label="Email"
      renderInput={(props) => <TextField {...props} />}
    />
  );
}

export function FormControlRequiredPreview() {
  return (
    <FormControl
      required
      label="Username"
      renderInput={(props) => (
        <TextField {...props} placeholder="Required field" />
      )}
    />
  );
}

export function FormControlDisabledPreview() {
  return (
    <FormControl
      disabled
      label="Username"
      renderInput={(props) => (
        <TextField {...props} placeholder="Disabled field" />
      )}
    />
  );
}
