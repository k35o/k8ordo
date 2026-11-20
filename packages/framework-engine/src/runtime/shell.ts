import type { Match } from '@k8ordo/router';

import { FALLBACK_SEGMENT } from './pathname';

/**
 * The params a shell request fills — `null` when this is not one: no param
 * holds the reserved segment, or one that does is not open.
 */
export const shellParams = (
  params: Match['params'],
  open: readonly string[],
): Match['params'] | null => {
  const left = Object.keys(params).filter(
    (name) => params[name] === FALLBACK_SEGMENT,
  );
  if (left.length === 0 || left.some((name) => !open.includes(name))) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== FALLBACK_SEGMENT),
  );
};
