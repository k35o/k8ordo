'use client';

import { definePageState, useAppState } from '@k8ordo/state';
import { Button, Code, Table } from '@k8ordo/ui';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import * as z from 'zod/mini';

import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

// a と b は URL、c は履歴エントリ。どのボタンがどの書き込みになるかを、
// ブラウザが受け取ったイベントそのもので見せる。
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const updatesDemoState = definePageState('state-updates-demo', {
  url: z.object({
    a: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
    b: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
  }),
  entry: z.object({
    c: z._default(z.number().check(z.int(), z.gte(0)), 0),
  }),
});
/* oxlint-enable no-underscore-dangle */

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
        `navigate · ${event.navigationType} · ${search === '' ? m.stateUpdates.demoNoQuery() : search}`,
      );
    };
    // navigate を伴う遷移も currententrychange を発火するので、種類が null の
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
  const [, update] = useAppState(updatesDemoState, []);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        color="base"
        onClick={() => {
          update((current) => ({ a: current.a + 1 }));
        }}
        size="sm"
        variant="outline"
      >
        a + 1
      </Button>
      <Button
        color="base"
        onClick={() => {
          update((current) => ({ b: current.b + 1 }));
        }}
        size="sm"
        variant="outline"
      >
        b + 1
      </Button>
      <Button
        color="base"
        onClick={() => {
          update((current) => ({ a: current.a + 1 }));
          update((current) => ({ a: current.a + 1 }));
          update((current) => ({ a: current.a + 1 }));
        }}
        size="sm"
        variant="outline"
      >
        a + 1 (×3)
      </Button>
      <Button
        color="base"
        onClick={() => {
          update((current) => ({ c: current.c + 1 }));
        }}
        size="sm"
        variant="outline"
      >
        c + 1
      </Button>
      <Button
        color="base"
        onClick={() => {
          update({ a: -1 });
        }}
        size="sm"
        variant="outline"
      >
        a = -1
      </Button>
      <Button
        color="base"
        onClick={() => {
          update({ a: 0, b: 0, c: 0 });
        }}
        size="sm"
        variant="outline"
      >
        a = b = c = 0
      </Button>
    </div>
  );
}

type SubscriptionRowProps = {
  call: string;
  state: string;
  children: ReactNode;
};

function SubscriptionRow({ call, state, children }: SubscriptionRowProps) {
  return (
    <Table.Row>
      <Table.Cell>
        <Code>{call}</Code>
      </Table.Cell>
      <Table.Cell>
        <Code>{state}</Code>
      </Table.Cell>
      <Table.Cell align="right">{children}</Table.Cell>
    </Table.Row>
  );
}

function WatchAll() {
  const [state] = useAppState(updatesDemoState);
  const renders = useCommitCount();
  return (
    <SubscriptionRow call="useAppState(def)" state={JSON.stringify(state)}>
      <span ref={renders} />
    </SubscriptionRow>
  );
}

function WatchA() {
  const [state] = useAppState(updatesDemoState, ['a']);
  const renders = useCommitCount();
  return (
    <SubscriptionRow
      call="useAppState(def, ['a'])"
      state={JSON.stringify(state)}
    >
      <span ref={renders} />
    </SubscriptionRow>
  );
}

function WatchB() {
  const [state] = useAppState(updatesDemoState, ['b']);
  const renders = useCommitCount();
  return (
    <SubscriptionRow
      call="useAppState(def, ['b'])"
      state={JSON.stringify(state)}
    >
      <span ref={renders} />
    </SubscriptionRow>
  );
}

function WriteLog() {
  const entries = useWriteLog();
  const label = useId();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-fg-mute text-sm" id={label}>
        {m.stateUpdates.demoLog()}
      </span>
      <div aria-labelledby={label} aria-live="polite" role="log">
        {entries.length === 0 ? (
          <span className="text-fg-subtle text-sm">
            {m.stateUpdates.demoLogEmpty()}
          </span>
        ) : (
          <ol className="flex flex-col gap-1 text-sm">
            {entries.map((entry) => (
              <li className="break-all" key={entry.id}>
                <Code>{entry.text}</Code>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export function UpdatesDemo() {
  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <Controls />
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>
              {m.stateUpdates.demoSubscription()}
            </Table.HeaderCell>
            <Table.HeaderCell>state</Table.HeaderCell>
            <Table.HeaderCell align="right">
              {m.stateUpdates.demoRenders()}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <WatchAll />
          <WatchA />
          <WatchB />
        </Table.Body>
      </Table.Root>
      <WriteLog />
      <p className="text-fg-mute text-sm leading-relaxed">
        <Rich>{m.stateUpdates.demoHint()}</Rich>
      </p>
    </div>
  );
}
