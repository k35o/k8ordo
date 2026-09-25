import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from '@vitejs/plugin-rsc/rsc/server';
import {
  catchAllSchemas,
  paramSchemas,
  redirects,
  routes,
} from 'virtual:k8ordo/routes';

import type * as SsrEntry from './entry.ssr';
import { parseCatchAllParams, parseParams } from './params';
import type { ParsedParams } from './params';
import { ACTION_ID_HEADER } from './payload';
import type { Payload } from './payload';
import { isPayloadPath, pagePathFor } from './payload-path';
import { isRedirect, matchRedirects } from './redirect';
import { NotFound, renderMatch } from './render';
import { routeRequestOf } from './request';

type ActionResult = {
  returnValue?: unknown;
  formState?: unknown;
  /** Where the action sent the visitor instead of returning. */
  redirect?: string;
};

/**
 * Consulted before the table, since a directory that redirects has no page to
 * render.
 */
const redirectFor = matchRedirects(redirects);

const redirectResponse = (to: string, status: number): Response =>
  new Response(null, { status, headers: { location: to } });

// ページは GET（ヘッダーだけなら HEAD）で読まれ、Server Action は POST で届く。
// route file はほかのメソッドに答えを宣言できないので、POST 以外をすべて
// ページとして描くと、受け付けていない PUT や DELETE に 200 を返してしまう
const METHODS = ['GET', 'HEAD', 'POST'];

const HTML_TYPE = 'text/html;charset=utf-8';
const PAYLOAD_TYPE = 'text/x-component;charset=utf-8';

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
  try {
    return await invokeAction(request, temporaryReferences);
  } catch (error) {
    // A redirect is how an action ends, not how it fails.
    if (isRedirect(error)) return { redirect: error.to };
    throw error;
  }
};

const invokeAction = async (
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
  // It returns null for a form that carries no action at all — a POST from
  // somewhere else entirely, which is a request for the page, not a call.
  const action = (await decodeAction(formData)) as
    | (() => Promise<unknown>)
    | null;
  if (action === null) return {};
  const returnValue: unknown = await action();
  return {
    returnValue,
    formState: await decodeFormState(returnValue, formData),
  };
};

/**
 * A Server Action is a function the application exported, reachable by name
 * from anywhere that can make a POST — including another origin's form, which
 * the browser sends with the visitor's cookies attached. Nothing in an action
 * identifies its caller, so the request has to: a cross-site POST does not
 * carry an `Origin` matching where the page is served from.
 *
 * The comparison is against the URL this handler was asked for, not against a
 * header, so there is one answer to "where am I" and no second one to keep in
 * step. A deployment behind a proxy is then a matter of handing the handler
 * the public URL — which whatever adapter builds the `Request` was already
 * deciding.
 *
 * `Origin` is set by the browser on every POST and page script cannot forge
 * it, which is what makes it the check.
 */
const sameOrigin = (request: Request, url: URL): boolean => {
  const origin = request.headers.get('origin');
  if (origin === null) return false;
  try {
    return new URL(origin).host === url.host;
  } catch {
    return false;
  }
};

/**
 * A page that could not be rendered, as `@k8ordo/static` receives it: the
 * build writes nothing for a 500 and stops with the message.
 */
const renderFailed = (error: unknown): Response =>
  new Response(
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'a component threw something that is not an Error',
    {
      status: 500,
      headers: { 'content-type': 'text/plain;charset=utf-8' },
    },
  );

/**
 * The one entry both modes share: a request in, a page out. `@k8ordo/server`
 * calls it per request; `@k8ordo/static` calls it at build time, for each
 * route's HTML and again for its payload, and writes the answers to files.
 * What it knows of the mode is compiled in (`K8ORDO_MODE`): whether a page
 * gets the request, and whether a failed render may still stream.
 */
