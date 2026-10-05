'use client';

import { Code, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { locales } from '../../../../../i18n';
import type { Locale } from '../../../../../i18n';

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
    <div className="flex flex-col gap-1">
      <dt className="text-fg-mute break-all">
        <Code>{call}</Code>
      </dt>
      <dd className="break-all">{children}</dd>
    </div>
  );
}

export function LocalizeDemo() {
  const [input, setInput] = useState('/ja/products/42');
  const { locale, pathname } = locales.delocalize(input);

  return (
    <div className="flex flex-col gap-6">
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
      <dl className="flex flex-col gap-4 text-sm">
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
                <span className="text-fg-error">{outcome.error}</span>
              )}
            </Row>
          );
        })}
      </dl>
    </div>
  );
}
