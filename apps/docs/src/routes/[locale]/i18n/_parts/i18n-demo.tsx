'use client';

import { Code, FormControl, TextField } from '@k8ordo/ui';
import { useState, useSyncExternalStore } from 'react';

import { T } from '../../../../components/t';
import { locales, useTranslation } from '../../../../i18n';

// 事前描画（Node）に navigator は無いので、ブラウザの言語設定は外部ストアとして
// 読む。サーバースナップショットは null で、hydrate 後に本物へ切り替わる。
// `languagechange` は設定が変わったときにブラウザが上げるイベント。
const subscribeLanguages = (onChange: () => void) => {
  window.addEventListener('languagechange', onChange);
  return () => {
    window.removeEventListener('languagechange', onChange);
  };
};
const readLanguages = () => navigator.languages.join(',');
const serverLanguages = () => null;

export function I18nDemo() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const languages = useSyncExternalStore(
    subscribeLanguages,
    readLanguages,
    serverLanguages,
  );
  const preferred =
    languages === null ? null : locales.negotiate(languages.split(','));

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <div className="sm:w-64">
        <FormControl
          label={t('i18n.demoLabelName')}
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
      <p className="text-fg-base text-lg">{t('i18n.demoGreeting', name)}</p>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex flex-wrap gap-3">
          <dt className="text-fg-mute">{t('i18n.demoPreferred')}</dt>
          <dd>
            <Code>{preferred ?? t('i18n.demoPreferredUnknown')}</Code>
          </dd>
        </div>
        {languages === null ? null : (
          <div className="flex flex-wrap gap-3">
            <dt className="text-fg-mute">navigator.languages</dt>
            <dd className="break-all">
              <Code>{languages}</Code>
            </dd>
          </div>
        )}
      </dl>
      <p className="text-fg-mute text-sm leading-relaxed">
        <T k="i18n.demoHint" />
      </p>
    </div>
  );
}
