import { createHash } from 'node:crypto';

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

// <meta> で書いたポリシーでは効かない。ホストのヘッダーで書くもの
const HEADER_ONLY = new Set(['frame-ancestors', 'report-uri', 'sandbox']);

const scriptDirectiveOf = (
  policy: ContentSecurityPolicy,
): [string, readonly string[]] | null => {
  const own = policy['script-src'];
  if (own !== undefined) return ['script-src', own];
  const fallback = policy['default-src'];
  return fallback === undefined ? null : ['default-src', fallback];
};

/**
 * What would make a policy wrong to write into every page, named at once:
 * a directive a `<meta>` ignores, a source that is not one, and
 * `'strict-dynamic'`, under which the framework's module script — allowed by
 * where it comes from, since a file cannot sign it — would never load.
 */
export const policyProblems = (policy: ContentSecurityPolicy): string[] => {
  const problems: string[] = [];
  for (const [name, sources] of Object.entries(policy)) {
    if (!/^[a-z][a-z-]*$/u.test(name)) {
      problems.push(`"${name}" is not a directive name`);
    } else if (HEADER_ONLY.has(name)) {
      problems.push(
        `${name} is ignored in a <meta> — set it as a header at the host`,
      );
    }
    for (const source of sources) {
      if (source === '' || /[\s;,]/u.test(source)) {
        problems.push(
          `"${source}" in ${name} is not one source — give each its own entry`,
        );
      }
    }
  }
  const scripts = scriptDirectiveOf(policy);
  if (scripts?.[1].includes("'strict-dynamic'") === true) {
    problems.push(
      `'strict-dynamic' in ${scripts[0]} would block the framework's module script, which a file allows by where it comes from ('self'), not by a hash`,
    );
  }
  return problems;
};

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gu;

// ブラウザは改行を LF に揃えてからハッシュを取る
const hashOf = (source: string): string =>
  `'sha256-${createHash('sha256')
    .update(source.replaceAll('\r\n', '\n').replaceAll('\r', '\n'))
    .digest('base64')}'`;

/**
 * The policy as the page's `<meta>` says it: the application's directives,
 * with the hashes added where scripts are decided — `script-src`, made from
 * `default-src` when only that was given (hashes there would also turn off
 * `'unsafe-inline'` for styles), and `script-src-elem` when given, which
 * overrides it for script elements. Neither given, scripts are not
 * restricted, and nothing is added.
 */
const serialize = (
  policy: ContentSecurityPolicy,
  hashes: readonly string[],
): string => {
  const directives = new Map(Object.entries(policy));
  const scripts = scriptDirectiveOf(policy);
  if (scripts !== null && hashes.length > 0) {
    directives.set('script-src', [...scripts[1], ...hashes]);
    const elements = directives.get('script-src-elem');
    if (elements !== undefined) {
      directives.set('script-src-elem', [...elements, ...hashes]);
    }
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
 * the page loads; an inline script of the application's is the
 * application's to allow, by its hash in that policy, and one that reached
 * the page from content is refused.
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
  const at = head.index + head[0].length;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${escapeMarkup(serialize(policy, [...hashes]))}">`;
  return `${unsigned.slice(0, at)}${meta}${unsigned.slice(at)}`;
};
