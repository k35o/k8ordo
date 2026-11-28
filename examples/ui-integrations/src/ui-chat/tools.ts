import { tool } from 'ai';

import {
  catalogLines,
  screenInput,
  screenIssues,
  screenRules,
} from '../a2ui/screen';
import type { ScreenStep } from '../a2ui/screen';
import { SHOW_UI, UPDATE_UI, updateInput } from './screens';

const showDescription = [
  'Shows the user an interactive screen in the conversation, drawn with @k8ordo/ui, a React design system. Use it whenever a form, a table, a choice, or other UI helps the user more than prose. Returns the id of the screen, which update_ui takes.',
  '',
  ...screenRules,
  '- Give every event a userMessage as well: what the user did, as a short sentence in their language, the way they would say it, such as "この内容で登録します". The chat shows it as the user\'s message.',
  '',
  'When the user acts, you receive a user message with the screen, the event, its context, and the whole data model.',
  '',
  ...catalogLines,
].join('\n');

const updateDescription =
  'Changes a screen you showed with show_ui, in place: to confirm what the user sent on it, to show the next step, or to correct it. Write only what changes, with the components and rules of show_ui. What the user entered on the screen stays.';

const refuse = (issues: readonly string[]): never => {
  throw new Error(
    [
      'The screen breaks the A2UI catalog. Fix these and call again:',
      ...issues,
    ].join('\n'),
  );
};

/**
 * The tools that show screens in the chat and change them in place, each
 * call checked on top of the screens `before` built. A call that passes joins
 * them, so a later call in the same answer is checked on top of it too.
 */
export const screenTools = (before: readonly ScreenStep[]) => {
  const steps = [...before];
  const take = (step: ScreenStep) => {
    const issues = screenIssues(step, steps);
    if (issues.length > 0) {
      refuse(issues);
    }
    steps.push(step);
    return { screen: step.screen };
  };

  return {
    [SHOW_UI]: tool({
      description: showDescription,
      inputSchema: screenInput,
      execute: (input, { toolCallId }) =>
        take({ kind: 'show', screen: toolCallId, input }),
    }),
    [UPDATE_UI]: tool({
      description: updateDescription,
      inputSchema: updateInput,
      execute: ({ screen, ...input }) =>
        take({ kind: 'update', screen, input }),
    }),
  };
};
