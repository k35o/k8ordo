import { MessageProcessor } from '@a2ui/web_core';
import type { SurfaceModel } from '@a2ui/web_core';
import { createSpecStreamCompiler, isNonEmptySpec } from '@json-render/core';
import type { Spec } from '@json-render/core';
import {
  Renderer as JsonRenderRenderer,
  useStateStore,
} from '@json-render/react';
import { mergeStatements } from '@openuidev/lang-core';
import { Renderer as OpenUiRenderer } from '@openuidev/react-lang';
import type { OpenUIError } from '@openuidev/react-lang';
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { RefObject } from 'react';

import { A2uiSurfaces, a2uiCatalog } from '../a2ui/renderer';
import { TO_ASSISTANT, validateGeneratedSpec } from '../json-render/catalog';
import { JsonRenderProvider, registry } from '../json-render/registry';
import { library } from '../openui/library';
import { Panes } from './panes';
import type { LogEntry, Phase } from './panes';
import type { Format, Turn } from './request';

type Base = {
  id: number;
  turns: readonly Turn[];
  reply: string;
  isStreaming: boolean;
  error: string | null;
  notice: string | null;
};

export type Session = Base &
  (
    | { format: 'a2ui'; processor: MessageProcessor; issues: readonly string[] }
    | { format: 'json-render' | 'openui' }
  );

export type Report = (action: unknown, state: unknown) => void;

let sessions = 0;

export const startSession = (format: Format, prompt: string): Session => {
  sessions += 1;
  const base: Base = {
    id: sessions,
    turns: [{ role: 'user', content: prompt }],
    reply: '',
    isStreaming: true,
    error: null,
    notice: null,
  };
  return format === 'a2ui'
    ? {
        ...base,
        format,
        processor: new MessageProcessor([a2uiCatalog]),
        issues: [],
      }
    : { ...base, format };
};

export const withA2uiLines = (session: Session, lines: string[]): Session => {
  if (session.format !== 'a2ui' || lines.length === 0) {
    return session;
  }
  const issues = lines.flatMap((line) => {
    let message: unknown;
    try {
      message = JSON.parse(line);
    } catch {
      return [`JSON として読めない行: ${line.slice(0, 80)}`];
    }
    return session.processor
      .processMessagesWithErrors(message)
      .map(({ error }) => `${error.code}: ${error.message}`);
  });
  return { ...session, issues: [...session.issues, ...issues] };
};

const repliesOf = (session: Session): string[] => [
  ...session.turns
    .filter((turn) => turn.role === 'assistant')
    .map((turn) => turn.content),
  session.reply,
];

const logOf = (session: Session): LogEntry[] => [
  ...session.turns.map((turn, index) => ({
    label:
      turn.role === 'assistant'
        ? 'Claude'
        : index === 0
          ? '頼みごと'
          : '返した操作',
    text: turn.content,
  })),
  ...(session.reply === ''
    ? []
    : [
        {
          label: session.isStreaming ? 'Claude（書いています）' : 'Claude',
          text: session.reply,
        },
      ]),
];

const phaseOf = (session: Session): Phase =>
  session.isStreaming ? 'streaming' : 'done';

const show = (value: unknown): string => JSON.stringify(value, null, 2);

const dataModelsOf = (processor: MessageProcessor): Record<string, unknown> =>
  Object.fromEntries(
    [...processor.model.surfacesMap].map(([id, surface]) => [
      id,
      surface.dataModel.get('/') ?? {},
    ]),
  );

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
  return useSyncExternalStore(subscribe, () => show(dataModelsOf(processor)));
};

function A2uiResult({
  session,
  onReport,
}: {
  session: Extract<Session, { format: 'a2ui' }>;
  onReport: Report;
}) {
  const { processor } = session;
  const state = useDataModels(processor);
  const report = useEffectEvent((action: unknown) => {
    onReport(action, dataModelsOf(processor));
  });
  useEffect(() => {
    const subscription = processor.model.onAction.subscribe((payload) => {
      report({
        name: payload.name,
        sourceComponentId: payload.sourceComponentId,
        context: payload.context,
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [processor]);

  return (
    <Panes
      format="a2ui"
      issues={session.issues}
      log={logOf(session)}
      phase={phaseOf(session)}
      state={state}
      view={<A2uiSurfaces processor={processor} />}
    />
  );
}

function JsonRenderPanes({
  session,
  spec,
  stateRef,
}: {
  session: Session;
  spec: Spec | null;
  stateRef: RefObject<unknown>;
}) {
  const { state } = useStateStore();
  useEffect(() => {
    stateRef.current = state;
  }, [state, stateRef]);
  const issues = useMemo(() => {
    if (session.isStreaming) {
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
  }, [spec, session.isStreaming]);

  return (
    <Panes
      format="json-render"
      issues={issues}
      log={logOf(session)}
      phase={phaseOf(session)}
      state={show(state)}
      view={
        <JsonRenderRenderer
          loading={session.isStreaming}
          registry={registry}
          spec={spec}
        />
      }
    />
  );
}

function JsonRenderResult({
  session,
  onReport,
}: {
  session: Session;
  onReport: Report;
}) {
  const source = repliesOf(session).join('\n');
  const spec = useMemo(() => {
    const compiler = createSpecStreamCompiler<Spec>();
    compiler.push(source);
    const result = compiler.getResult();
    return isNonEmptySpec(result) ? result : null;
  }, [source]);
  const stateRef = useRef<unknown>({});

  return (
    <JsonRenderProvider
      onToAssistant={(params) => {
        onReport({ action: TO_ASSISTANT, params }, stateRef.current);
      }}
      spec={spec}
    >
      <JsonRenderPanes session={session} spec={spec} stateRef={stateRef} />
    </JsonRenderProvider>
  );
}

const mergedProgramOf = (replies: readonly string[]): string =>
  replies.reduce(
    (program, reply) =>
      reply.trim() === ''
        ? program
        : program === ''
          ? reply
          : mergeStatements(program, reply),
    '',
  );

function OpenUiResult({
  session,
  onReport,
}: {
  session: Session;
  onReport: Report;
}) {
  const [state, setState] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<readonly OpenUIError[]>([]);
  const program = mergedProgramOf(repliesOf(session));
  const issues = session.isStreaming
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
      log={logOf(session)}
      phase={phaseOf(session)}
      state={show(state)}
      view={
        <OpenUiRenderer
          isStreaming={session.isStreaming}
          library={library}
          onAction={(event) => {
            onReport(
              {
                type: event.type,
                params: event.params,
                humanFriendlyMessage: event.humanFriendlyMessage,
              },
              event.formState ?? state,
            );
          }}
          onError={setErrors}
          onStateUpdate={setState}
          response={program}
        />
      }
    />
  );
}

export function Result({
  session,
  onReport,
}: {
  session: Session;
  onReport: Report;
}) {
  switch (session.format) {
    case 'a2ui':
      return <A2uiResult onReport={onReport} session={session} />;
    case 'json-render':
      return <JsonRenderResult onReport={onReport} session={session} />;
    case 'openui':
      return <OpenUiResult onReport={onReport} session={session} />;
  }
}
