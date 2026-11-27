import {
  catalogLines,
  screenIssues,
  screenMessages,
  screenRules,
} from '../a2ui/screen.ts';
import type { ScreenInput } from '../a2ui/screen.ts';

export const SHOW_UI = 'show_ui';
export const APP_URI = 'ui://k8ordo/a2ui.html';

const SURFACE = 'main';

export const showUiDescription = [
  'Shows the user an interactive screen in the conversation, drawn with @k8ordo/ui, a React design system. Use it whenever a form, a table, a choice, or other UI helps the user more than prose.',
  '',
  ...screenRules,
  '',
  'When the user acts, you receive a user message with the event, its context, and the whole data model. Answer it in prose, and call show_ui again when the next step needs a screen of its own. Each call shows a new screen; it does not change the one before.',
  '',
  ...catalogLines,
].join('\n');

export const messagesOf = (input: ScreenInput) =>
  screenMessages({ kind: 'show', screen: SURFACE, input });

/** What A2UI refuses in a `show_ui` call, checked against the catalog's schemas only. */
export const issuesOf = (input: ScreenInput): string[] =>
  screenIssues({ kind: 'show', screen: SURFACE, input });

export const reportOf = (action: unknown, dataModel: unknown): string =>
  [
    'The user acted on the screen.',
    `Action: ${JSON.stringify(action)}`,
    `State of the screen now: ${JSON.stringify(dataModel)}`,
  ].join('\n');

export const stateOf = (dataModel: unknown): string =>
  `State of the screen now: ${JSON.stringify(dataModel)}`;
