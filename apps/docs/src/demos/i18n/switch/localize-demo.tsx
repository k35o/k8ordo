'use client';

import { Code, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { locales } from '../../../i18n';
import type { Locale } from '../../../i18n';

import styles from './localize-demo.module.css';

const quote = (value: string | null): string =>
  value === null ? 'null' : `'${value}'`;

type Outcome = { ok: true; value: string } | { ok: false; error: string };

// localize は / で始まらない値に TypeError を投げる。デモではその文面を見せたい
// ので、投げたものを受け止めて表示する
const localizeTo = (pathname: string, locale: Locale): Outcome => {
  try {
    return { ok: true, value: locales.localize(pathname, locale) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? `${error.name}: ${error.message}` : '',
    };
  }
};

function Row({ call, children }: { call: string; children: ReactNode }) {
  return (
    <div className={styles.row}>
      <dt className={styles.call}>
        <Code>{call}</Code>
      </dt>
      <dd className={styles.value}>{children}</dd>
    </div>
  );
}

export function LocalizeDemo() {
  const [input, setInput] = useState('/ja/products/42');
  const { locale, pathname } = locales.delocalize(input);

  return (
    <div className={styles.root}>
      <FormControl
        label="pathname"
        renderInput={(props) => (
          <TextField
            {...props}
            autoComplete="off"
            onChange={(event) => {
              setInput(event.currentTarget.value);
            }}
            spellCheck={false}
            value={input}
          />
        )}
      />
      <dl className={styles.rows}>
        <Row call={`delocalize(${quote(input)})`}>
          <Code>
            {`{ locale: ${quote(locale)}, pathname: ${quote(pathname)} }`}
          </Code>
        </Row>
        {locales.all.map((target) => {
          const outcome = localizeTo(pathname, target);
          return (
            <Row
              call={`localize(${quote(pathname)}, ${quote(target)})`}
              key={target}
            >
              {outcome.ok ? (
                <Code>{quote(outcome.value)}</Code>
              ) : (
                <span className={styles.error}>{outcome.error}</span>
              )}
            </Row>
          );
        })}
      </dl>
    </div>
  );
}
