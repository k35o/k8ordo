'use client';

import { TextField, useDeferredDebounce } from '@k8ordo/ui';
import { useMemo, useState } from 'react';

const WORDS = [
  'apple',
  'banana',
  'cherry',
  'dragonfruit',
  'elderberry',
  'fig',
  'grape',
  'honeydew',
  'kiwi',
  'lemon',
  'mango',
  'nectarine',
  'orange',
  'papaya',
  'quince',
  'raspberry',
  'strawberry',
  'tangerine',
  'ugli',
  'voavanga',
  'watermelon',
];

const expanded = Array.from(
  { length: 400 },
  (_, i) => WORDS[i % WORDS.length] ?? '',
);

export function UseDeferredDebouncePreview() {
  const [query, setQuery] = useState('');
  const [deferredQuery, isPending] = useDeferredDebounce(query);

  const filtered = useMemo(
    () => expanded.filter((w) => w.includes(deferredQuery)),
    [deferredQuery],
  );

  return (
    <div className="flex flex-col gap-3">
      <TextField
        aria-describedby={undefined}
        id="deferred-debounce-demo"
        disabled={false}
        invalid={false}
        required={false}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="fruit"
        value={query}
      />
      <p className="text-fg-mute text-sm">
        {isPending ? 'Updating…' : `${filtered.length.toString()} results`}
      </p>
      <ul
        aria-busy={isPending || undefined}
        className={`border-border-base max-h-48 overflow-auto rounded-lg border p-2 text-sm transition-opacity ${
          isPending ? 'opacity-60' : ''
        }`}
      >
        {filtered.slice(0, 20).map((w, i) => (
          <li className="py-0.5" key={`${w}-${i.toString()}`}>
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}
