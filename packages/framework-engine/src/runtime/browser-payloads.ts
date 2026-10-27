import {
  createFromFetch,
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from '@vitejs/plugin-rsc/browser';

import {
  answerAction,
  navigationsApplied,
  setPayloadReader,
} from './app-router';
import { ACTION_ID_HEADER } from './payload';
import type { Payload } from './payload';

/**
 * Hands app-router the browser's Flight client: how a fetched payload is
 * read, and where a Server Action is sent. Called by the browser entry
 * before anything renders.
 */
export const connectAppRouter = (): void => {
  setPayloadReader((stream) => createFromReadableStream<Payload>(stream));
  setServerCallback(async (id: string, args: unknown[]) => {
    const sent = navigationsApplied();
    const temporaryReferences = createTemporaryReferenceSet();
    const payload = await createFromFetch<Payload>(
      fetch(location.href, {
        method: 'POST',
        headers: { [ACTION_ID_HEADER]: id },
        body: await encodeReply(args, { temporaryReferences }),
      }),
      { temporaryReferences },
    );
    return answerAction(payload, sent);
  });
};
