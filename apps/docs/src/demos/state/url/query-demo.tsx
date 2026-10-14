'use client';

import { definePageState } from '@k8ordo/state';
import { Code, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';
import * as z from 'zod/mini';

import { jsLiteral } from '../../../components/js-literal';
import * as m from '../../../messages';

import styles from './query-demo.module.css';

const t = m.stateUrl;

// ページに載せる catalogState と同じ形。parseUrl と search は純粋なので、
// ストアは作らず、このページの URL にも触れない
const catalogState = definePageState('state-url-demo', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    inStock: z._default(z.stringbool(), false),
    tags: z._default(z.array(z.enum(['sale', 'new'])), []),
  }),
});

export function QueryDemo() {
  const [query, setQuery] = useState('q=lamp&page=2');
  const values = catalogState.parseUrl(new URLSearchParams(query));
  const canonical = catalogState.search(values);

  return (
    <div className={styles.root}>
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
      <dl className={styles.values}>
        {Object.entries(values).map(([key, value]) => (
          <div className={styles.entry} key={key}>
            <dt className={styles.term}>
              <Code>{key}</Code>
            </dt>
            <dd className={styles.value}>
              <Code>{jsLiteral(value)}</Code>
            </dd>
          </div>
        ))}
      </dl>
      <dl className={styles.canonical}>
        <dt className={styles.term}>{t.demoCanonical()}</dt>
        <dd className={styles.value}>
          <Code>{canonical === '' ? t.demoEmpty() : canonical}</Code>
        </dd>
      </dl>
    </div>
  );
}
