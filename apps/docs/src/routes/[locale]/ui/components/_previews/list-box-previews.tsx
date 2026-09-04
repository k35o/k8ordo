'use client';

import { ListBox, ListIcon } from '@k8ordo/ui';
import type { Option } from '@k8ordo/ui';
import { useState } from 'react';

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
    <div className="w-56">
      <ListBox.Root
        onChange={(value: string) => {
          setSelected(value);
        }}
        options={OPTIONS}
        value={selected}
      >
        <ListBox.Trigger label="Fruit" />
        <ListBox.Content />
      </ListBox.Root>
    </div>
  );
}

export function ListBoxSizesPreview() {
  const [sm, setSm] = useState<string>();
  const [md, setMd] = useState<string>();
  const [lg, setLg] = useState<string>();
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="w-44">
        <ListBox.Root
          onChange={(value: string) => {
            setSm(value);
          }}
          options={OPTIONS}
          value={sm}
        >
          <ListBox.Trigger label="Fruit (sm)" size="sm" />
          <ListBox.Content />
        </ListBox.Root>
      </div>
      <div className="w-48">
        <ListBox.Root
          onChange={(value: string) => {
            setMd(value);
          }}
          options={OPTIONS}
          value={md}
        >
          <ListBox.Trigger label="Fruit (md)" size="md" />
          <ListBox.Content />
        </ListBox.Root>
      </div>
      <div className="w-56">
        <ListBox.Root
          onChange={(value: string) => {
            setLg(value);
          }}
          options={OPTIONS}
          value={lg}
        >
          <ListBox.Trigger label="Fruit (lg)" size="lg" />
          <ListBox.Content />
        </ListBox.Root>
      </div>
    </div>
  );
}

export function ListBoxIconTriggerPreview() {
  const [selected, setSelected] = useState<string>();
  return (
    <ListBox.Root
      onChange={(value: string) => {
        setSelected(value);
      }}
      options={OPTIONS}
      value={selected}
    >
      <ListBox.IconTrigger icon={<ListIcon />} label="Fruit" />
      <ListBox.Content />
    </ListBox.Root>
  );
}
