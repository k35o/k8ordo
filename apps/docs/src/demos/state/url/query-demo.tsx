'use client';

import { definePageState } from '@k8ordo/state';
import { Code, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';
import * as z from 'zod/mini';

import * as m from '../../../messages';

const t = m.stateUrl;

// ページに載せる catalogState と同じ形。parseUrl と search は純粋なので、
// ストアは作らず、このページの URL にも触れない
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const catalogState = definePageState('state-url-demo', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    inStock: z._default(z.stringbool(), false),
    tags: z._default(z.array(z.enum(['sale', 'new'])), []),
  }),
});
/* oxlint-enable no-underscore-dangle */

export function QueryDemo() {
  const [query, setQuery] = useState('q=lamp&page=2');
  const values = catalogState.parseUrl(new URLSearchParams(query));
  const canonical = catalogState.search(values);

  return (
    <div className="flex flex-col gap-6">
      <FormControl
        label={t.demoLabel()}
        renderInput={(props) => (
          <TextField
            {...props}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            spellCheck={false}
            value={query}
          />
        )}
      />
      <dl className="bg-bg-surface grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm">
        {Object.entries(values).map(([key, value]) => (
          <div className="contents" key={key}>
            <dt className="text-fg-mute">
              <Code>{key}</Code>
            </dt>
            <dd className="break-all">
              <Code>{JSON.stringify(value)}</Code>
            </dd>
          </div>
        ))}
      </dl>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 text-sm">
        <dt className="text-fg-mute">{t.demoCanonical()}</dt>
        <dd className="break-all">
          <Code>{canonical === '' ? t.demoEmpty() : canonical}</Code>
        </dd>
      </dl>
    </div>
  );
}