export default async function handler(request: Request): Promise<Response> {
  if (!METHODS.includes(request.method)) {
    return new Response('method not allowed', {
      status: 405,
      headers: { allow: METHODS.join(', ') },
    });
  }
  const url = new URL(request.url);
  const wantsPayload = isPayloadPath(url.pathname);
  const pathname = wantsPayload ? pagePathFor(url.pathname) : url.pathname;
  const isAction = request.method === 'POST';
  const addressed = request.headers.get(ACTION_ID_HEADER) !== null;
  if (isAction && !sameOrigin(request, url)) {
    return new Response('cross-origin action', { status: 403 });
  }

  // A redirect.ts answers before anything renders. A payload request for it
  // is sent to the page, not the payload: the client runtime sees HTML come
  // back, gives the navigation to the browser, and the browser follows the
  // redirect as a document load — the URL bar ends up right.
  const declared = redirectFor(pathname);
  if (declared !== null && !isAction) {
    return redirectResponse(declared.to, declared.permanent ? 308 : 307);
  }

  const temporaryReferences = createTemporaryReferenceSet();
  const action: ActionResult = isAction
    ? await runAction(request, temporaryReferences)
    : {};
  if (action.redirect !== undefined && !addressed) {
    // A form posted without JavaScript: the browser follows a 303 with a GET.
    return redirectResponse(action.redirect, 303);
  }

  // A param a schema refuses is a pathname the pattern does not answer, so
  // the walk goes on to whatever the table declares next — the catch-all in
  // the end. A catch-all answers whatever its params hold: a 404 is already
  // what a refused param means. The layouts' schemas above it still run, for
  // what they write — `/en/missing` renders in the locale its URL names.
  // The render starts inside `parsed.enter`, so it sees what the schemas of
  // the pattern that answered wrote to the async context, and nothing a
  // refused pattern's did.
  let parsed: ParsedParams = { params: {}, enter: (fn) => fn() };
  const match = routes.match(pathname, (found) => {
    if (found.pattern.endsWith('/*')) {
      parsed = parseCatchAllParams(
        catchAllSchemas[found.pattern] ?? [],
        found.params,
      );
      return true;
    }
    const accepted = parseParams(
      paramSchemas[found.pattern] ?? [],
      found.params,
    );
    if (accepted === null) return false;
    parsed = accepted;
    return true;
  });
  const missing = match === null || match.pattern.endsWith('/*');
  const status = missing ? 404 : 200;
  // An action the client addressed answers in the shape the client already
  // knows how to read, so applying its result and applying a navigation are
  // the same code path. A form posted without JavaScript gets HTML back,
  // because that browser has nothing to apply a payload with.
  const answersPayload = wantsPayload || addressed;
  // ステータスとヘッダーは描く前のここで決まる（描画中に失敗したページも同じ
  // ステータスのまま流れる）ので、HEAD はここで答える。描いてから本文を捨てる
  // と、誰も受け取らない本文のためにページのデータ取得まで走る
  if (request.method === 'HEAD') {
    return new Response(null, {
      status,
      headers: { 'content-type': answersPayload ? PAYLOAD_TYPE : HTML_TYPE },
    });
  }
  // A build into files has no request to hand a page; a running server does.
  const routeRequest =
    import.meta.env.K8ORDO_MODE === '@k8ordo/server'
      ? routeRequestOf(request)
      : undefined;
  const ssr = await import.meta.viteRsc.loadModule<typeof SsrEntry>(
    'ssr',
    'index',
  );
  const payload: Payload = {
    // An action that redirected renders nothing: the client is about to
    // leave this page for the one it was sent to.
    tree:
      action.redirect === undefined ? (
        match === null ? (
          <NotFound />
        ) : (
          renderMatch(match, pathname, parsed.params, routeRequest)
        )
      ) : null,
    pathname,
    client: ssr.clientEntry,
    returnValue: action.returnValue,
    formState: action.formState,
    redirect: action.redirect,
  };

  const failures: unknown[] = [];
  const rscStream = parsed.enter(() =>
    renderToReadableStream(payload, {
      temporaryReferences: isAction ? temporaryReferences : undefined,
      // Without this a component that throws simply truncates the stream, and
      // the browser reports a closed connection instead of the actual error.
      onError: (error: unknown) => {
        failures.push(error);
        // pathname は引数として渡す。第 1 引数はフォーマット文字列なので、
        // `%s` を含む URL を投げられると error が食われて消える
        console.error('k8ordo: rendering %s failed', pathname, error);
      },
    }),
  );
  if (answersPayload) {
    return new Response(rscStream, {
      status,
      headers: { 'content-type': PAYLOAD_TYPE },
    });
  }

  if (import.meta.env.K8ORDO_MODE === '@k8ordo/static') {
    // A build into files can afford to wait for the whole page, and has to:
    // a Server Component that threw would otherwise be written as a page whose
    // error shows only once a visitor's browser has rendered it. Under a
    // running server the same page streams and the browser shows error.tsx;
    // at build time it is a build that stops, naming the page.
    let body: ArrayBuffer;
    try {
      const html = await parsed.enter(() => ssr.renderHtml(rscStream));
      body = await new Response(html).arrayBuffer();
    } catch (error) {
      // With no Suspense boundary above the throw the HTML render itself
      // rejects, with the SSR environment's copy of a Server Component's
      // error — React's generic production message. The original is the one
      // `onError` recorded; a client component that threw left no record,
      // and what rejected is its own error.
      return renderFailed(failures[0] ?? error);
    }
    const failed = failures[0];
    if (failed !== undefined) return renderFailed(failed);
    return new Response(body, {
      status,
      headers: { 'content-type': HTML_TYPE },
    });
  }
  const html = await parsed.enter(() => ssr.renderHtml(rscStream));
  return new Response(html, {
    status,
    headers: { 'content-type': HTML_TYPE },
  });
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
