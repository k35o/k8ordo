import { MessageProcessor } from '@a2ui/web_core';
import type { ActionPayload } from '@a2ui/web_core';
import { getToolName, isToolUIPart } from 'ai';
import type { UIMessage } from 'ai';

import { a2uiCatalog } from '../a2ui/renderer';
import { screenMessages } from '../a2ui/screen';
import type { ScreenInput } from '../a2ui/screen';
import { SHOW_UI, stepOf, UPDATE_UI } from './screens';
import type { ScreenAction } from './screens';

/**
 * The screens of a chat, drawn as the surfaces of one A2UI processor.
 * `sync` carries out the `show_ui` and `update_ui` calls of the messages it
 * has not carried out yet: a screen appears while its call streams in, one
 * component at a time, and a call the server refused takes its screen away.
 */
export type Board = {
  processor: MessageProcessor;
  sync: (messages: readonly UIMessage[]) => void;
  /** What each screen holds now, by its id. */
  dataModels: () => Record<string, unknown>;
  /** What the user did, as the data of the `data-action` part to send. */
  actionOf: (payload: ActionPayload) => ScreenAction;
};

type Progress = { components: number; isDone: boolean };

const isComponent = (value: unknown): value is ScreenInput['components'][0] =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>).id === 'string' &&
  typeof (value as Record<string, unknown>).component === 'string';

// 流れてくる途中の入力は、最後の部品がまだ書きかけかもしれない。次の部品が
// 始まった部品だけを、書き終えたものとして描く
const writtenComponentsOf = (input: unknown): ScreenInput['components'] => {
  const components =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>).components
      : undefined;
  return Array.isArray(components)
    ? components.slice(0, -1).filter(isComponent)
    : [];
};

export const createBoard = (): Board => {
  const processor = new MessageProcessor([a2uiCatalog]);
  const progress = new Map<string, Progress>();
  const run = (messages: readonly unknown[]) => {
    for (const message of messages) {
      processor.processMessagesWithErrors(message);
    }
  };

  const syncShow = (screen: string, state: string, input: unknown) => {
    const seen = progress.get(screen);
    if (seen?.isDone === true) {
      return;
    }
    const step =
      state === 'output-available' ? stepOf(SHOW_UI, screen, input) : null;
    if (
      state === 'output-error' ||
      (state === 'output-available' && step?.kind !== 'show')
    ) {
      if (seen !== undefined) {
        run([{ version: '1.0', deleteSurface: { surfaceId: screen } }]);
      }
      progress.set(screen, { components: 0, isDone: true });
      return;
    }
    const isDone = step?.kind === 'show';
    const components = isDone
      ? step.input.components
      : writtenComponentsOf(input);
    if (seen === undefined) {
      if (components.length === 0 && !isDone) {
        return;
      }
      run(
        screenMessages({
          kind: 'show',
          screen,
          input: { components, dataModel: isDone ? step.input.dataModel : {} },
        }),
      );
    } else {
      const added = components.slice(seen.components);
      run(
        screenMessages({
          kind: 'update',
          screen,
          input: {
            components: added.length === 0 ? undefined : added,
            values: isDone ? { '/': step.input.dataModel ?? {} } : undefined,
          },
        }),
      );
    }
    progress.set(screen, { components: components.length, isDone });
  };

  const syncUpdate = (toolCallId: string, input: unknown) => {
    if (progress.has(toolCallId)) {
      return;
    }
    const step = stepOf(UPDATE_UI, toolCallId, input);
    if (step !== null) {
      run(screenMessages(step));
    }
    progress.set(toolCallId, { components: 0, isDone: true });
  };

  return {
    processor,
    sync: (messages) => {
      for (const part of messages.flatMap(({ parts }) => parts)) {
        if (!isToolUIPart(part)) {
          continue;
        }
        const name = getToolName(part);
        if (name === SHOW_UI) {
          syncShow(part.toolCallId, part.state, part.input);
        } else if (name === UPDATE_UI && part.state === 'output-available') {
          syncUpdate(part.toolCallId, part.input);
        }
      }
    },
    dataModels: () =>
      Object.fromEntries(
        [...processor.model.surfacesMap].map(([id, surface]) => [
          id,
          surface.dataModel.get('/') ?? {},
        ]),
      ),
    actionOf: (payload) => {
      const surface = processor.model.surfacesMap.get(payload.surfaceId);
      const label = surface?.componentsModel.get(payload.sourceComponentId)
        ?.properties.label as unknown;
      return {
        screen: payload.surfaceId,
        name: payload.name,
        sourceComponentId: payload.sourceComponentId,
        context: payload.context,
        text:
          payload.userMessage ??
          (typeof label === 'string'
            ? `「${label}」を押しました`
            : `${payload.name} を送りました`),
        state: surface?.dataModel.get('/') ?? {},
      };
    },
  };
};
