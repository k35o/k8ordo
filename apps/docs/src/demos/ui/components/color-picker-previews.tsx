'use client';

import { ColorPicker } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './color-picker-previews.module.css';

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
    <div className={styles.root}>
      <ColorPicker
        aria-label="Accent color"
        onChange={setColor}
        swatches={SWATCHES}
        value={color}
      />
      <p className={styles.value}>value: {color === '' ? "''" : color}</p>
    </div>
  );
}
