import { createHash } from 'node:crypto';

import { STYLESHEET_ORDER_HREF } from '@k8ordo/framework-engine';
import type { ClientFiles } from '@k8ordo/framework-engine';

const escapeMarkup = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

/**
 * The sitemap protocol's one required element per URL: `<loc>`. The site is
 * taken as given, without a trailing slash, and the pathname as the URL
 * carries it, escaped for XML.
 */
export const sitemap = (site: string, pathnames: readonly string[]): string => {
  const origin = site.endsWith('/') ? site.slice(0, -1) : site;
  const urls = pathnames
    .toSorted()
    .map(
      (pathname) =>
        `  <url><loc>${escapeMarkup(`${origin}${pathname}`)}</loc></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * A redirect as a file: no server will ever send the status, so the page
 * itself has to send the visitor on. `http-equiv="refresh"` is what every
 * browser honours; the link is for the one that does not.
 */
export const redirectPage = (to: string): string => {
  const escaped = escapeMarkup(to);
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escaped}"><link rel="canonical" href="${escaped}"><title>Redirecting</title></head><body><a href="${escaped}">${escaped}</a></body></html>\n`;
};

/**
 * What `CLIENT_FILES_PATH` lists: each page's files, by its payload's path —
 * what its client components need and what its Server Components link.
 */
export const clientFiles = (
  pages: ReadonlyMap<string, readonly string[]>,
  documents: Iterable<readonly string[]>,
): ClientFiles => {
  // どの文書も読み込むものは、訪問者が着いた文書が読み込み済み
  let everywhere: Set<string> | undefined;
  for (const linked of documents) {
    const files = new Set(linked);
    everywhere = everywhere?.intersection(files) ?? files;
  }
  const own = [...pages]
    .map(
      ([page, linked]) =>
        [
          page,
          [...new Set(linked)].filter((file) => everywhere?.has(file) !== true),
        ] as const,
    )
    .filter(([, files]) => files.length > 0)
    // 描いた順によらず、ビルドが毎回同じバイトを書くように並べる
    .toSorted(([a], [b]) => (a < b ? -1 : 1));
  const files = [...new Set(own.flatMap(([, listed]) => listed))].toSorted();
  const indexOf = new Map(files.map((file, index) => [file, index]));
  return {
    files,
    pages: Object.fromEntries(
      own.map(([page, listed]) => [
        page,
        listed
          .flatMap((file) => indexOf.get(file) ?? [])
          .toSorted((a, b) => a - b),
      ]),
    ),
  };
};

/**
 * The `Content-Security-Policy` an application wants on every page, as
 * directives and their sources. The build writes it into each page's
 * `<meta>`, with the hashes of that page's signed inline scripts added.
 */
export type ContentSecurityPolicy = Readonly<Record<string, readonly string[]>>;

// <meta> で書いたポリシーでは効かない。ホストのヘッダーで書くもの。report-to は
// <meta> から取り除かれないので ignored とは言えないが、送り先を決める
// Reporting-Endpoints をレスポンスヘッダーでしか書けないので効かない
const IGNORED = 'is ignored in a <meta> — set it as a header at the host';
const HEADER_ONLY = new Map([
  ['frame-ancestors', IGNORED],
  ['report-uri', IGNORED],
  ['sandbox', IGNORED],
  [
    'report-to',
    'names an endpoint only a Reporting-Endpoints response header defines — set the policy as a header at the host',
  ],
]);

/** What decides scripts: `script-src`, or `default-src` without it. */
const scriptDirectiveOf = (
  policy: ContentSecurityPolicy,
): [string, readonly string[]] | null => {
  const own = policy['script-src'];
  if (own !== undefined) return ['script-src', own];
  const fallback = policy['default-src'];
  return fallback === undefined ? null : ['default-src', fallback];
};

/**
 * What decides a script element: `script-src-elem` when given, which
 * overrides the rest for elements, and whatever decides scripts besides.
 */
const elementDirectivesOf = (
  policy: ContentSecurityPolicy,
): Array<[string, readonly string[]]> => {
  const elements = policy['script-src-elem'];
  const scripts = scriptDirectiveOf(policy);
  return [
    ...(elements === undefined
      ? []
      : [['script-src-elem', elements] as [string, readonly string[]]]),
    ...(scripts === null ? [] : [scripts]),
  ];
};

/**
 * What decides a style element: `style-src-elem`, `style-src`, or
 * `default-src` without either.
 */
const styleElementDirectiveOf = (
  policy: ContentSecurityPolicy,
): [string, readonly string[]] | null => {
  for (const name of ['style-src-elem', 'style-src', 'default-src']) {
    const sources = policy[name];
    if (sources !== undefined) return [name, sources];
  }
  return null;
};

// ハッシュか nonce が 1 つでもあれば、ブラウザは 'unsafe-inline' を無視する
const allowsInline = (sources: readonly string[]): boolean =>
  sources.includes("'unsafe-inline'") &&
  !sources.some((source) => /^'(?:nonce|sha256|sha384|sha512)-/u.test(source));

/**
 * What would make a policy wrong to write into every page, named at once:
 * a directive that works only from a header, a source that is not one, and
 * `'strict-dynamic'`, under which the framework's module script — allowed by
 * where it comes from, since a file cannot sign it — would never load.
 */
export const policyProblems = (policy: ContentSecurityPolicy): string[] => {
  const problems: string[] = [];
  for (const [name, sources] of Object.entries(policy)) {
    const headerOnly = HEADER_ONLY.get(name);
    if (!/^[a-z][a-z-]*$/u.test(name)) {
      problems.push(`"${name}" is not a directive name`);
    } else if (headerOnly !== undefined) {
      problems.push(`${name} ${headerOnly}`);
    }
    for (const source of sources) {
      if (source === '' || /[\s;,]/u.test(source)) {
        problems.push(
          `"${source}" in ${name} is not one source — give each its own entry`,
        );
      }
    }
  }
  for (const [name, sources] of elementDirectivesOf(policy)) {
    if (sources.includes("'strict-dynamic'")) {
      problems.push(
        `'strict-dynamic' in ${name} would block the framework's module script, which a file allows by where it comes from ('self'), not by a hash`,
      );
    }
  }
  return problems;
};

// 終わりは HTML の読み方どおり、大文字小文字を問わず `</script` の後に空白・`/`・`>`
const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script[\s/>]/giu;

// React が書く中身の無い style。中身はその後ろの </style> まで
const ORDER_STYLE = new RegExp(
  `<style\\b[^>]*\\sdata-href="${STYLESHEET_ORDER_HREF}"[^>]*>([^<]*)</style>`,
  'u',
);

// 文字コードの宣言は文書の最初の 1024 バイトに要るので、ポリシーはその後ろに置く。
// <head> の先頭のものに限る: <meta> のポリシーは、それより前にあるものには効かない
const CHARSET = /^<meta(?:\s[^>]*)?\scharset=[^>]*>/iu;

// ブラウザは改行を LF に揃えてからハッシュを取る
const hashOf = (source: string): string =>
  `'sha256-${createHash('sha256')
    .update(source.replaceAll('\r\n', '\n').replaceAll('\r', '\n'))
    .digest('base64')}'`;

/**
 * The policy as the page's `<meta>` says it: the application's directives,
 * with the hashes added wherever a script element is decided —
 * `script-src-elem` when given, which overrides the rest for elements, and
 * `script-src`, made from `default-src` when only that was given (hashes
 * there would also turn off `'unsafe-inline'` for styles). None of them
 * given, scripts are not restricted, and nothing is added. The style hash
 * goes where a style element is decided, made into `style-src` from
 * `default-src` likewise, and only where the policy would refuse the style:
 * beside an `'unsafe-inline'` that allows it, a hash would turn it off for
 * every style attribute too.
 */
const serialize = (
  policy: ContentSecurityPolicy,
  hashes: readonly string[],
  styleHash: string | null,
): string => {
  const directives = new Map(Object.entries(policy));
  if (hashes.length > 0) {
    for (const [name, sources] of elementDirectivesOf(policy)) {
      const into = name === 'default-src' ? 'script-src' : name;
      directives.set(into, [...sources, ...hashes]);
    }
  }
  const styles = styleElementDirectiveOf(policy);
  if (styleHash !== null && styles !== null && !allowsInline(styles[1])) {
    const [name, sources] = styles;
    directives.set(name === 'default-src' ? 'style-src' : name, [
      ...sources,
      styleHash,
    ]);
  }
  return [...directives]
    .map(([name, sources]) => [name, ...sources].join(' '))
    .join('; ');
};

/**
 * The page as a file: without the nonce, which everyone reading the same file
 * makes worth nothing, and with a policy, what it signed named by hash.
 */
export const asFile = (
  html: string,
  nonce: string,
  policy?: ContentSecurityPolicy,
): string => {
  const signed = ` nonce="${nonce}"`;
  const unsigned = html.replaceAll(signed, '');
  if (policy === undefined) return unsigned;
  const hashes = new Set<string>();
  for (const [, attributes = '', source = ''] of html.matchAll(SCRIPT)) {
    // src のあるスクリプトは中身を持たない。許すのはどこから来たか
    if (attributes.includes(signed) && !/\ssrc=/u.test(attributes)) {
      hashes.add(hashOf(source));
    }
  }
  const head = /<head(?:\s[^>]*)?>/u.exec(unsigned);
  if (head === null) {
    throw new Error(
      'the "csp" option needs a <head> to put its <meta> in, and this page has none',
    );
  }
  const order = ORDER_STYLE.exec(unsigned);
  const styleHash = order === null ? null : hashOf(order[1] ?? '');
  const opened = head.index + head[0].length;
  const at = opened + (CHARSET.exec(unsigned.slice(opened))?.[0].length ?? 0);
  const meta = `<meta http-equiv="Content-Security-Policy" content="${escapeMarkup(serialize(policy, [...hashes], styleHash))}">`;
  return `${unsigned.slice(0, at)}${meta}${unsigned.slice(at)}`;
};

/**
 * What ends a tag's name in HTML: `</script` followed by anything else is
 * still the script's text.
 */
const ENDS_TAG_NAME = new Set(['\t', '\n', '\f', '\r', ' ', '/', '>']);

/** Where the next `<script` or `</script` tag starts, in any case. */
const tagAt = (html: string, tag: string, from: number): number => {
  for (
    let at = html.indexOf('<', from);
    at !== -1;
    at = html.indexOf('<', at + 1)
  ) {
    if (
      html.slice(at, at + tag.length).toLowerCase() === tag &&
      ENDS_TAG_NAME.has(html.charAt(at + tag.length))
    ) {
      return at;
    }
  }
  return -1;
};

/**
 * The HTML outside its script elements, in the order it is written — what a
 * layout wrote into the page, not the payload the page hydrates from. Scanned
 * rather than stripped with a pattern: an end tag may be `</SCRIPT >`, and a
 * pattern that misses one swallows the page up to the next script's.
 */
export const writtenOutsideScripts = (html: string): string[] => {
  const written: string[] = [];
  for (let from = 0; ;) {
    const open = tagAt(html, '<script', from);
    written.push(open === -1 ? html.slice(from) : html.slice(from, open));
    if (open === -1) return written;
    const close = tagAt(html, '</script', open + 1);
    if (close === -1) return written;
    const end = html.indexOf('>', close);
    if (end === -1) return written;
    from = end + 1;
  }
};
