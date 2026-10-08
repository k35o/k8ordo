'use client';

import { Autocomplete } from '@k8ordo/ui';
import { useState } from 'react';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Orange', value: 'orange' },
];

export function AutocompleteBasicPreview() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Autocomplete
      aria-describedby={undefined}
      id="autocomplete-basic"
      disabled={false}
      invalid={false}
      required={false}
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}

export function AutocompleteRequiredPreview() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Autocomplete
      aria-describedby={undefined}
      id="autocomplete-required"
      disabled={false}
      invalid={false}
      required
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}

export function AutocompleteMultiplePreview() {
  const [value, setValue] = useState<string[]>(['apple', 'cherry']);
  return (
    <Autocomplete
      aria-describedby={undefined}
      id="autocomplete-multiple"
      disabled={false}
      invalid={false}
      required={false}
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}

export function AutocompleteDisabledPreview() {
  const [value, setValue] = useState<string[]>(['apple']);
  return (
    <Autocomplete
      aria-describedby={undefined}
      id="autocomplete-disabled"
      disabled
      invalid={false}
      required={false}
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}

export function AutocompleteInvalidPreview() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Autocomplete
      aria-describedby={undefined}
      id="autocomplete-invalid"
      disabled={false}
      invalid
      required={false}
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}
