import { FALLBACK_SEGMENT, payloadPathFor } from '@k8ordo/framework-engine';
import { withBase } from '@k8ordo/router';

import type { Shell } from './paths';

/**
 * A `200` rule of a static host: a request for `from` is answered with the
 * file at `to`, the URL left as it is.
 */
export type Rewrite = { readonly from: string; readonly to: string };

const BUILT_COMMENT =
  '# @k8ordo/framework: built URLs the rules below would also catch';
const SHELL_COMMENT =
  "# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell";

/** What Cloudflare reads as a placeholder: `:` and a letter, anywhere. */
const PLACEHOLDER = /:[A-Za-z]\w*/u;

const PARAM_SEGMENT = /^:[A-Za-z_]\w*$/u;

const decodeSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

/**
 * A segment as a browser sends it: what the URL parser leaves of it.
 * Escaped first are the characters the parser would read as something else
 * than a name — a segment here is a name, the value a URL decoded into.
 */
const sentSegment = (decoded: string): string =>
  new URL(
    `http://k8ordo.localhost/${decoded
      .replaceAll('%', '%25')
      .replaceAll('?', '%3F')
      .replaceAll('#', '%23')
      .replaceAll('\\', '%5C')}`,
  ).pathname.slice(1);

/**
 * A segment's spellings: as a browser sends it, then — when it differs —
 * canonically, the way Cloudflare re-encodes a target (`encodeURIComponent`
 * of what it decodes to). `a@b` is sent as itself and re-encoded `a%40b`.
 */
const spellingsOf = (segment: string): readonly [string, string] => {
  const decoded = decodeSegment(segment);
  return [sentSegment(decoded), encodeURIComponent(decoded)];
};

/** A pathname's spellings, segment by segment: as sent, and canonically. */
const pathSpellings = (pathname: string): string[] => {
  const segments = pathname
    .split('/')
    .map((segment) =>
      segment === '' ? (['', ''] as const) : spellingsOf(segment),
    );
  const sent = segments.map(([spelled]) => spelled).join('/');
  const canonical = segments.map(([, spelled]) => spelled).join('/');
  return sent === canonical ? [canonical] : [sent, canonical];
};

const byFrom = (rules: readonly Rewrite[]): Rewrite[] =>
  rules.filter(
    (rule, index) =>
      rules.findIndex((each) => each.from === rule.from) === index,
  );

const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Block 3, ordered: every document rule, then every payload rule — past
 * Cloudflare's dynamic limit, the rules lost are payload rules, whose
 * navigations become document loads, before any value goes unanswered.
 * Within each, shells in table order of their pattern, the more specific
 * location (more known segments) first, then by location.
 *
 * Placeholders are positional (`:p1`, `:p2`): Cloudflare reads only
 * `:[A-Za-z]\w*`, and a param named `_id` would be a literal there. A known
 * segment is written in `from` as a browser sends it (and canonically too,
 * when the two differ) and canonically in `to`, which Cloudflare re-encodes
 * and would otherwise redirect to its own spelling.
 */
export const shellRules = (
  shells: readonly Shell[],
  base: string,
): Rewrite[] => {
  const patterns = [...new Set(shells.map((shell) => shell.pattern))];
  const known = (shell: Shell): number =>
    shell.location
      .split('/')
      .filter((segment) => segment !== '' && !PARAM_SEGMENT.test(segment))
      .length;
  const ordered = shells.toSorted(
    (a, b) =>
      patterns.indexOf(a.pattern) - patterns.indexOf(b.pattern) ||
      known(b) - known(a) ||
      compare(a.location, b.location),
  );
  const documents: Rewrite[] = [];
  const payloads: Rewrite[] = [];
  for (const shell of ordered) {
    let placeholders = 0;
    const segments = shell.location.split('/').map((segment) => {
      if (segment === '') return { from: ['', ''], to: '' };
      if (!PARAM_SEGMENT.test(segment)) {
        const [sent, canonical] = spellingsOf(segment);
        return { from: [sent, canonical], to: canonical };
      }
      placeholders += 1;
      const placeholder = `:p${String(placeholders)}`;
      return { from: [placeholder, placeholder], to: FALLBACK_SEGMENT };
    });
    const to = segments.map((segment) => segment.to).join('/');
    const froms = [
      ...new Set([0, 1].map((at) => segments.map((s) => s.from[at]).join('/'))),
    ];
    for (const from of froms) {
      documents.push({
        from: withBase(from, base),
        to: withBase(`${to}/`, base),
      });
      payloads.push({
        from: withBase(`${from}/index.rsc`, base),
        to: withBase(`${to}/index.rsc`, base),
      });
    }
  }
  return byFrom([...documents, ...payloads]);
};

