import { isNotFound, normalizePathname } from '@k8ordo/router';
import type { Match, RouteComponent } from '@k8ordo/router';
import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from '@vitejs/plugin-rsc/rsc/server';
import type { ReactNode } from 'react';
import {
  catchAllSchemas,
  guards,
  paramSchemas,
  redirects,
  routes,
} from 'virtual:k8ordo/routes';

import type * as SsrEntry from './entry.ssr';
import { runGuards } from './guard';
import { watchPage } from './page-watch';
import { parseCatchAllParams, parseParams } from './params';
import type { ParsedParams } from './params';
import { NOT_FOUND_SEGMENT } from './pathname';
import {
  ACTION_ID_HEADER,
  NOT_FOUND_DIGEST,
  NOT_FOUND_HEADER,
} from './payload';
import type { Payload } from './payload';
import { isPayloadPath, pagePathFor } from './payload-path';
import { isRedirect, matchRedirects } from './redirect';
import { NotFound, renderMatch } from './render';
import { routeRequestOf } from './request';
import { answer, inPhase, withRequest } from './request-scope';

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
export default function handler(request: Request): Promise<Response> {
  // What answers the request may add to the response — a guard's headers —
  // and what it adds goes on whatever the answer turns out to be.
  return withRequest(request, async () => answer(await respond(request)));
}

