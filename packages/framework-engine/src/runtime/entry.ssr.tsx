import {
  createFromReadableStream,
  getClientEntryUrl,
} from '@vitejs/plugin-rsc/ssr';
import type { ReactNode } from 'react';
import { renderToReadableStream } from 'react-dom/server.edge';

import { AppRouter } from './app-router';

/**
 * The payload turned into HTML. The tree is wrapped in the client router
 * here and in exactly the same way in the browser entry, so what hydration
 * finds is what the server wrote.
 */
export async function renderHtml(
  rscStream: ReadableStream<Uint8Array>,
): Promise<ReadableStream> {
  const tree = await createFromReadableStream<ReactNode>(rscStream);
  return renderToReadableStream(<AppRouter tree={tree} />, {
    bootstrapModules: [getClientEntryUrl()],
  });
}
