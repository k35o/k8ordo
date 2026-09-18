/**
 * A route file's `paramsSchema` export, in the one shape every validation library
 * agrees on (Standard Schema). The framework runs it; the router only types
 * what comes out. Only the synchronous half is honoured: a matcher decides
 * which pattern answers a pathname before anything renders, and nothing
 * asynchronous belongs in that decision.
 */
export type ParamsSchema = {
  readonly '~standard': {
    readonly validate: (
      value: unknown,
    ) => StandardResult | Promise<StandardResult>;
  };
};

type StandardResult =
  | { readonly value: unknown; readonly issues?: undefined }
  | { readonly issues: readonly unknown[] };

/**
 * Runs the schemas along a matched stack — outer layouts first, the page
 * last — over the raw params, each replacing the strings it names with what
 * it produced. `null` means some schema refused, which is the pattern not
 * answering this pathname at all.
 */
export const parseParams = (
  schemas: readonly ParamsSchema[],
  raw: Readonly<Record<string, string>>,
): Readonly<Record<string, unknown>> | null => {
  const current: Record<string, unknown> = { ...raw };
  for (const schema of schemas) {
    const result = schema['~standard'].validate(current);
    if (result instanceof Promise) {
      throw new TypeError(
        'a params schema must validate synchronously — which pattern answers a pathname is decided before anything renders',
      );
    }
    if (result.issues !== undefined) return null;
    // A schema names only the params it validates (an object schema strips
    // the rest), so the ones it did not mention keep their strings.
    if (typeof result.value === 'object' && result.value !== null) {
      Object.assign(current, result.value);
    }
  }
  return current;
};
