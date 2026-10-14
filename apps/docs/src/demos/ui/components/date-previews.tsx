'use client';

import { DatePicker } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './date-previews.module.css';

export function DatePickerControlledPreview() {
  const [value, setValue] = useState('2026-09-25');
  return (
    <div className={styles.root}>
      <DatePicker aria-label="Check-in" onChange={setValue} value={value} />
      <p className={styles.value}>{value === '' ? '—' : value}</p>
    </div>
  );
}
