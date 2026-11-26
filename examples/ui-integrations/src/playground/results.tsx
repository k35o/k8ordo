import { MessageProcessor } from '@a2ui/web_core';
import type { SurfaceModel } from '@a2ui/web_core';
import { createSpecStreamCompiler, isNonEmptySpec } from '@json-render/core';
import type { Spec } from '@json-render/core';
import {
  Renderer as JsonRenderRenderer,
  useStateStore,
} from '@json-render/react';
import { Renderer as OpenUiRenderer } from '@openuidev/react-lang';
import type { OpenUIError } from '@openuidev/react-lang';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

import { A2uiSurfaces, a2uiCatalog } from '../a2ui/renderer';
import { validateGeneratedSpec } from '../json-render/catalog';
import { JsonRenderProvider, registry } from '../json-render/registry';
import { library } from '../openui/library';
import { Panes } from './panes';
import type { Phase } from './panes';
import type { Format } from './request';

type Stream = {
  id: number;
  text: string;
  isStreaming: boolean;
  error: string | null;
  notice: string | null;
};

export type Output = Stream &
  (
    | { format: 'a2ui'; processor: MessageProcessor; issues: readonly string[] }
    | { format: 'json-render' | 'openui' }
  );

let generations = 0;

export const startOutput = (format: Format, notice: string | null): Output => {
  generations += 1;
  const stream = {
    id: generations,
    text: '',
    isStreaming: true,
    error: null,
    notice,
  };
  return format === 'a2ui'
    ? {
        ...stream,
        format,
        processor: new MessageProcessor([a2uiCatalog]),
        issues: [],
      }
    : { ...stream, format };
};

export const withA2uiLines = (output: Output, lines: string[]): Output => {
  if (output.format !== 'a2ui' || lines.length === 0) {
    return output;
  }
  const issues = lines.flatMap((line) => {
    let message: unknown;
    try {
      message = JSON.parse(line);
    } catch {
      return [`JSON として読めない行: ${line.slice(0, 80)}`];
    }
    return output.processor
      .processMessagesWithErrors(message)
      .map(({ error }) => `${error.code}: ${error.message}`);
  });
  return { ...output, issues: [...output.issues, ...issues] };
};

const phaseOf = (output: Output): Phase =>
  output.isStreaming ? 'streaming' : 'done';

const show = (value: unknown): string => JSON.stringify(value, null, 2);

const useDataModels = (processor: MessageProcessor): string => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const watched = new Map<string, { unsubscribe: () => void }>();
      const watch = (surface: SurfaceModel) => {
        watched.set(surface.id, surface.dataModel.subscribe('/', onChange));
      };
      for (const surface of processor.model.surfacesMap.values()) {
        watch(surface);
      }
      const created = processor.onSurfaceCreated((surface) => {
        watch(surface);
        onChange();
      });
      const deleted = processor.onSurfaceDeleted((id) => {
        watched.get(id)?.unsubscribe();
        watched.delete(id);
        onChange();
      });
      return () => {
        created.unsubscribe();
        deleted.unsubscribe();
        for (const subscription of watched.values()) {
          subscription.unsubscribe();
        }
      };
    },
    [processor],
  );
  return useSyncExternalStore(subscribe, () =>
    show(
      Object.fromEntries(
        [...processor.model.surfacesMap].map(([id, surface]) => [
          id,
          surface.dataModel.get('/') ?? {},
        ]),
      ),
    ),
  );
};

function A2uiResult({
  output,
}: {
  output: Extract<Output, { format: 'a2ui' }>;
}) {
  const state = useDataModels(output.processor);
  return (
    <Panes
      format="a2ui"
      issues={output.issues}
      phase={phaseOf(output)}
      state={state}
      text={output.text}
      view={<A2uiSurfaces processor={output.processor} />}
    />
  );
}

function JsonRenderPanes({
  output,
  spec,
}: {
  output: Output;
  spec: Spec | null;
}) {
  const { state } = useStateStore();
  const issues = useMemo(() => {
    if (output.isStreaming) {
      return [];
    }
    if (spec === null) {
      return ['spec を組み立てられる行がありません。'];
    }
    const result = validateGeneratedSpec(spec);
    return result.ok
      ? []
      : result.issues.map((issue) =>
          issue.elementKey === undefined
            ? issue.message
            : `[${issue.elementKey}] ${issue.message}`,
        );
  }, [spec, output.isStreaming]);

  return (
    <Panes
      format="json-render"
      issues={issues}
      phase={phaseOf(output)}
      state={show(state)}
      text={output.text}
      view={
        <JsonRenderRenderer
          loading={output.isStreaming}
          registry={registry}
          spec={spec}
        />
      }
    />
  );
}

function JsonRenderResult({ output }: { output: Output }) {
  const spec = useMemo(() => {
    const compiler = createSpecStreamCompiler<Spec>();
    compiler.push(output.text);
    const result = compiler.getResult();
    return isNonEmptySpec(result) ? result : null;
  }, [output.text]);

  return (
    <JsonRenderProvider spec={spec}>
      <JsonRenderPanes output={output} spec={spec} />
    </JsonRenderProvider>
  );
}

function OpenUiResult({ output }: { output: Output }) {
  const [state, setState] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<readonly OpenUIError[]>([]);
  const issues = output.isStreaming
    ? []
    : errors.map((error) =>
        error.statementId === undefined
          ? error.message
          : `[${error.statementId}] ${error.message}`,
      );

  return (
    <Panes
      format="openui"
      issues={issues}
      phase={phaseOf(output)}
      state={show(state)}
      text={output.text}
      view={
        <OpenUiRenderer
          isStreaming={output.isStreaming}
          library={library}
          onError={setErrors}
          onStateUpdate={setState}
          response={output.text}
        />
      }
    />
  );
}

export function Result({ output }: { output: Output }) {
  switch (output.format) {
    case 'a2ui':
      return <A2uiResult output={output} />;
    case 'json-render':
      return <JsonRenderResult output={output} />;
    case 'openui':
      return <OpenUiResult output={output} />;
  }
}
