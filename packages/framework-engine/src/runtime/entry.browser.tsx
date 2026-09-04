import { createFromReadableStream } from '@vitejs/plugin-rsc/browser';
import { hydrateRoot } from 'react-dom/client';
import { rscStream } from 'rsc-html-stream/client';

import { AppRouter } from './app-router';
import type { Payload } from './payload';

// The payload the HTML was rendered from, written into that HTML by the SSR
// entry. Reading it here rather than fetching it again is what makes
// hydration see exactly what the server saw — and what lets a page the
// application does not have (its prerendered 404) hydrate at all.
const payload = await createFromReadableStream<Payload>(
  rscStream as ReadableStream<Uint8Array>,
);
type HydrateOptions = NonNullable<Parameters<typeof hydrateRoot>[2]>;

// Present only when a form was posted without JavaScript. Hydration has to be
// told, or React discards the result the page came back with and the message
// the visitor is reading disappears the moment the script loads.
hydrateRoot(document, <AppRouter tree={payload.tree} />, {
  formState: payload.formState as HydrateOptions['formState'],
});
