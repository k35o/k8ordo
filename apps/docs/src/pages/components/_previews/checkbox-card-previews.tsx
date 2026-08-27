'use client';

import { CheckboxCard } from '@k8ordo/ui';
import { useState } from 'react';

const options = [
  {
    value: 'history',
    label: 'Version history',
    description: 'Keep every change and roll back when needed.',
  },
  {
    value: 'comments',
    label: 'Inline comments',
    description: 'Leave feedback directly on each section.',
  },
  {
    value: 'share',
    label: 'Share links',
    description: 'Publish read-only share links in seconds.',
  },
] as const;

export function CheckboxCardControlledPreview() {
  const [value, setValue] = useState<string[]>(['comments']);

  return (
    <div className="w-full max-w-2xl">
      <p
        className="text-fg-base mb-3 font-medium"
        id="checkbox-card-preview-label"
      >
        Choose features to enable
      </p>
      <CheckboxCard
        disabled={false}
        invalid={false}
        aria-labelledby="checkbox-card-preview-label"
        onChange={setValue}
        options={options}
        value={value}
      />
    </div>
  );
}
