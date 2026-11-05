import { createFromReadableStream } from '@vitejs/plugin-rsc/browser';
import { rscStream } from 'rsc-html-stream/client';
// locale の集合は評価されたときに自分を登録する。どの client コンポーネントも
// import しないアプリでは、ブラウザの文言が集合を知らないまま読まれる
import 'virtual:k8ordo/locales';

import { connectAppRouter } from './browser-payloads';
import { whenClientReady } from './client-ready';
import { mount, renderedHere } from './mount';
import type { HydrateOptions } from './mount';
import { reportCaught } from './page-boundary';
import type { Payload } from './payload';
import { whenRevealed } from './revealed';

connectAppRouter();

// Not awaited at the top of this module: a chunk of client components may
// import shared code from this entry's chunk, and so waits for this module
// to finish evaluating — waiting for those components inside its
// evaluation would never end.
const start = async (): Promise<void> => {
  // The payload the HTML was rendered from, written into that HTML by the
  // SSR entry. Reading it here rather than fetching it again is what makes
  // hydration see exactly what the server saw — and what lets a page the
  // application does not have (its prerendered 404) come alive at all.
  const [stream, copy] = (rscStream as ReadableStream<Uint8Array>).tee();
  const payload = await createFromReadableStream<Payload>(stream);
  // HTML rendered for another pathname is rendered again where the browser
  // is, once it is hydrated. Its own tree would not do: React does not render
  // an element it was handed before again, so the payload is read once more,
  // into a tree whose every element is new.
  let reread: Promise<Payload> | undefined;
  if (renderedHere(payload.pathname)) void copy.cancel();
  else reread = createFromReadableStream<Payload>(copy);

  // Not as soon as the script runs: a boundary the stream has not moved in
  // yet cannot be hydrated, and a context that changes as the page hydrates
  // (a colour scheme read from the browser) makes React render it again on
  // the client, beside the server's copy — a second `<title>`, and in a
  // background tab a hidden duplicate of the page. The HTML still paints as
  // it streams; what waits is the page responding, and a background tab
  // until it is shown.
  await whenRevealed();
  // Nor before the client components the page renders have loaded: one
  // still loading suspends where it renders, and the boundary above it
  // shows its fallback in place of the server's HTML as soon as a context
  // above the boundary changes.
  await whenClientReady([payload.tree, payload.notFound], { rows: 'wait' });

  // Present only when a form was posted without JavaScript. Hydration has to
  // be told, or React discards the result the page came back with and the
  // message the visitor is reading disappears the moment the script loads.
  mount(document, payload, reread, {
    formState: payload.formState as HydrateOptions['formState'],
    onCaughtError: reportCaught,
  });
};

// oxlint-disable-next-line unicorn/prefer-top-level-await -- awaited at the top, the wait for client components would never end (see above)
void start();
