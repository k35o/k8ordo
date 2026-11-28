import type { $ZodObject, $ZodShape } from 'zod/v4/core';

/**
 * The common ground between `zod` and `zod/mini`: both build on the shared core
 * object and both expose `shape`. Accepting this instead of the classic
 * `ZodObject` is what lets a caller pick the seven-times-smaller entry without
 * losing the types.
 */
export type ObjectSchema<Shape extends $ZodShape = $ZodShape> =
  $ZodObject<Shape> & { shape: Shape };
