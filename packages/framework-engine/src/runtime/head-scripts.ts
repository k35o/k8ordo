/** An element written in `<head>`: its name, where it is, its attributes. */
type Element = {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly attributes: ReadonlyMap<string, string>;
};

/**
 * The elements of a document's `<head>` and where it ends — `'partial'`
 * while what has arrived cannot tell, `'none'` when the document opens with
 * something other than a `<head>`.
 */
type Head =
  | { readonly elements: readonly Element[]; readonly end: number }
  | 'partial'
  | 'none';

// 中身がマークアップでないか、スクリプトが動く間はパーサーが読まない要素。
// 中身は head の要素として数えない
const OPAQUE = new Set([
  'noscript',
  'script',
  'style',
  'template',
  'textarea',
  'title',
]);

const TAG = /<(\/?)([A-Za-z][^\t\n\f\r />]*)/uy;

const ATTRIBUTE =
  /([^\t\n\f\r "'>/=]+)(?:[\t\n\f\r ]*=[\t\n\f\r ]*(?:"([^"]*)"|'([^']*)'|([^\t\n\f\r >]+)))?/gu;

const ENDS_TAG_NAME = new Set(['\t', '\n', '\f', '\r', ' ', '/', '>']);

const attributesOf = (source: string): Map<string, string> =>
  new Map(
    [...source.matchAll(ATTRIBUTE)].map(
      ([, name = '', double, single, bare]) => [
        name.toLowerCase(),
        double ?? single ?? bare ?? '',
      ],
    ),
  );

/** Where the next `</name` starts, in any case, or -1 when it has not arrived. */
const closingAt = (html: string, name: string, from: number): number => {
  for (
    let at = html.indexOf('</', from);
    at !== -1;
    at = html.indexOf('</', at + 2)
  ) {
    // 小文字にしてから探すと、長さの変わる文字で位置がずれる
    const after = at + 2 + name.length;
    if (
      html.slice(at + 2, after).toLowerCase() === name &&
      ENDS_TAG_NAME.has(html.charAt(after))
    ) {
      return at;
    }
  }
  return -1;
};

const readHead = (html: string): Head => {
  const elements: Element[] = [];
  let inHead = false;
  let at = html.indexOf('<');
  while (at !== -1) {
    if (html.startsWith('<!--', at)) {
      const close = html.indexOf('-->', at + 4);
      if (close === -1) return 'partial';
      at = html.indexOf('<', close + 3);
      continue;
    }
    TAG.lastIndex = at;
    const tag = TAG.exec(html);
    const opensSomething = tag !== null || html.startsWith('<!', at);
    if (!opensSomething) {
      if (at + 1 === html.length) return 'partial';
      at = html.indexOf('<', at + 1);
      continue;
    }
    const close = html.indexOf('>', at);
    if (close === -1) return 'partial';
    if (tag === null) {
      // <!DOCTYPE html>
      at = html.indexOf('<', close + 1);
      continue;
    }
    const [opening, slash, written = ''] = tag;
    const closes = slash === '/';
    const name = written.toLowerCase();
    let end = close + 1;
    if (!inHead) {
      if (closes || (name !== 'html' && name !== 'head')) return 'none';
      inHead = name === 'head';
    } else if (closes) {
      if (name === 'head') return { elements, end };
    } else {
      if (OPAQUE.has(name)) {
        const closing = closingAt(html, name, end);
        if (closing === -1) return 'partial';
        const closed = html.indexOf('>', closing);
        if (closed === -1) return 'partial';
        end = closed + 1;
      }
      elements.push({
        name,
        start: at,
        end,
        attributes: attributesOf(html.slice(at + opening.length, close)),
      });
    }
    at = html.indexOf('<', end);
  }
  return 'partial';
};

const isStylesheet = ({ name, attributes }: Element): boolean =>
  name === 'style' ||
  (name === 'link' &&
    (attributes.get('rel') ?? '')
      .toLowerCase()
      .split(/[\t\n\f\r ]+/u)
      .includes('stylesheet'));

/** A script the parser runs where it stands: inline, and classic. */
const runsInPlace = ({ name, attributes }: Element): boolean =>
  name === 'script' && !attributes.has('src') && !attributes.has('type');

const withScriptsFirst = (
  html: string,
  { elements }: Exclude<Head, string>,
): string => {
  const first = elements.find(isStylesheet);
  if (first === undefined) return html;
  const scripts = elements.filter(
    (element) => runsInPlace(element) && element.start > first.start,
  );
  if (scripts.length === 0) return html;
  let written =
    html.slice(0, first.start) +
    scripts.map(({ start, end }) => html.slice(start, end)).join('');
  let from = first.start;
  for (const { start, end } of scripts) {
    written += html.slice(from, start);
    from = end;
  }
  return written + html.slice(from);
};

/**
 * The document with every inline classic script of its `<head>` — no `src`,
 * no `type` — moved ahead of the first stylesheet there, in the order they
 * were written. React writes what it hoists into `<head>` (the stylesheets
 * among it) before the head's own children, and a script after a stylesheet
 * waits for that stylesheet to load, while the browser may paint the page
 * without what the script would have set. What a `<noscript>` or a
 * `<template>` holds stays where it is, and so does everything outside the
 * `<head>`.
 */
export const scriptsBeforeStylesheets = (html: string): string => {
  const head = readHead(html);
  return typeof head === 'string' ? html : withScriptsFirst(html, head);
};

const joined = (held: Uint8Array, chunk: Uint8Array): Uint8Array => {
  const bytes = new Uint8Array(held.length + chunk.length);
  bytes.set(held);
  bytes.set(chunk, held.length);
  return bytes;
};

/**
 * `scriptsBeforeStylesheets` over a stream of HTML: it holds the bytes back
 * only until the `<head>` has arrived whole, and passes the rest on as they
 * come — a document that does not open with a `<head>`, from its first
 * bytes.
 */
export const scriptsBeforeStylesheetsStream = (): TransformStream<
  Uint8Array,
  Uint8Array
> => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let held: Uint8Array | undefined = new Uint8Array(0);
  return new TransformStream({
    transform(chunk, controller) {
      if (held === undefined) {
        controller.enqueue(chunk);
        return;
      }
      const bytes = joined(held, chunk);
      // 途中で切れた文字は末尾の U+FFFD になるが、head の終わりより前には来ない
      const text = decoder.decode(bytes);
      const head = readHead(text);
      if (head === 'partial') {
        held = bytes;
        return;
      }
      held = undefined;
      if (head === 'none') {
        controller.enqueue(bytes);
        return;
      }
      const through = text.slice(0, head.end);
      controller.enqueue(encoder.encode(withScriptsFirst(through, head)));
      const rest = bytes.subarray(encoder.encode(through).length);
      if (rest.length > 0) controller.enqueue(rest);
    },
    flush(controller) {
      if (held !== undefined && held.length > 0) controller.enqueue(held);
    },
  });
};
