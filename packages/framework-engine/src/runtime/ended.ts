import { isNotFound } from '@k8ordo/router';

import { Redirect, redirectResponse } from './redirect';

/**
 * A guard or a route.ts that said `notFound()`: the handler answers with the
 * nearest not-found.tsx, under 404, as for a URL nothing answers.
 */
export const SAID_NOT_FOUND = Symbol('notFound()');

export type SaidNotFound = typeof SAID_NOT_FOUND;

export const endedBy = (error: unknown): Response | SaidNotFound => {
  if (error instanceof Redirect) return redirectResponse(error.to, 303);
  if (isNotFound(error)) return SAID_NOT_FOUND;
  throw error;
};
