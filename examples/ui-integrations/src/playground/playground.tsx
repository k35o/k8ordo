import {
  Alert,
  Button,
  EmptyState,
  FormControl,
  Select,
  Stack,
  Textarea,
} from '@k8ordo/ui';
import { useState, useTransition } from 'react';
import type { SubmitEvent } from 'react';

import { createLineBuffer } from './lines';
import { Panes } from './panes';
import { FORMATS } from './request';
import type { Format } from './request';
import { Result, startSession, withA2uiLines } from './results';
import type { Session } from './results';
import { generate } from './stream';

const FORMAT_LABELS = {
  a2ui: 'A2UI 1.0',
  'json-render': 'json-render',
  openui: 'OpenUI',
} as const satisfies Record<Format, string>;

const reportOf = (action: unknown, state: unknown): string =>
  [
    'The user acted on the UI.',
    `Action: ${JSON.stringify(action)}`,
    `State of the UI now: ${JSON.stringify(state)}`,
  ].join('\n');

export function Playground() {
  const [format, setFormat] = useState<Format>('a2ui');
  const [prompt, setPrompt] = useState(
    '会員登録のフォームを作って。名前、メールアドレス、プラン（無料とプロ）、規約への同意を入れて。',
  );
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, startTransition] = useTransition();

  const converse = (start: Session) => {
    startTransition(async () => {
      let current = start;
      let lines = createLineBuffer();
      const show = (next: Session) => {
        current = next;
        setSession(next);
      };
      show(current);

      for await (const streamed of generate(current.format, current.turns)) {
        switch (streamed.type) {
          case 'text':
            show(
              withA2uiLines(
                { ...current, reply: current.reply + streamed.text },
                lines.push(streamed.text),
              ),
            );
            break;
          case 'restart':
            lines = createLineBuffer();
            show({
              ...(current.turns.length === 1
                ? startSession(current.format, prompt)
                : current),
              reply: '',
              notice: `${streamed.model} が最初から書き直しています。`,
            });
            break;
          case 'done': {
            const done = withA2uiLines(current, lines.flush());
            show(
              done.reply.trim() === ''
                ? {
                    ...done,
                    isStreaming: false,
                    error: 'Claude の返事が空でした。',
                  }
                : {
                    ...done,
                    isStreaming: false,
                    turns: [
                      ...done.turns,
                      { role: 'assistant', content: done.reply },
                    ],
                    reply: '',
                  },
            );
            break;
          }
          case 'error':
            show({ ...current, isStreaming: false, error: streamed.message });
            break;
        }
      }
    });
  };

  const run = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    converse(startSession(format, prompt));
  };

  const respond = (action: unknown, state: unknown) => {
    if (
      session === null ||
      session.isStreaming ||
      session.error !== null ||
      session.turns.at(-1)?.role !== 'assistant'
    ) {
      return;
    }
    converse({
      ...session,
      turns: [
        ...session.turns,
        { role: 'user', content: reportOf(action, state) },
      ],
      reply: '',
      isStreaming: true,
      notice: null,
    });
  };

  return (
    <Stack direction="column" gap="xl">
      <form className="flex max-w-2xl flex-col gap-4" onSubmit={run}>
        <FormControl
          label="形式"
          renderInput={(props) => (
            <Select
              {...props}
              onChange={(event) => {
                setFormat(event.target.value as Format);
              }}
              options={FORMATS.map((value) => ({
                value,
                label: FORMAT_LABELS[value],
              }))}
              value={format}
            />
          )}
        />
        <FormControl
          label="作ってほしい画面"
          renderInput={(props) => (
            <Textarea
              {...props}
              onChange={(event) => {
                setPrompt(event.target.value);
              }}
              rows={3}
              value={prompt}
            />
          )}
        />
        <div>
          <Button disabled={isPending} type="submit" variant="solid">
            Claude に作らせる
          </Button>
        </div>
      </form>

      {session !== null && session.notice !== null && (
        <Alert message={session.notice} tone="info" />
      )}
      {session !== null && session.error !== null && (
        <Alert message={session.error} tone="error" />
      )}

      {session === null ? (
        <Panes
          format={format}
          issues={[]}
          log={[]}
          phase="idle"
          state=""
          view={
            <EmptyState
              description="頼みごとを書いて「Claude に作らせる」を押すと、ここに描かれます。"
              title="まだ何も作っていません"
            />
          }
        />
      ) : (
        <Result key={session.id} onReport={respond} session={session} />
      )}
    </Stack>
  );
}
