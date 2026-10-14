'use client';

import { definePageState, useAppState } from '@k8ordo/state';
import { Button, Code } from '@k8ordo/ui';
import { useEffect, useId, useRef, useState } from 'react';
import * as z from 'zod/mini';

import { jsLiteral } from '../../../components/js-literal';
import * as m from '../../../messages';

import styles from './writes-demo.module.css';

const t = m.stateUpdates;

// a と b は URL、c は履歴エントリ。どのボタンがどの書き込みになるかを、
// ブラウザが受け取ったイベントそのもので見せる
const demoState = definePageState('state-updates-demo', {
  url: z.object({
    a: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
    b: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
  }),
  entry: z.object({
    c: z._default(z.number().check(z.int(), z.gte(0)), 0),
  }),
});

/**
 * このコンポーネントが commit された回数を、返した ref の要素に書く。
 * 数えた値を state に持つと、数えること自体が再描画を起こしてしまう。
 */
function useCommitCount() {
  const count = useRef(0);
  const output = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    count.current += 1;
    if (output.current !== null) {
      output.current.textContent = String(count.current);
    }
  });
  return output;
}

type LogEntry = { id: number; text: string };

/** ページにいる間に Navigation API が受け取った書き込み。新しいものが先頭。 */
function useWriteLog(): readonly LogEntry[] {
  const [entries, setEntries] = useState<readonly LogEntry[]>([]);

  useEffect(() => {
    let next = 0;
    const append = (text: string) => {
      next += 1;
      const entry = { id: next, text };
      setEntries((current) => [entry, ...current].slice(0, 5));
    };
    const onNavigate = (event: NavigateEvent) => {
      const { search } = new URL(event.destination.url);
      append(
        `navigate · ${event.navigationType} · ${search === '' ? t.demoNoQuery() : search}`,
      );
    };
    // navigate を伴う遷移も currententrychange を出すので、種類が null の
    // もの（updateCurrentEntry）だけを拾う
    const onEntryChange = (event: NavigationCurrentEntryChangeEvent) => {
      if (event.navigationType === null) append('updateCurrentEntry');
    };
    navigation.addEventListener('navigate', onNavigate);
    navigation.addEventListener('currententrychange', onEntryChange);
    return () => {
      navigation.removeEventListener('navigate', onNavigate);
      navigation.removeEventListener('currententrychange', onEntryChange);
    };
  }, []);

  return entries;
}

function Controls() {
  // 何も購読しないので、ボタンを押してもこのコンポーネントは描き直されない
  const [, update] = useAppState(demoState, []);
  const buttons = [
    {
      label: 'a + 1',
      onClick: () => {
        update((current) => ({ a: current.a + 1 }));
      },
    },
    {
      label: t.demoThrice(),
      onClick: () => {
        update((current) => ({ a: current.a + 1 }));
        update((current) => ({ a: current.a + 1 }));
        update((current) => ({ a: current.a + 1 }));
      },
    },
    {
      label: 'b + 1',
      onClick: () => {
        update((current) => ({ b: current.b + 1 }));
      },
    },
    {
      label: 'c + 1',
      onClick: () => {
        update((current) => ({ c: current.c + 1 }));
      },
    },
    {
      label: 'a = -1',
      onClick: () => {
        update({ a: -1 });
      },
    },
    {
      label: t.demoPush(),
      onClick: () => {
        update((current) => ({ a: current.a + 1 }), { history: 'push' });
      },
    },
  ];

  return (
    <div className={styles.controls}>
      {buttons.map((button) => (
        <Button
          color="base"
          key={button.label}
          onClick={button.onClick}
          size="sm"
          variant="outline"
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}

type SubscriptionProps = {
  call: string;
  state: object;
};

function Subscription({ call, state }: SubscriptionProps) {
  const renders = useCommitCount();
  return (
    <li className={styles.subscription}>
      <span className={styles.call}>
        <Code>{call}</Code>
        <span className={styles.state}>{jsLiteral(state)}</span>
      </span>
      <span className={styles.renders}>
        {t.demoRenders()} <span className={styles.count} ref={renders} />
      </span>
    </li>
  );
}

function WatchAll() {
  const [state] = useAppState(demoState);
  return <Subscription call="useAppState(def)" state={state} />;
}

function WatchA() {
  const [state] = useAppState(demoState, ['a']);
  return <Subscription call="useAppState(def, ['a'])" state={state} />;
}

function WatchB() {
  const [state] = useAppState(demoState, ['b']);
  return <Subscription call="useAppState(def, ['b'])" state={state} />;
}

function WriteLog() {
  const entries = useWriteLog();
  const label = useId();

  return (
    <div className={styles.log}>
      <span className={styles.logLabel} id={label}>
        {t.demoLog()}
      </span>
      <div aria-labelledby={label} aria-live="polite" role="log">
        {entries.length === 0 ? (
          <span className={styles.logEmpty}>{t.demoLogEmpty()}</span>
        ) : (
          <ol className={styles.logList}>
            {entries.map((entry) => (
              <li className={styles.logEntry} key={entry.id}>
                <Code>{entry.text}</Code>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export function WritesDemo() {
  return (
    <div className={styles.root}>
      <Controls />
      <ul className={styles.subscriptions}>
        <WatchAll />
        <WatchA />
        <WatchB />
      </ul>
      <WriteLog />
    </div>
  );
}
