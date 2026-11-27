'use client';

import { Checkbox } from '@k8ordo/ui';
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
