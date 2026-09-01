/**
 * Dotted paths derived from a zod object type, so `field('titel')` fails to
 * compile rather than at runtime. Arrays are reached through `array()`, so they
 * are excluded from the field paths and listed separately.
 *
 * A wrapper such as `.optional()` keeps neither `shape` nor an array element,
 * so an optional object is treated as a leaf. Nesting one is rare, and the cost
 * of being wrong is a path that has to be passed as a plain string.
 */

type Join<Prefix extends string, Key extends string> = Prefix extends ''
  ? Key
  : `${Prefix}.${Key}`;

/**
 * `zod/mini` arrays carry the element only on the shared core definition, so
 * this is the one shape that matches both entries. Objects expose `shape`
 * publicly on both and are matched there.
 */
type ArrayElement<Schema> = Schema extends {
  _zod: { def: { element: infer Element } };
}
  ? Element
  : never;

type IsArray<Schema> = [ArrayElement<Schema>] extends [never] ? false : true;

export type FieldPathsOf<Schema, Prefix extends string = ''> =
  IsArray<Schema> extends true
    ? never
    : Schema extends { shape: infer Shape }
      ? {
          [Key in keyof Shape & string]: FieldPathsOf<
            Shape[Key],
            Join<Prefix, Key>
          >;
        }[keyof Shape & string]
      : Prefix extends ''
        ? never
        : Prefix;

export type ArrayPathsOf<Schema, Prefix extends string = ''> =
  IsArray<Schema> extends true
    ? Prefix | ArrayPathsOf<ArrayElement<Schema>, Prefix>
    : Schema extends { shape: infer Shape }
      ? {
          [Key in keyof Shape & string]: ArrayPathsOf<
            Shape[Key],
            Join<Prefix, Key>
          >;
        }[keyof Shape & string]
      : never;
