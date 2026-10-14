'use client';

import { Code } from '@k8ordo/ui';
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

import { locales } from '../../../i18n';
import * as m from '../../../messages';

import styles from './time-zone-demo.module.css';

// 協定世界時の 15:30。東京では翌日の 0:30 になり、タイムゾーンで日付が分かれる
const INSTANT = new Date('2026-03-05T15:30:00Z');
const OPTIONS = { dateStyle: 'long', timeStyle: 'short' } as const;

function Row({
  call,
  value,
  zone,
}: {
  call: string;
  value: string;
  zone: string;
}) {
  return (
    <div className={styles.row}>
      <dt className={styles.call}>
        <Code>{call}</Code>
      </dt>
      <dd className={styles.result}>
        <span className={styles.value}>{value}</span>
        <span className={styles.zone}>{zone}</span>
      </dd>
    </div>
  );
}

const BROWSER_CALL = 'new Intl.DateTimeFormat(locales.getLocale(), …)';

// 事前描画（Node）のタイムゾーンはビルドするマシンのもので、訪問者のもの
// ではない。サーバーは推測を書かず、下の <Suspense> の fallback を残す
function BrowserRow() {
  use(browser('the time zone is the visitor’s'));
  const format = new Intl.DateTimeFormat(locales.getLocale(), OPTIONS);
  return (
    <Row
      call={BROWSER_CALL}
      value={format.format(INSTANT)}
      zone={format.resolvedOptions().timeZone}
    />
  );
}

export function TimeZoneDemo() {
  const format = locales.dateTimeFormat(OPTIONS);

  return (
    <dl className={styles.root}>
      <Row
        call="locales.dateTimeFormat(…)"
        value={format.format(INSTANT)}
        zone={format.resolvedOptions().timeZone}
      />
      <Suspense
        fallback={
          <Row
            call={BROWSER_CALL}
            value={m.i18nFormatting.demoPending()}
            zone=""
          />
        }
      >
        <BrowserRow />
      </Suspense>
    </dl>
  );
}
