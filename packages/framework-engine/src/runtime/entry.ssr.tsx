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
 * The script every page's HTML loads, and so the client every payload is
 * rendered for. Exported for the RSC entry, which renders the payloads:
 * the RSC plugin names the client entry to this environment only.
 */
export const clientEntry = getClientEntryUrl();

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
  const toFile = import.meta.env.K8ORDO_MODE === '@k8ordo/static';
  const htmlStream = await renderToReadableStream(
    <AppRouter
      pathname={payload.pathname}
      search={payload.search}
      tree={payload.tree}
    />,
    {
      bootstrapModules: [clientEntry],
      // Present only when a form was posted without JavaScript: it is how
      // `useActionState` finds its result in the HTML it comes back to.
      formState: payload.formState as SsrOptions['formState'],
      // React outlines a large boundary even once it is complete — a hidden
      // copy plus a script that moves it in, so a stream can paint what came
      // before it. A file arrives whole, and the move is deferred to an
      // animation frame, which hydration can beat: a context that changes
      // as it hydrates then renders the boundary again beside the hidden
      // copy, with a second `<title>`. Nothing is outlined into a file.
      progressiveChunkSize: toFile ? Number.POSITIVE_INFINITY : undefined,
    },
  );
  // Reading only once every boundary has completed writes each in place;
  // one still pending when the shell is read is outlined whatever its size.
  if (toFile) await htmlStream.allReady;
  return htmlStream.pipeThrough(injectRSCPayload(forHydration));
}