const respond = async (request: Request): Promise<Response> => {
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

  // The guards along the pattern, before anything else answers — the action
  // a POST carries included. A URL nothing answers is still below the root,
  // so the root's run for it. They run in the context the schemas left, so a
  // guard reads the locale the URL names.
  const guarded = await parsed.enter(() =>
    runGuards(guards[match?.pattern ?? '/*'] ?? [], {
      request,
      params: match?.params ?? {},
    }),
  );
  if (guarded !== null) return guarded;

  const temporaryReferences = createTemporaryReferenceSet();
  // An action answers the request as much as a guard does: it reads and
  // writes the cookies, and what it writes goes on the answer.
  const action: ActionResult = isAction
    ? await inPhase('action', () => runAction(request, temporaryReferences))
    : {};
  if (action.redirect !== undefined && !addressed) {
    // A form posted without JavaScript: the browser follows a 303 with a GET.
    return redirectResponse(action.redirect, 303);
  }

  // An action the client addressed answers in the shape the client already
  // knows how to read, so applying its result and applying a navigation are
  // the same code path. A form posted without JavaScript gets HTML back,
  // because that browser has nothing to apply a payload with.
  const answersPayload = wantsPayload || addressed;
  const missing = match === null || match.pattern.endsWith('/*');
  // ページでない答え（not-found）のステータスは描く前に決まるので、HEAD は
  // ここで答える。描いてから本文を捨てると、誰も受け取らない本文のために
  // データ取得まで走る。ページは notFound() と言うかもしれないので描く
  if (request.method === 'HEAD' && missing) {
    return new Response(null, {
      status: 404,
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

  const render = (tree: ReactNode, enter: ParsedParams['enter']): Rendered =>
    renderPayload(
      {
        tree,
        pathname,
        client: ssr.clientEntry,
        returnValue: action.returnValue,
        formState: action.formState,
        redirect: action.redirect,
      },
      enter,
      isAction ? temporaryReferences : undefined,
    );

  // A page is watched, so what it says of itself can still decide the answer.
  const page =
    match === null || missing || action.redirect !== undefined
      ? null
      : watchPage(match.stack.at(-1) as RouteComponent);
  let status = missing ? 404 : 200;
  let { enter } = parsed;
  let rendered = render(
    // An action that redirected renders nothing: the client is about to
    // leave this page for the one it was sent to.
    action.redirect === undefined ? (
      match === null ? (
        <NotFound />
      ) : (
        renderMatch(match, pathname, parsed.params, routeRequest, page?.Page)
      )
    ) : null,
    enter,
  );

  // A document's status leaves before its body, so it waits for the page to
  // answer: a page that says notFound() is not a 200. A payload does not
  // wait — a client navigation has no status to get right, and a page that
  // says it late is sent back to the server as a document load (PageBoundary).
  // A build into files waits for everything, so it catches notFound() from
  // anywhere in the page.
  if (page !== null && (!answersPayload || request.method === 'HEAD')) {
    const [forAnswer, forWatch] = rendered.stream.tee();
    rendered = { ...rendered, stream: forAnswer };
    const drained = drain(forWatch);
    // 読み終えてもページが呼ばれていないことがある（children を描かない
    // レイアウト）。そのときは待たない
    const threw = await (import.meta.env.K8ORDO_MODE === '@k8ordo/static'
      ? drained.then(() => Promise.race([page.settled, Promise.resolve()]))
      : Promise.race([page.settled, rendered.saidNotFound, drained]));
    if (rendered.notFound() || isNotFound(threw)) {
      rendered.abort();
      // The page's own answer: what the table answers for a URL nothing
      // matched here — the nearest not-found.tsx, in the context its
      // layouts' schemas leave.
      const nearest = matchNotFound(pathname);
      status = 404;
      ({ enter } = nearest.parsed);
      rendered = render(
        nearest.match === null ? (
          <NotFound />
        ) : (
          renderMatch(
            nearest.match,
            pathname,
            nearest.parsed.params,
            routeRequest,
          )
        ),
        enter,
      );
    }
  }
  // A build into files is told a page said notFound() apart from a refused
  // param: both are a 404, and only the page's is a pathname the application
  // named and then disowned.
  const saidByPage: Record<string, string> =
    import.meta.env.K8ORDO_MODE === '@k8ordo/static' &&
    status === 404 &&
    !missing
      ? { [NOT_FOUND_HEADER]: 'page' }
      : {};
  if (request.method === 'HEAD') {
    rendered.abort();
    return new Response(null, {
      status,
      headers: { 'content-type': answersPayload ? PAYLOAD_TYPE : HTML_TYPE },
    });
  }
  if (answersPayload) {
    return new Response(rendered.stream, {
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
      const html = await enter(() => ssr.renderHtml(rendered.stream));
      body = await new Response(html).arrayBuffer();
    } catch (error) {
      // With no Suspense boundary above the throw the HTML render itself
      // rejects, with the SSR environment's copy of a Server Component's
      // error — React's generic production message. The original is the one
      // `onError` recorded; a client component that threw left no record,
      // and what rejected is its own error.
      return renderFailed(rendered.failures[0] ?? error);
    }
    const failed = rendered.failures[0];
    if (failed !== undefined) return renderFailed(failed);
    return new Response(body, {
      status,
      headers: { 'content-type': HTML_TYPE, ...saidByPage },
    });
  }
  const html = await enter(() => ssr.renderHtml(rendered.stream));
  return new Response(html, {
    status,
    headers: { 'content-type': HTML_TYPE },
  });
};

/**
 * Where a page that said notFound() is sent: the catch-all the table answers
 * for a URL nothing matched here. Asked with a segment below the pathname,
 * because `/:locale/*` does not match `/en` itself, and only a catch-all may
 * answer.
 */
const matchNotFound = (
  pathname: string,
): { match: Match | null; parsed: ParsedParams } => {
  let parsed: ParsedParams = { params: {}, enter: (fn) => fn() };
  const base = normalizePathname(pathname);
  const match = routes.match(
    `${base === '/' ? '' : base}/${NOT_FOUND_SEGMENT}`,
    (found) => {
      if (!found.pattern.endsWith('/*')) return false;
      parsed = parseCatchAllParams(
        catchAllSchemas[found.pattern] ?? [],
        found.params,
      );
      return true;
    },
  );
  return { match, parsed };
};

type Rendered = {
  readonly stream: ReadableStream<Uint8Array>;
  /** What threw while rendering — notFound() aside, which is an answer. */
  readonly failures: readonly unknown[];
  /** Whether a component said notFound() yet. */
  readonly notFound: () => boolean;
  /** Settles when one does. */
  readonly saidNotFound: Promise<undefined>;
  /** Stops the render: its answer is not the one being sent. */
  readonly abort: () => void;
};

const renderPayload = (
  payload: Payload,
  enter: ParsedParams['enter'],
  // An action's, or none: `undefined` is one of the values this type admits.
  temporaryReferences: TemporaryReferences,
): Rendered => {
  const failures: unknown[] = [];
  let said = false;
  const { promise: saidNotFound, resolve } = Promise.withResolvers<undefined>();
  const controller = new AbortController();
  const stream = enter(() =>
    renderToReadableStream(payload, {
      temporaryReferences,
      signal: controller.signal,
      // Without this a component that throws simply truncates the stream, and
      // the browser reports a closed connection instead of the actual error.
      onError: (error: unknown) => {
        // notFound() is an answer, not a failure. What reaches the browser
        // is its digest, which is how PageBoundary knows it.
        if (isNotFound(error)) {
          said = true;
          resolve(undefined);
          return NOT_FOUND_DIGEST;
        }
        // 捨てた描画を止めると、その理由がここに届く。失敗ではない
        if (controller.signal.aborted) return undefined;
        failures.push(error);
        // pathname は引数として渡す。第 1 引数はフォーマット文字列なので、
        // `%s` を含む URL を投げられると error が食われて消える
        console.error('k8ordo: rendering %s failed', payload.pathname, error);
        return undefined;
      },
    }),
  );
  return {
    stream,
    failures,
    notFound: () => said,
    saidNotFound,
    abort: () => {
      controller.abort();
    },
  };
};

/**
 * Reads a stream to its end, for when it ends — whatever it held; the other
 * branch of the tee has the content. A render that was stopped ends too.
 */
const drain = (stream: ReadableStream<Uint8Array>): Promise<void> =>
  stream.pipeTo(new WritableStream()).catch(() => undefined);

if (import.meta.hot) {
  import.meta.hot.accept();
}
