'use client';

import { ColorPicker } from '@k8ordo/ui';
import { useState } from 'react';

export const SWATCHES = [
  { value: '#0d9488', label: 'Teal' },
  { value: '#2563eb', label: 'Blue' },
  { value: '#f97316', label: 'Orange' },
  { value: '#e11d48', label: 'Rose' },
  { value: '#171717', label: 'Black' },
];

export function ColorPickerControlledPreview() {
  const [color, setColor] = useState('#2563eb');
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <ColorPicker
        aria-label="Accent color"
        onChange={setColor}
        swatches={SWATCHES}
        value={color}
      />
      <p className="text-fg-mute text-sm tabular-nums">
        value: {color === '' ? "''" : color}
      </p>
    </div>
  );
}
