import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { withoutBase } from '@k8ordo/router';

import { parseRedirects, rewriteFor } from './rewrites';
import type { Rewrite } from './rewrites';
import { safeJoin } from './static-file';

/** The file a static host serves, and under which status. */
export type StaticAnswer = {
  readonly file: string;
  readonly status: 200 | 404;
} | null;

const isFile = async (candidate: string): Promise<boolean> => {
  try {
    return (await stat(candidate)).isFile();
  } catch {
    return false;
  }
};

/** The file a URL names in the client build: itself, or a directory's index.html. */
const fileAt = async (
  client: string,
  pathname: string,
  base: string,
): Promise<string | null> => {
  const own = withoutBase(pathname, base);
  if (own === null) return null;
  const resolved = safeJoin(client, own);
  if (resolved === null) return null;
  if (await isFile(resolved)) return resolved;
  const index = path.join(resolved, 'index.html');
  return (await isFile(index)) ? index : null;
};

/**
 * What a static host serves for a GET of `pathname` (the request's, base
 * included), in Netlify's order: the file; a directory's `index.html`; the
 * first `200` rule's target (`…/` is its `index.html`); else `404.html`
 * under 404; `null` when there is not even that, or the URL is outside the
 * base. Rules are matched against the whole pathname, since their lines
 * carry the base.
 */
export const resolveStatic = async (
  client: string,
  rules: readonly Rewrite[],
  pathname: string,
  base: string,
): Promise<StaticAnswer> => {
  if (withoutBase(pathname, base) === null) return null;
  const own = await fileAt(client, pathname, base);
  if (own !== null) return { file: own, status: 200 };
  const target = rewriteFor(rules, pathname);
  const rewritten = target === null ? null : await fileAt(client, target, base);
  if (rewritten !== null) return { file: rewritten, status: 200 };
  const notFound = path.join(client, '404.html');
  return (await isFile(notFound)) ? { file: notFound, status: 404 } : null;
};

/** The `200` rules of the client build's `_redirects`; none without one. */
export const readRules = async (client: string): Promise<Rewrite[]> => {
  let text: string;
  try {
    text = await readFile(path.join(client, '_redirects'), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  return parseRedirects(text);
};
