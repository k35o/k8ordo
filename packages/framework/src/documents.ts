import { createHash } from 'node:crypto';

import { STYLESHEET_ORDER_HREF } from '@k8ordo/framework-engine';
import type { ClientDeps } from '@k8ordo/framework-engine';

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
 * The page as a file. The handler signed the framework's own inline scripts
 * — the payload, React's — with a nonce, and a file cannot carry one:
 * everyone reads the same file, so the nonce is taken off. With a policy,
 * what it signed is named by hash instead, in a `<meta>` ahead of everything
 * the page loads, and so is the framework's one `<style>`, which keeps the
 * Server Components' stylesheets first; an inline script of the
 * application's is the application's to allow, by its hash in that policy,
 * and one that reached the page from content is refused.
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
  const at = head.index + head[0].length;
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

// React が属性の値に書く実体参照
const REFERENCE = /&(?:amp|lt|gt|quot|#x27);/gu;
const REFERENCED = new Map([
  ['&amp;', '&'],
  ['&lt;', '<'],
  ['&gt;', '>'],
  ['&quot;', '"'],
  ['&#x27;', "'"],
]);

const attributeOf = (tag: string, name: string): string | undefined =>
  new RegExp(`\\s${name}="([^"]*)"`, 'u')
    .exec(tag)?.[1]
    ?.replaceAll(REFERENCE, (reference) => REFERENCED.get(reference) ?? '');

/**
 * What of the client components a page's payload names its HTML does not
 * link: a stylesheet not linked as one in `<head>`, a script neither
 * preloaded as a module there nor loaded by a `<script>` — by component,
 * only those missing something. A `<link>` written into a script's text, or
 * into `<body>`, links nothing before the page has run; React hoists every
 * resource of a page it waited for into `<head>`. With no `</head>`, the
 * whole document is its head.
 */
export const unlinkedDeps = (
  html: string,
  named: readonly ClientDeps[],
): ClientDeps[] => {
  const outside = writtenOutsideScripts(html).join('');
  const end = outside.indexOf('</head>');
  const head = end === -1 ? outside : outside.slice(0, end);
  const stylesheets = new Set<string>();
  const modules = new Set<string>();
  for (const [tag] of head.matchAll(/<link\b[^>]*>/gu)) {
    const href = attributeOf(tag, 'href');
    if (href === undefined) continue;
    const rel = attributeOf(tag, 'rel');
    if (rel === 'stylesheet') stylesheets.add(href);
    if (rel === 'modulepreload') modules.add(href);
  }
  for (const [, attributes = ''] of html.matchAll(SCRIPT)) {
    const src = attributeOf(attributes, 'src');
    if (src !== undefined) modules.add(src);
  }
  return named
    .map((component) => ({
      ...component,
      js: component.js.filter((href) => !modules.has(href)),
      css: component.css.filter((href) => !stylesheets.has(href)),
    }))
    .filter(({ js, css }) => js.length > 0 || css.length > 0);
};

const counting = (count: number, one: string, many: string): string =>
  `${String(count)} ${count === 1 ? one : many}`;

/** How many files the message names, before it counts the rest. */
const LISTED = 20;
/** How many pages a file's line names, before it counts the rest. */
const EXAMPLES = 3;

const pagesOf = (pages: Iterable<string>): string => {
  const sorted = [...pages].toSorted();
  const named = sorted.slice(0, EXAMPLES).join(', ');
  return `${counting(sorted.length, 'page', 'pages')} (${sorted.length > EXAMPLES ? `${named}, …` : named})`;
};

/**
 * The error a static build stops with when HTML it wrote does not link
 * what the client components its payload names need: `unlinked` holds, by
 * page (its pathname, `404.html`, a shell's location), what each component
 * misses, or `null` when the handler did not say; `report` asks for the
 * report. Each file is named once, with how many pages miss it, a few of
 * them and a component that needs it, the files most pages miss first and
 * only so many: a component's files include what the client entry loads,
 * so a failure across the site would otherwise repeat the same files for
 * every page and component, past what a report can carry.
 */
export const unlinkedMessage = (
  unlinked: ReadonlyMap<string, readonly ClientDeps[] | null>,
  report: string,
): string => {
  const unsaid: string[] = [];
  // 部品は参照で数える。export 名だけでは、別々のモジュールの default が 1 つになる
  const missed = new Map<
    string,
    {
      readonly pages: Set<string>;
      readonly components: Map<string, string>;
    }
  >();
  for (const [page, components] of unlinked) {
    if (components === null) {
      unsaid.push(page);
      continue;
    }
    for (const { id, name, js, css } of components) {
      for (const file of [...css, ...js]) {
        const by = missed.get(file) ?? {
          pages: new Set(),
          components: new Map(),
        };
        by.pages.add(page);
        by.components.set(`${id}#${name}`, name);
        missed.set(file, by);
      }
    }
  }
  const files = [...missed].toSorted(
    ([a, { pages: x }], [b, { pages: y }]) =>
      y.size - x.size || (a < b ? -1 : 1),
  );
  const components = new Set(
    files.flatMap(([, { components: needing }]) => [...needing.keys()]),
  );
  const summary = [
    ...(files.length > 0
      ? [
          `${counting(unlinked.size - unsaid.length, 'HTML file misses', 'HTML files miss')} ${counting(files.length, 'file', 'files')} of ${counting(components.size, 'component', 'components')}`,
        ]
      : []),
    ...(unsaid.length > 0
      ? [
          `the handler did not say what the payload of ${counting(unsaid.length, 'HTML file', 'HTML files')} names`,
        ]
      : []),
  ];
  return [
    `static build wrote HTML that does not link everything the client components its payload names need: ${summary.join(', and ')}`,
    report,
    ...(unsaid.length > 0
      ? [
          `  ${pagesOf(unsaid)} — the handler did not say what its payload names`,
        ]
      : []),
    ...files.slice(0, LISTED).map(([file, { pages, components: needing }]) => {
      const [first = '', ...others] = [...needing.values()].toSorted();
      return `  ${file} — ${pagesOf(pages)}, for ${first}${others.length > 0 ? ` and ${String(others.length)} more` : ''}`;
    }),
    ...(files.length > LISTED
      ? [
          `  … and ${counting(files.length - LISTED, 'more file', 'more files')}`,
        ]
      : []),
  ].join('\n');
};
