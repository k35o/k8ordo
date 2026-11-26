import { Badge, Heading, Spinner } from '@k8ordo/ui';
import { useId } from 'react';
import type { ReactNode } from 'react';

import type { Format } from './request';

export type Phase = 'idle' | 'streaming' | 'done';

const STATE_CAPTIONS = {
  a2ui: 'surface ごとのデータモデル。入力欄は {"@path": …} でここに結ばれています。',
  'json-render': 'spec の state。入力欄は $bindState でここに結ばれています。',
  openui: 'フォームの状態。入力欄は name でここに結ばれています。',
} as const satisfies Record<Format, string>;

const OUTPUT_CAPTIONS = {
  a2ui: 'A2UI のメッセージ。1 行に 1 つの JSON です。',
  'json-render': 'spec を組み立てる JSON Patch。1 行に 1 つです。',
  openui: 'OpenUI Lang のプログラム。',
} as const satisfies Record<Format, string>;

function Pane({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Heading id={headingId} level="h2">
          {title}
        </Heading>
        <p className="text-fg-mute text-sm">{caption}</p>
      </div>
      {children}
    </section>
  );
}

function Placeholder({ children }: { children: string }) {
  return <p className="text-fg-subtle text-sm">{children}</p>;
}

function Source({ children }: { children: string }) {
  return (
    <pre className="bg-bg-subtle max-h-80 overflow-auto rounded-lg p-4 text-xs break-all whitespace-pre-wrap">
      {children}
    </pre>
  );
}

function Check({ phase, issues }: { phase: Phase; issues: readonly string[] }) {
  if (issues.length > 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Badge label={`食い違い ${String(issues.length)} 件`} tone="warning" />
        <ul className="flex list-disc flex-col gap-1 ps-5 text-sm">
          {issues.map((issue, index) => (
            <li key={`${String(index)}-${issue}`}>{issue}</li>
          ))}
        </ul>
      </div>
    );
  }
  switch (phase) {
    case 'idle':
      return <Placeholder>作らせたあとに、ここで確かめます。</Placeholder>;
    case 'streaming':
      return (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <Placeholder>書き終わるのを待っています。</Placeholder>
        </div>
      );
    case 'done':
      return (
        <div>
          <Badge label="カタログどおり" tone="success" />
        </div>
      );
  }
}

export function Panes({
  format,
  phase,
  view,
  issues,
  state,
  text,
}: {
  format: Format;
  phase: Phase;
  view: ReactNode;
  issues: readonly string[];
  state: string;
  text: string;
}) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Pane
        caption="書かれた分から、@k8ordo/ui の部品で描きます。ボタンを押しても、まだ Claude には何も返りません。"
        title="描画"
      >
        <div className="bg-bg-subtle rounded-2xl p-6">{view}</div>
      </Pane>
      <div className="flex flex-col gap-8">
        <Pane
          caption="Claude が書いた部品の名前と props が、@k8ordo/ui のカタログに合っているか。"
          title="検査"
        >
          <Check issues={issues} phase={phase} />
        </Pane>
        <Pane caption={STATE_CAPTIONS[format]} title="状態">
          {phase === 'idle' ? (
            <Placeholder>まだありません。</Placeholder>
          ) : (
            <Source>{state}</Source>
          )}
        </Pane>
        <Pane caption={OUTPUT_CAPTIONS[format]} title="Claude の出力">
          {phase === 'idle' ? (
            <Placeholder>まだありません。</Placeholder>
          ) : (
            <Source>{text}</Source>
          )}
        </Pane>
      </div>
    </div>
  );
}
