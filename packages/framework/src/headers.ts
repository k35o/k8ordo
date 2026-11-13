import type { Connect, Plugin } from 'vite';

/** The headers `framework({ headers })` declares for every response. */
export type DeclaredHeaders = Readonly<Record<string, string>>;

const PLUGIN = 'k8ordo:headers';

/** A field name as HTTP spells one: a token. */
const NAME = /^[!#$%&'*+\-.^`|~\w]+$/u;

/** Bytes a field value cannot hold, a line break among them. */
// oxlint-disable-next-line no-control-regex -- 制御文字そのものを断る
const CONTROL = /[\u0000-\u0008\u000A-\u001F\u007F]/u;

/**
 * What is wrong with the `headers` option, or `null`. A name or a value HTTP
 * could not send is refused when the config loads rather than by whichever
 * server meets it first — and a line break would start a rule of its own in
 * the `_headers` file the build writes.
 */
export const headersRefusal = (given: unknown): string | null => {
  if (given === undefined) return null;
  if (typeof given !== 'object' || given === null || Array.isArray(given)) {
    return 'framework() takes headers as an object of names and values, sent with every response';
  }
  const seen = new Set<string>();
  for (const [name, value] of Object.entries(given)) {
    if (!NAME.test(name)) {
      return `framework() cannot send a header named ${JSON.stringify(name)} — a header's name is letters, digits and the punctuation of a token`;
    }
    if (typeof value !== 'string' || value === '' || value !== value.trim()) {
      return `framework() needs the value of the header ${name} to be text, with nothing empty around it`;
    }
    if (CONTROL.test(value)) {
      return `framework() cannot send the header ${name}: its value holds a control character`;
    }
    if (seen.has(name.toLowerCase())) {
      return `framework() was given the header ${name} twice, in two spellings`;
    }
    seen.add(name.toLowerCase());
  }
  return null;
};

const HEADERS_COMMENT =
  '# @k8ordo/framework: the headers framework() declared for every response';

/**
 * The `_headers` file Netlify and Cloudflare read: the declared headers for
 * every path, then the application's own `public/_headers` verbatim. Both
 * hosts send a response every rule that matches it, so a name in both is
 * sent with both values.
 */
export const formatHeaders = (
  headers: DeclaredHeaders,
  own: string | null,
): string => {
  const ownText = own?.replace(/\s+$/u, '') ?? '';
  return `${[
    HEADERS_COMMENT,
    '/*',
    ...Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`),
    ...(ownText === '' ? [] : ['', ownText]),
  ].join('\n')}\n`;
};

type Send = (server: {
  readonly middlewares: {
    readonly use: (handle: Connect.NextHandleFunction) => unknown;
  };
}) => void;

/**
 * `vite dev` and `vite preview` sending the declared headers: set before
 * anything answers, so they are on a module, a page, a file and an error
 * alike, and whatever answers may still write the same name over them.
 * Its `api` is where a host adapter reads what was declared.
 */
export const headersPlugin = (
  headers: DeclaredHeaders,
): Plugin & {
  readonly configureServer: Send;
  readonly configurePreviewServer: Send;
} => {
  const declared = Object.entries(headers);
  const send: Send = (server) => {
    server.middlewares.use((_request, response, next) => {
      for (const [name, value] of declared) response.setHeader(name, value);
      next();
    });
  };
  return {
    name: PLUGIN,
    api: { headers },
    configureServer: send,
    configurePreviewServer: send,
  };
};

/** The headers the `framework()` among these plugins declared. */
export const declaredHeaders = (
  plugins: ReadonlyArray<{ readonly name: string; readonly api?: unknown }>,
): DeclaredHeaders =>
  (
    plugins.find(({ name }) => name === PLUGIN)?.api as
      | { readonly headers: DeclaredHeaders }
      | undefined
  )?.headers ?? {};
