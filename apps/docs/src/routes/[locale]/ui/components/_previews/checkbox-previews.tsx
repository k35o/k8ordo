'use client';

import { Checkbox, CheckboxGroup } from '@k8ordo/ui';
import { useState } from 'react';

export function CheckboxControlledPreview() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      label="Controlled checkbox"
      onChange={(nextChecked) => {
        setChecked(nextChecked);
      }}
    />
  );
}

export function CheckboxGroupControlledPreview() {
  const [value, setValue] = useState(['react']);

  return (
    <div>
      <p className="text-fg-base mb-2 font-medium" id="checkbox-group-label">
        Frameworks
      </p>
      <CheckboxGroup.Root
        aria-labelledby="checkbox-group-label"
        name="frameworks"
        onChange={setValue}
        value={value}
      >
        <Checkbox itemValue="react" label="React" />
        <Checkbox itemValue="vue" label="Vue" />
        <Checkbox itemValue="svelte" label="Svelte" />
      </CheckboxGroup.Root>
    </div>
  );
}

export function CheckboxGroupDisabledPreview() {
  return (
    <div>
      <p
        className="text-fg-base mb-2 font-medium"
        id="checkbox-group-disabled-label"
      >
        Frameworks
      </p>
      <CheckboxGroup.Root
        aria-labelledby="checkbox-group-disabled-label"
        defaultValue={['vue']}
        disabled
        name="frameworks-disabled"
      >
        <Checkbox itemValue="react" label="React" />
        <Checkbox itemValue="vue" label="Vue" />
        <Checkbox itemValue="svelte" label="Svelte" />
      </CheckboxGroup.Root>
    </div>
  );
}
