import type { IncomingMessage, ServerResponse } from 'node:http';

import { answerWithClaude, parseChatRequest } from '../ai-sdk/endpoint';
import { readJson } from '../read-json';
import { modelPartOf, stepsOf } from './screens';
import { screenTools } from './tools';

const INSTRUCTIONS = [
  'You are the assistant of a chat that can show the user screens built with @k8ordo/ui. Answer in the language the user writes in.',
  'When a screen helps the user more than prose, such as a form to fill in, a table to compare, or a choice to make, call show_ui instead of describing the screen. Keep the prose around a screen short.',
  'A user message that begins with "The user acted on the screen" reports what the user did on a screen you showed: the screen, the event, its context, and the state of the screen.',
  'To answer what the user did on a screen, change that screen with update_ui, such as to confirm what they sent or to show the next step on it, rather than showing a new one. Show a new screen only for something new.',
  'What the user enters on a screen also reaches you with their next message, so a screen needs a button only for the user to act, not for you to read a field.',
];

/**
 * `POST /api/ui-chat` on the dev server: answers an AI SDK chat with Claude,
 * which shows screens with `show_ui` and changes them with `update_ui`. Each
 * call is checked on top of the screens the conversation built, and a call
 * that breaks the catalog goes back to Claude as a tool error to fix.
 */
export const handleUiChat = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  const parsed = parseChatRequest(request.headers, await readJson(request));
  if ('status' in parsed) {
    response.statusCode = parsed.status;
    response.end(parsed.message);
    return;
  }

  await answerWithClaude({
    response,
    request: parsed,
    instructions: INSTRUCTIONS,
    tools: screenTools(stepsOf(parsed.messages)),
    convertDataPart: modelPartOf,
  });
};
