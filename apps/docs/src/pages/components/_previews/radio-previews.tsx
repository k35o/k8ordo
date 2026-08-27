'use client';

import { Radio } from '@k8ordo/ui';
import { useState } from 'react';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
] as const;

export function RadioControlledPreview() {
  const [value, setValue] = useState('react');

  return (
    <div className="w-full max-w-md">
      <p className="text-fg-base mb-3 font-medium" id="radio-controlled-label">
        Framework
      </p>
      <Radio
        defaultValue={undefined}
        disabled={false}
        aria-labelledby="radio-controlled-label"
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        options={options}
        value={value}
      />
    </div>
  );
}