/** A `from` as Cloudflare matches it: anchored, a placeholder one segment. */
const cloudflarePattern = (from: string): RegExp =>
  new RegExp(
    `^${from
      .split(/(:[A-Za-z]\w*|\*)/u)
      .map((part, index) =>
        index % 2 === 0 ? RegExp.escape(part) : part === '*' ? '.*' : '[^/]+',
      )
      .join('')}$`,
    'u',
  );

/** Whether Cloudflare's matching of `from` takes the pathname. */
export const cloudflareMatches = (from: string, pathname: string): boolean =>
  cloudflarePattern(from).test(pathname);

/** The files a host serves that no rule needs to repeat. */
const isOwnFile = (file: string): boolean =>
  file === '_redirects' ||
  file === '_headers' ||
  file.split('/').includes(FALLBACK_SEGMENT);

/** The URLs a file answers at: itself, and a page's directory or name. */
const urlsOf = (file: string): string[] => {
  const own = `/${file}`;
  if (file === 'index.html') return [own, '/'];
  if (file.endsWith('/index.html')) {
    return [own, own.slice(0, -'/index.html'.length)];
  }
  if (file.endsWith('.html')) return [own, own.slice(0, -'.html'.length)];
  return [own];
};

/**
 * Block 1: the built URLs a shell rule would also catch, each listed as
 * itself (Cloudflare applies rules before files, and a static rule is looked
 * up first) — as a browser sends it and canonically, both answered with the
 * canonical spelling, which Cloudflare re-encodes a target into and would
 * otherwise redirect to — and the payload URL of a built URL that is not a page — a
 * `redirect.ts` or a `route.ts` file — answered with the shell's HTML, so a
 * client navigation to it becomes a document load instead of rendering the
 * shell. A URL a rule could not list as itself (Cloudflare and Netlify read
 * `:b` in `/a:b` as a placeholder, `*` as a splat) is left out and returned
 * in `unlisted`; a `from` the application's own rules already have is left
 * to them.
 *
 * @param files the client build's files, relative to it, POSIX separators
 * @param notPages pathnames written without a payload, in the table's terms
 * @param own the `from`s of the application's own `_redirects`
 */
export const builtRules = (
  files: readonly string[],
  notPages: readonly string[],
  shells: readonly Rewrite[],
  own: readonly string[],
  base: string,
): { rules: Rewrite[]; unlisted: string[] } => {
  const matchers = shells.map((rule) => ({
    rule,
    pattern: cloudflarePattern(rule.from),
  }));
  const firstMatch = (url: string): Rewrite | undefined =>
    matchers.find(({ pattern }) => pattern.test(url))?.rule;
  const rules: Rewrite[] = [];
  const unlisted = new Set<string>();
  const list = (from: string, to: string): void => {
    if (PLACEHOLDER.test(from) || from.includes('*')) {
      unlisted.add(from);
      return;
    }
    if (own.includes(from)) return;
    rules.push({ from, to });
  };
  for (const file of files) {
    if (isOwnFile(file)) continue;
    for (const url of urlsOf(file)) {
      const spellings = pathSpellings(url);
      // 宛先はどちらの綴りでも、Cloudflare が符号化し直したときの綴り
      const to = withBase(spellings.at(-1) as string, base);
      for (const spelled of spellings) {
        const from = withBase(spelled, base);
        if (firstMatch(from) !== undefined) list(from, to);
      }
    }
  }
  for (const page of notPages) {
    for (const spelled of pathSpellings(payloadPathFor(page))) {
      const from = withBase(spelled, base);
      const rule = firstMatch(from);
      if (rule?.to.endsWith('/index.rsc') === true) {
        list(from, rule.to.slice(0, -'index.rsc'.length));
      }
    }
  }
  return {
    rules: byFrom(rules).toSorted((a, b) => compare(a.from, b.from)),
    unlisted: [...unlisted].toSorted(compare),
  };
};

