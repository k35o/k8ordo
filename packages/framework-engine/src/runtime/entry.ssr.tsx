import {
  createFromReadableStream,
  getClientEntryUrl,
} from '@vitejs/plugin-rsc/ssr';
import { renderToReadableStream } from 'react-dom/server.edge';

import { AppRouter } from './app-router';
import type { Payload } from './payload';

type SsrOptions = NonNullable<Parameters<typeof renderToReadableStream>[1]>;

/**
 * The payload turned into HTML. The tree is wrapped in the client router
 * here and in exactly the same way in the browser entry, so what hydration
 * finds is what the server wrote.
 */
export async function renderHtml(
  rscStream: ReadableStream<Uint8Array>,
): Promise<ReadableStream> {
  const payload = await createFromReadableStream<Payload>(rscStream);
  return renderToReadableStream(<AppRouter tree={payload.tree} />, {
    bootstrapModules: [getClientEntryUrl()],
    // Present only when a form was posted without JavaScript: it is how
    // `useActionState` finds its result in the HTML it comes back to.
    formState: payload.formState as SsrOptions['formState'],
  });
}
