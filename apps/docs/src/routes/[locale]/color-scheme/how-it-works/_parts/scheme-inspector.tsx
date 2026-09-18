'use client';

import { colorSchemeState, useColorScheme } from '@k8ordo/color-scheme';
import { useAppState } from '@k8ordo/state';
import { Code } from '@k8ordo/ui';
import { Suspense, use, useSyncExternalStore } from 'react';
import { browser } from 'react-dom';

import * as m from '../../../../../messages';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const subscribeSystem = (onChange: () => void) => {
  const query = matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
};
const readSystemDark = () => matchMedia(DARK_QUERY).matches;

// Provider はクラスを effect で付け外しするので、React の描画ではなく
// <html> の属性の変化そのものを聞く。
const subscribeRootClass = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['class'] });
  return () => {
    observer.disconnect();
  };
};
const readRootDark = () => document.documentElement.classList.contains('dark');

// storage イベントは書いたタブ自身には届かない。このタブの書き込みは
// useAppState の再描画で読み直す（書き込みはその描画より先に済んでいる）。
const subscribeRow = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
  };
};
const readRow = () => localStorage.getItem(colorSchemeState.storageKey);

const INPUT_LABELS = [
  `matchMedia('${DARK_QUERY}').matches`,
  `localStorage.getItem('${colorSchemeState.storageKey}')`,
  'useAppState(colorSchemeState)',
] as const;

const RESULT_LABELS = [
  'useColorScheme().preference',
  'useColorScheme().scheme',
  "document.documentElement.classList.contains('dark')",
] as const;

function Group({
  title,
  labels,
  values,
}: {
  title: string;
  labels: readonly string[];
  values: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-fg-subtle text-xs font-medium">{title}</h4>
      <dl className="flex flex-col gap-2 text-sm">
        {labels.map((label, index) => (
          <div
            className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3"
            key={label}
          >
            <dt className="text-fg-mute break-all">{label}</dt>
            <dd>
              <Code>{values.at(index) ?? ''}</Code>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Panel({
  inputs,
  result,
}: {
  inputs: readonly [string, string, string];
  result: readonly [string, string, string];
}) {
  return (
    <>
      <Group
        labels={INPUT_LABELS}
        title={m.colorSchemeHowItWorks.inspector.inputs()}
        values={inputs}
      />
      <Group
        labels={RESULT_LABELS}
        title={m.colorSchemeHowItWorks.inspector.result()}
        values={result}
      />
    </>
  );
}

// 事前描画（Node）には localStorage も matchMedia も <html> のクラスも無い。
// サーバーは推測を書かず、下の <Suspense> の fallback を残す。
function LivePanel() {
  use(browser('the stored row, the system and <html> are the visitor’s'));
  const systemDark = useSyncExternalStore(subscribeSystem, readSystemDark);
  const rootDark = useSyncExternalStore(subscribeRootClass, readRootDark);
  const row = useSyncExternalStore(subscribeRow, readRow);
  const [stored] = useAppState(colorSchemeState);
  const { preference, scheme } = useColorScheme();

  return (
    <Panel
      inputs={[
        String(systemDark),
        row === null ? 'null' : `'${row}'`,
        JSON.stringify(stored),
      ]}
      result={[preference, scheme, String(rootDark)]}
    />
  );
}

export function SchemeInspector() {
  const unknown = m.colorSchemeHowItWorks.inspector.unknown();

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <Suspense
        fallback={
          <Panel
            inputs={[unknown, unknown, unknown]}
            result={[unknown, unknown, unknown]}
          />
        }
      >
        <LivePanel />
      </Suspense>
    </div>
  );
}
