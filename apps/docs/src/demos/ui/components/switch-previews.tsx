'use client';

import { Switch } from '@k8ordo/ui';
import { useState } from 'react';

export function SwitchControlledPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      disabled={false}
      invalid={false}
      required={false}
      label="Controlled switch"
      onChange={(next) => {
        setChecked(next);
      }}
    />
  );
}
