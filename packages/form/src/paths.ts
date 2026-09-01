/**
 * Dotted paths derived from a zod object type, so `field('titel')` fails to
 * compile rather than at runtime. Arrays are reached through `array()`, so they
 * are excluded from the field paths and listed separately.
 *
 * A wrapper such as `.optional()` keeps neither `shape` nor `element`, so an
 * optional object is treated as a leaf. Nesting one is rare, and the cost of
 * being wrong is a path that has to be passed as a plain string.
 */

type Join<Prefix extends string, Key extends string> = Prefix extends ''
  ? Key
  : `${Prefix}.${Key}`;

export type FieldPathsOf<Schema, Prefix extends string = ''> = Schema extends {
  element: unknown;
}
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

export type ArrayPathsOf<Schema, Prefix extends string = ''> = Schema extends {
  element: infer Element;
}
  ? Prefix | ArrayPathsOf<Element, Prefix>
  : Schema extends { shape: infer Shape }
    ? {
        [Key in keyof Shape & string]: ArrayPathsOf<
          Shape[Key],
          Join<Prefix, Key>
        >;
      }[keyof Shape & string]
    : never;
