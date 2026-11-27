import { getToolName, isToolUIPart } from 'ai';
import type { DataUIPart, TextPart, UIDataTypes, UIMessage } from 'ai';
import { z } from 'zod';

import { screenInput, screenUpdate } from '../a2ui/screen';
import type { ScreenStep } from '../a2ui/screen';

export const SHOW_UI = 'show_ui';
export const UPDATE_UI = 'update_ui';

export const updateInput = screenUpdate.extend({
  screen: z.string().describe('The id show_ui returned for the screen.'),
});

/** What the user did on a screen: the data of the `data-action` part of their message. */
export const screenAction = z.object({
  screen: z.string(),
  name: z.string(),
  sourceComponentId: z.string(),
  context: z.record(z.string(), z.unknown()),
  /** What the chat shows as the user's message. */
  text: z.string(),
  /** The data model of the screen when the user acted. */
  state: z.unknown(),
});

export type ScreenAction = z.infer<typeof screenAction>;

export type UiChatMessage = UIMessage<never, { action: ScreenAction }>;

/** The screen a `show_ui` or `update_ui` call carries out, or null for another tool or an input that does not parse. */
export const stepOf = (
  name: string,
  toolCallId: string,
  input: unknown,
): ScreenStep | null => {
  if (name === SHOW_UI) {
    const parsed = screenInput.safeParse(input);
    return parsed.success
      ? { kind: 'show', screen: toolCallId, input: parsed.data }
      : null;
  }
  if (name === UPDATE_UI) {
    const parsed = updateInput.safeParse(input);
    if (!parsed.success) {
      return null;
    }
    const { screen, ...update } = parsed.data;
    return { kind: 'update', screen, input: update };
  }
  return null;
};

/** The screen calls of a conversation the server took, in order. */
export const stepsOf = (messages: readonly UIMessage[]): ScreenStep[] =>
  messages.flatMap(({ parts }) =>
    parts.flatMap((part) => {
      if (!isToolUIPart(part) || part.state !== 'output-available') {
        return [];
      }
      const step = stepOf(getToolName(part), part.toolCallId, part.input);
      return step === null ? [] : [step];
    }),
  );

export const reportOf = (action: ScreenAction): string =>
  [
    `The user acted on the screen ${action.screen}.`,
    `Action: ${JSON.stringify({
      name: action.name,
      sourceComponentId: action.sourceComponentId,
      context: action.context,
    })}`,
    `State of the screen now: ${JSON.stringify(action.state)}`,
  ].join('\n');

/** Turns the `data-action` part of a user message into the report the model reads. */
export const modelPartOf = (
  part: DataUIPart<UIDataTypes>,
): TextPart | undefined => {
  if (part.type !== 'data-action') {
    return undefined;
  }
  const parsed = screenAction.safeParse(part.data);
  return parsed.success
    ? { type: 'text', text: reportOf(parsed.data) }
    : undefined;
};

/** What each screen holds now, for the request's `modelContext`. */
export const contextOf = (dataModels: Readonly<Record<string, unknown>>) =>
  Object.entries(dataModels).map(
    ([screen, dataModel]) => `Screen ${screen}: ${JSON.stringify(dataModel)}`,
  );
