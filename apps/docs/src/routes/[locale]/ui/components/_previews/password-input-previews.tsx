'use client';

import { PasswordInput } from '@k8ordo/ui';
import { useState } from 'react';

export function PasswordInputControlledPreview() {
  const [value, setValue] = useState('hunter2');

  return (
    <PasswordInput
      disabled={false}
      invalid={false}
      required={false}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      value={value}
    />
  );
}
