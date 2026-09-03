import { renderToReadableStream } from '@vitejs/plugin-rsc/rsc/server';
import { routes } from 'virtual:k8ordo/routes';

import type * as SsrEntry from './entry.ssr';
import { isPayloadPath, pagePathFor } from './payload-path';
import { NotFound, renderMatch } from './render';

/**
 * The one entry both modes share: a request in, a page out. `@k8ordo/server`
 * calls it per request; `@k8ordo/static` calls it once per route at build
 * time and writes the answers to files. Nothing about it knows which.
 */
export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const wantsPayload = isPayloadPath(url.pathname);
  const pathname = wantsPayload ? pagePathFor(url.pathname) : url.pathname;

  const match = routes.match(pathname);
  const missing = match === null || match.pattern.endsWith('/*');
  const status = missing ? 404 : 200;
  const root = match === null ? <NotFound /> : renderMatch(match);

  const rscStream = renderToReadableStream(root);
  if (wantsPayload) {
    return new Response(rscStream, {
      status,
      headers: { 'content-type': 'text/x-component;charset=utf-8' },
    });
  }

  const ssr = await import.meta.viteRsc.loadModule<typeof SsrEntry>(
    'ssr',
    'index',
  );
  return new Response(await ssr.renderHtml(rscStream), {
    status,
    headers: { 'content-type': 'text/html;charset=utf-8' },
  });
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
