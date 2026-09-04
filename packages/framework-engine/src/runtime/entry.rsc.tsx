import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from '@vitejs/plugin-rsc/rsc/server';
import { routes } from 'virtual:k8ordo/routes';

import type * as SsrEntry from './entry.ssr';
import { ACTION_ID_HEADER } from './payload';
import type { Payload } from './payload';
import { isPayloadPath, pagePathFor } from './payload-path';
import { NotFound, renderMatch } from './render';

type ActionResult = {
  returnValue?: unknown;
  formState?: unknown;
};

type TemporaryReferences = ReturnType<typeof createTemporaryReferenceSet>;

/**
 * A Server Action arrives two ways, and both have to work: as a POST the
 * client runtime addressed with an action id, and as a plain form submission
 * from a browser that never ran the JavaScript. The second is the reason the
 * first cannot be the only one.
 */
const runAction = async (
  request: Request,
  temporaryReferences: TemporaryReferences,
): Promise<ActionResult> => {
  const id = request.headers.get(ACTION_ID_HEADER);
  if (id !== null) {
    const action = (await loadServerAction(id)) as (
      ...args: unknown[]
    ) => unknown;
    const contentType = request.headers.get('content-type') ?? '';
    const body = contentType.startsWith('multipart/form-data')
      ? await request.formData()
      : await request.text();
    const args = await decodeReply(body, {
      temporaryReferences,
    });
    return { returnValue: await action(...args) };
  }
  const formData = await request.formData();
  // React's own type says the decoded action returns nothing; it returns
  // whatever the action returned, and `useActionState` needs that value.
  const action = (await decodeAction(formData)) as () => Promise<unknown>;
  const returnValue: unknown = await action();
  return {
    returnValue,
    formState: await decodeFormState(returnValue, formData),
  };
};

/**
 * The one entry both modes share: a request in, a page out. `@k8ordo/server`
 * calls it per request; `@k8ordo/static` calls it once per route at build
 * time and writes the answers to files. Nothing about it knows which.
 */
export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const wantsPayload = isPayloadPath(url.pathname);
  const pathname = wantsPayload ? pagePathFor(url.pathname) : url.pathname;
  const isAction = request.method === 'POST';
  const addressed = request.headers.get(ACTION_ID_HEADER) !== null;

  const temporaryReferences = createTemporaryReferenceSet();
  const action: ActionResult = isAction
    ? await runAction(request, temporaryReferences)
    : {};

  const match = routes.match(pathname);
  const missing = match === null || match.pattern.endsWith('/*');
  const status = missing ? 404 : 200;
  const payload: Payload = {
    tree: match === null ? <NotFound /> : renderMatch(match),
    returnValue: action.returnValue,
    formState: action.formState,
  };

  const rscStream = renderToReadableStream(payload, {
    temporaryReferences: isAction ? temporaryReferences : undefined,
    // Without this a component that throws simply truncates the stream, and
    // the browser reports a closed connection instead of the actual error.
    onError: (error: unknown) => {
      console.error(`k8ordo: rendering ${pathname} failed`, error);
    },
  });
  // An action the client addressed answers in the shape the client already
  // knows how to read, so applying its result and applying a navigation are
  // the same code path. A form posted without JavaScript gets HTML back,
  // because that browser has nothing to apply a payload with.
  if (wantsPayload || addressed) {
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