const lineOf = (rule: Rewrite): string => `${rule.from} ${rule.to} 200`;

/**
 * The `_redirects` file: the built URLs, the application's own rules
 * verbatim — between the two, so their static rules stay static on
 * Cloudflare and their specific rules win over the shells' — then the
 * shells'.
 */
export const formatRedirects = (
  built: readonly Rewrite[],
  own: string | null,
  shells: readonly Rewrite[],
): string => {
  const ownText = own?.replace(/\s+$/u, '') ?? '';
  return `${[
    ...(built.length > 0
      ? [BUILT_COMMENT, ...built.map((rule) => lineOf(rule))]
      : []),
    ...(ownText === '' ? [] : [ownText]),
    SHELL_COMMENT,
    ...shells.map((rule) => lineOf(rule)),
  ].join('\n')}\n`;
};

/** A line's fields, comments and blank lines aside — `null` for those. */
const fieldsOf = (line: string): string[] | null => {
  const trimmed = line.trim();
  if (trimmed === '' || trimmed.startsWith('#')) return null;
  return trimmed.replace(/\s+#.*$/u, '').split(/\s+/u);
};

/** The rules of a `_redirects` file, comments and blank lines aside. */
export const rulesOf = (
  text: string,
): Array<{ readonly line: string; readonly from: string }> =>
  text.split('\n').flatMap((line) => {
    const fields = fieldsOf(line);
    return fields === null
      ? []
      : [{ line: line.trim(), from: fields[0] as string }];
  });

/**
 * What Cloudflare counts: a line is static while it has no placeholder or
 * splat and no dynamic line came before it; every line after the first
 * dynamic one is dynamic.
 */
export const cloudflareCounts = (
  text: string,
): { static: number; dynamic: number } => {
  let staticRules = 0;
  let dynamicRules = 0;
  for (const line of text.split('\n')) {
    const fields = fieldsOf(line);
    if (fields === null || fields.length < 2 || fields.length > 3) continue;
    const from = fields[0] as string;
    if (dynamicRules === 0 && !from.includes('*') && !PLACEHOLDER.test(from)) {
      staticRules += 1;
    } else {
      dynamicRules += 1;
    }
  }
  return { static: staticRules, dynamic: dynamicRules };
};

/**
 * The `200` lines made of literal and `:name` segments; any other line is
 * skipped — a comment, another status, a forced `200!`, a splat, a
 * condition. What `vite preview` and `serve` apply to a static build.
 */
export const parseRedirects = (text: string): Rewrite[] =>
  text.split('\n').flatMap((line) => {
    const fields = fieldsOf(line);
    if (fields?.length !== 3) return [];
    const [from, to, status] = fields as [string, string, string];
    if (status !== '200' || from.includes('*')) return [];
    return [{ from, to }];
  });

const segmentsOf = (pathname: string): string[] => {
  const trimmed =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  return trimmed.split('/');
};

/**
 * The first rule whose `from` matches, its `to`; `:name` takes one
 * segment, and a single trailing slash is ignored, as Netlify does.
 */
export const rewriteFor = (
  rules: readonly Rewrite[],
  pathname: string,
): string | null => {
  const given = segmentsOf(pathname);
  for (const rule of rules) {
    const wanted = segmentsOf(rule.from);
    if (
      wanted.length === given.length &&
      wanted.every((segment, index) => {
        const at = given[index] as string;
        return PARAM_SEGMENT.test(segment) ? at !== '' : segment === at;
      })
    ) {
      return rule.to;
    }
  }
  return null;
};
