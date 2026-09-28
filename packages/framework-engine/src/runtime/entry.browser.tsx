import { createFromReadableStream } from '@vitejs/plugin-rsc/browser';
import { rscStream } from 'rsc-html-stream/client';

import { AppRouter, setDocumentClient } from './app-router';
import { mount } from './mount';
import type { HydrateOptions } from './mount';
import type { Payload } from './payload';
import { whenRevealed } from './revealed';

// The payload the HTML was rendered from, written into that HTML by the SSR
// entry. Reading it here rather than fetching it again is what makes
// hydration see exactly what the server saw — and what lets a page the
// application does not have (its prerendered 404) come alive at all.
const payload = await createFromReadableStream<Payload>(
  rscStream as ReadableStream<Uint8Array>,
);
setDocumentClient(payload.client);

// Not as soon as the script runs: a boundary the stream has not moved in yet
// cannot be hydrated, and a context that changes as the page hydrates (a
// colour scheme read from the browser) makes React render it again on the
// client, beside the server's copy — a second `<title>`, and in a background
// tab a hidden duplicate of the page. The HTML still paints as it streams;
// what waits is the page responding, and a background tab until it is shown.
await whenRevealed();

// Present only when a form was posted without JavaScript. Hydration has to be
// told, or React discards the result the page came back with and the message
// the visitor is reading disappears the moment the script loads.
mount(
  document,
  <AppRouter
    pathname={payload.pathname}
    search={payload.search}
    tree={payload.tree}
  />,
  payload.pathname,
  { formState: payload.formState as HydrateOptions['formState'] },
);
