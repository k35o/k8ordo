'use client';

import { DatePicker } from '@k8ordo/ui';
import { useState } from 'react';

export function DatePickerControlledPreview() {
  const [value, setValue] = useState('2026-09-25');
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <DatePicker aria-label="Check-in" onChange={setValue} value={value} />
      <p className="text-fg-mute text-sm tabular-nums">
        {value === '' ? '—' : value}
      </p>
    </div>
  );
}
