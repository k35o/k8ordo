import { MessageProcessor } from '@a2ui/web_core';
import { createSpecStreamCompiler, isNonEmptySpec } from '@json-render/core';
import type { Spec } from '@json-render/core';
import {
  Alert,
  Button,
  FormControl,
  Select,
  Stack,
  Textarea,
} from '@k8ordo/ui';
import { Renderer } from '@openuidev/react-lang';
import { useMemo, useState, useTransition } from 'react';
import type { SubmitEvent } from 'react';

import { A2uiSurfaces, a2uiCatalog } from '../a2ui/renderer';
import { validateGeneratedSpec } from '../json-render/catalog';
import { JsonRenderUI } from '../json-render/registry';
import { library } from '../openui/library';
import { createLineBuffer } from './lines';
import { FORMATS } from './request';
import type { Format } from './request';
import { generate } from './stream';

const FORMAT_LABELS = {
  a2ui: 'A2UI 1.0',
  'json-render': 'json-render',
  openui: 'OpenUI',
} as const satisfies Record<Format, string>;

type Processor = MessageProcessor;

type Output = {
  format: Format;
  text: string;
  isStreaming: boolean;
  error: string | null;
  notice: string | null;
  processor: Processor | null;
  issues: string[];
};

const startOutput = (format: Format, notice: string | null): Output => ({
  format,
  text: '',
  isStreaming: true,
  error: null,
  notice,
  processor: format === 'a2ui' ? new MessageProcessor([a2uiCatalog]) : null,
  issues: [],
});

const a2uiIssuesOf = (processor: Processor, lines: string[]): string[] =>
  lines.flatMap((line) => {
    let message: unknown;
    try {
      message = JSON.parse(line);
    } catch {
      return [`JSON として読めない行: ${line.slice(0, 80)}`];
    }
    return processor
      .processMessagesWithErrors(message)
      .map(({ error }) => `${error.code}: ${error.message}`);
  });

function JsonRenderPreview({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const spec = useMemo(() => {
    const compiler = createSpecStreamCompiler<Spec>();
    compiler.push(text);
    const result = compiler.getResult();
    return isNonEmptySpec(result) ? result : null;
  }, [text]);
  const result = useMemo(
    () => (spec === null || isStreaming ? null : validateGeneratedSpec(spec)),
    [spec, isStreaming],
  );

  return (
    <Stack direction="column" gap="md">
      {result?.ok === false && (
        <Alert
          message={result.issues.map((issue) =>
            issue.elementKey === undefined
              ? issue.message
              : `[${issue.elementKey}] ${issue.message}`,
          )}
          tone="warning"
        />
      )}
      <JsonRenderUI loading={isStreaming} spec={spec} />
    </Stack>
  );
}

function Preview({ output }: { output: Output }) {
  switch (output.format) {
    case 'a2ui':
      return output.processor === null ? null : (
        <A2uiSurfaces processor={output.processor} />
      );
    case 'json-render':
      return (
        <JsonRenderPreview
          isStreaming={output.isStreaming}
          text={output.text}
        />
      );
    case 'openui':
      return (
        <Renderer
          isStreaming={output.isStreaming}
          library={library}
          response={output.text}
        />
      );
  }
}

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
      const update = (next: Partial<Output>) => {
        current = { ...current, ...next };
        setOutput(current);
      };
      setOutput(current);

      for await (const streamed of generate(format, prompt)) {
        switch (streamed.type) {
          case 'text': {
            const issues =
              current.processor === null
                ? []
                : a2uiIssuesOf(current.processor, lines.push(streamed.text));
            update({
              text: current.text + streamed.text,
              issues: [...current.issues, ...issues],
            });
            break;
          }
          case 'restart':
            current = startOutput(
              format,
              `${streamed.model} が最初から生成し直しています。`,
            );
            lines = createLineBuffer();
            setOutput(current);
            break;
          case 'done': {
            const issues =
              current.processor === null
                ? []
                : a2uiIssuesOf(current.processor, lines.flush());
            update({
              isStreaming: false,
              issues: [...current.issues, ...issues],
            });
            break;
          }
          case 'error':
            update({ isStreaming: false, error: streamed.message });
            break;
        }
      }
    });
  };

  return (
    <Stack direction="column" gap="lg">
      <form onSubmit={run}>
        <Stack direction="column" gap="md">
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
          <Button disabled={isPending} type="submit" variant="solid">
            Claude に作らせる
          </Button>
        </Stack>
      </form>

      {output !== null && (
        <Stack direction="column" gap="md">
          {output.notice !== null && (
            <Alert message={output.notice} tone="info" />
          )}
          {output.error !== null && (
            <Alert message={output.error} tone="error" />
          )}
          {output.issues.length > 0 && (
            <Alert message={output.issues} tone="warning" />
          )}
          <Preview output={output} />
          <details>
            <summary className="text-fg-mute cursor-pointer text-sm">
              モデルの出力
            </summary>
            <pre className="text-fg-mute max-h-64 overflow-auto text-xs whitespace-pre-wrap">
              {output.text}
            </pre>
          </details>
        </Stack>
      )}
    </Stack>
  );
}
