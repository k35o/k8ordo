import path from 'node:path';

import { decodePathname } from '@k8ordo/framework-engine';

/**
 * Where a request pathname is allowed to land inside the build output.
 * Traversal is not a case to weigh at request time: a URL may only ever name
 * a file under the client build, and anything else resolves to nothing.
 */
export const safeJoin = (root: string, pathname: string): string | null => {
  const decoded = decodePathname(pathname);
  if (decoded === null) return null;
  const resolved = path.resolve(root, `.${path.posix.normalize(decoded)}`);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
};
