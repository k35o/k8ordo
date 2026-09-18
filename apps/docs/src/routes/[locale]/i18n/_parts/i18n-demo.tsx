'use client';

import { Code, FormControl, TextField } from '@k8ordo/ui';
import { Suspense, use, useState, useSyncExternalStore } from 'react';
import { browser } from 'react-dom';

import { Rich } from '../../../../components/rich';
import { locales } from '../../../../i18n';
import * as m from '../../../../messages';

// `languagechange` は設定が変わったときにブラウザが上げるイベント。
const subscribeLanguages = (onChange: () => void) => {
  window.addEventListener('languagechange', onChange);
  return () => {
    window.removeEventListener('languagechange', onChange);
  };
};
const readLanguages = () => navigator.languages.join(',');

const PreferredRow = ({ preferred }: { preferred: string }) => (
  <div className="flex flex-wrap gap-3">
    <dt className="text-fg-mute">{m.i18n.demoPreferred()}</dt>
    <dd>
      <Code>{preferred}</Code>
    </dd>
  </div>
);

// 事前描画（Node）の navigator.languages はサーバーの言語で、訪問者の
// ものではない。ブラウザでしか描けないことは `use(browser())` で言う:
// サーバーは上の <Suspense> の fallback を残し、ブラウザが hydrate 後に
// ここを描く。null のサーバースナップショットで「まだ分からない」を表す
// 必要は無くなった。
function BrowserLanguages() {
  use(browser('navigator.languages is the visitor’s'));
  const languages = useSyncExternalStore(subscribeLanguages, readLanguages);
  return (
    <>
      <PreferredRow preferred={locales.negotiate(languages.split(','))} />
      <div className="flex flex-wrap gap-3">
        <dt className="text-fg-mute">navigator.languages</dt>
        <dd className="break-all">
          <Code>{languages}</Code>
        </dd>
      </div>
    </>
  );
}

export function I18nDemo() {
  const [name, setName] = useState('');

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <div className="sm:w-64">
        <FormControl
          label={m.i18n.demoLabelName()}
          renderInput={(props) => (
            <TextField
              {...props}
              autoComplete="off"
              onChange={(event) => {
                setName(event.currentTarget.value);
              }}
              value={name}
            />
          )}
        />
      </div>
      <p className="text-fg-base text-lg">{m.i18n.demoGreeting(name)}</p>
      <dl className="flex flex-col gap-1 text-sm">
        <Suspense
          fallback={<PreferredRow preferred={m.i18n.demoPreferredUnknown()} />}
        >
          <BrowserLanguages />
        </Suspense>
      </dl>
      <p className="text-fg-mute text-sm leading-relaxed">
        <Rich>{m.i18n.demoHint()}</Rich>
      </p>
    </div>
  );
}
