import {
  createFromReadableStream,
  getClientEntryUrl,
} from '@vitejs/plugin-rsc/ssr';
import { renderToReadableStream } from 'react-dom/server.edge';
import { injectRSCPayload } from 'rsc-html-stream/server';

import { AppRouter } from './app-router';
import type { Payload } from './payload';

type SsrOptions = NonNullable<Parameters<typeof renderToReadableStream>[1]>;

/**
 * The payload turned into HTML, with the payload itself written into that
 * HTML. Hydration then reads what this render read, rather than asking the
 * server to render the page a second time: one render, one source of truth,
 * one round trip. It is also what lets a prerendered `404.html` come alive —
 * there is no payload file at a URL the application does not have.
 */
export async function renderHtml(
  rscStream: ReadableStream<Uint8Array>,
): Promise<ReadableStream> {
  const [forHtml, forHydration] = rscStream.tee();
  const payload = await createFromReadableStream<Payload>(forHtml);
  const htmlStream = await renderToReadableStream(
    <AppRouter tree={payload.tree} />,
    {
      bootstrapModules: [getClientEntryUrl()],
      // Present only when a form was posted without JavaScript: it is how
      // `useActionState` finds its result in the HTML it comes back to.
      formState: payload.formState as SsrOptions['formState'],
    },
  );
  return htmlStream.pipeThrough(injectRSCPayload(forHydration));
}
