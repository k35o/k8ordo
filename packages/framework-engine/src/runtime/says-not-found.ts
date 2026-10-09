import { isNotFound } from '@k8ordo/router';

import { NOT_FOUND_DIGEST } from './payload';

/**
 * Whether what a boundary caught is `notFound()`: thrown where the browser
 * rendered it, or arrived as the digest the RSC render sent in its place.
 */
export const saysNotFound = (error: unknown): boolean =>
  isNotFound(error) ||
  (typeof error === 'object' &&
    error !== null &&
    (error as { digest?: unknown }).digest === NOT_FOUND_DIGEST);
