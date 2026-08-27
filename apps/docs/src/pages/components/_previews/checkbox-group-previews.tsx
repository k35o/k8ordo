'use client';

import { Checkbox, CheckboxGroup } from '@k8ordo/ui';
import { useState } from 'react';

export function CheckboxGroupControlledPreview() {
  const [value, setValue] = useState(['react']);

  return (
    <div>
      <p className="text-fg-base mb-2 font-medium" id="cg-controlled-label">
        Frameworks
      </p>
      <CheckboxGroup.Root
        aria-labelledby="cg-controlled-label"
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
