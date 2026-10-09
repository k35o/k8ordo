import path from 'node:path';

/** The deepest directory holding both `a` and `b`. */
export const sharedDir = (a: string, b: string): string => {
  let dir = a;
  while (path.relative(dir, b).startsWith('..')) dir = path.dirname(dir);
  return dir;
};
