import type { $ZodObject, $ZodShape, $ZodType } from 'zod/v4/core';

/**
 * The common ground between `zod` and `zod/mini`: both build on the shared core
 * object and both expose `shape`. Accepting this instead of the classic
 * `ZodObject` is what lets a caller pick the seven-times-smaller entry without
 * losing the types.
 */
export type ObjectSchema<Shape extends $ZodShape = $ZodShape> =
  $ZodObject<Shape> & { shape: Shape };

export type ProbeIssue = {
  code: string;
  message: string;
  path: readonly PropertyKey[];
};

/** What probing needs, present on both entries but not on the core type. */
export type ProbeSchema = $ZodType & {
  safeParse: (value: unknown) =>
    | { success: true; data: unknown; error?: undefined }
    | {
        success: false;
        data?: undefined;
        error: { issues: readonly ProbeIssue[] };
      };
};

export const asProbe = (schema: $ZodType): ProbeSchema => schema as ProbeSchema;
