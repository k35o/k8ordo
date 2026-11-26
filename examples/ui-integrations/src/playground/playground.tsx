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
import { Result, startOutput, withA2uiLines } from './results';
import type { Output } from './results';
import { generate } from './stream';

const FORMAT_LABELS = {
  a2ui: 'A2UI 1.0',
  'json-render': 'json-render',
  openui: 'OpenUI',
} as const satisfies Record<Format, string>;

export function Playground() {
  const [format, setFormat] = useState<Format>('a2ui');
  const [prompt, setPrompt] = useState(
    '会員登録のフォームを作って。名前、メールアドレス、プラン（無料とプロ）、規約への同意を入れて。',
  );
  const [output, setOutput] = useState<Output | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      let current = startOutput(format, null);
      let lines = createLineBuffer();
      const show = (next: Output) => {
        current = next;
        setOutput(next);
      };
      show(current);

      for await (const streamed of generate(format, prompt)) {
        switch (streamed.type) {
          case 'text':
            show(
              withA2uiLines(
                { ...current, text: current.text + streamed.text },
                lines.push(streamed.text),
              ),
            );
            break;
          case 'restart':
            lines = createLineBuffer();
            show(
              startOutput(
                format,
                `${streamed.model} が最初から生成し直しています。`,
              ),
            );
            break;
          case 'done':
            show(
              withA2uiLines({ ...current, isStreaming: false }, lines.flush()),
            );
            break;
          case 'error':
            show({ ...current, isStreaming: false, error: streamed.message });
            break;
        }
      }
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

      {output !== null && output.notice !== null && (
        <Alert message={output.notice} tone="info" />
      )}
      {output !== null && output.error !== null && (
        <Alert message={output.error} tone="error" />
      )}

      {output === null ? (
        <Panes
          format={format}
          issues={[]}
          phase="idle"
          state=""
          text=""
          view={
            <EmptyState
              description="頼みごとを書いて「Claude に作らせる」を押すと、ここに描かれます。"
              title="まだ何も作っていません"
            />
          }
        />
      ) : (
        <Result key={output.id} output={output} />
      )}
    </Stack>
  );
}
