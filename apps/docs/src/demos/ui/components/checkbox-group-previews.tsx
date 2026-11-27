'use client';

import { CheckboxGroup } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './checkbox-group-previews.module.css';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
] as const;

export function CheckboxGroupControlledPreview() {
  const [value, setValue] = useState(['react']);

  return (
    <div>
      <p className={styles.groupLabel} id="cg-controlled-label">
        Frameworks
      </p>
      <CheckboxGroup
        aria-labelledby="cg-controlled-label"
        name="frameworks"
        onChange={setValue}
        options={FRAMEWORKS}
        value={value}
      />
    </div>
  );
}
