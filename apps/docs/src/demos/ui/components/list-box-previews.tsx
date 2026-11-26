'use client';

import { ListBox } from '@k8ordo/ui';
import type { Option } from '@k8ordo/ui';
import { ListIcon } from '@k8ordo/ui/icons';
import { useState } from 'react';

import styles from './list-box-previews.module.css';

const OPTIONS: readonly Option[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'melon', label: 'Melon' },
];

export function ListBoxBasicPreview() {
  const [selected, setSelected] = useState<string>();
  return (
    <div className={styles.frame}>
      <ListBox
        label="Fruit"
        onChange={(value: string) => {
          setSelected(value);
        }}
        options={OPTIONS}
        value={selected}
      />
    </div>
  );
}

export function ListBoxSizesPreview() {
  const [sm, setSm] = useState<string>();
  const [md, setMd] = useState<string>();
  const [lg, setLg] = useState<string>();
  return (
    <div className={styles.sizes}>
      <div className={styles.sm}>
        <ListBox
          label="Fruit (sm)"
          size="sm"
          onChange={(value: string) => {
            setSm(value);
          }}
          options={OPTIONS}
          value={sm}
        />
      </div>
      <div className={styles.md}>
        <ListBox
          label="Fruit (md)"
          size="md"
          onChange={(value: string) => {
            setMd(value);
          }}
          options={OPTIONS}
          value={md}
        />
      </div>
      <div className={styles.lg}>
        <ListBox
          label="Fruit (lg)"
          size="lg"
          onChange={(value: string) => {
            setLg(value);
          }}
          options={OPTIONS}
          value={lg}
        />
      </div>
    </div>
  );
}

export function ListBoxIconTriggerPreview() {
  const [selected, setSelected] = useState<string>();
  return (
    <ListBox
      icon={<ListIcon />}
      label="Fruit"
      onChange={(value: string) => {
        setSelected(value);
      }}
      options={OPTIONS}
      value={selected}
    />
  );
}
