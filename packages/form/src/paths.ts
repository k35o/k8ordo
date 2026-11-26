/**
 * Dotted paths derived from a zod object type, so `field('titel')` fails to
 * compile rather than at runtime. Arrays of objects are reached through
 * `array()`, so they are excluded from the field paths and listed separately —
 * except an array of enums, which is a checkbox group: one shared name, so it
 * is a field.
 *
 * Wrappers (`.optional()`, `.nullable()`, `.default()`, …) are peeled the same
 * way the runtime walk peels them, so the two advertise the same paths — except
 * where the walk refuses the schema outright, as it does a nullable object.
 */

import type {
  CheckboxGroupInput,
  CheckboxInput,
  FieldInput,
  FileInput,
  NumberInput,
  StringCheckboxInput,
} from './types';

type Join<Prefix extends string, Key extends string> = Prefix extends ''
  ? Key
  : `${Prefix}.${Key}`;

/**
 * Wrappers keep their inner schema on the shared core definition; following it
 * here mirrors what the runtime walk does with `_zod.def.innerType`.
 */
type Unwrap<Schema> = Schema extends {
  _zod: { def: { innerType: infer Inner } };
}
  ? Unwrap<Inner>
  : Schema;

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

/** Enums carry `entries` on the core definition, in both zod entries. */
type IsEnum<Schema> =
  Unwrap<Schema> extends {
    _zod: { def: { entries: infer _Entries } };
  }
    ? true
    : false;

/**
 * Each field path paired with the type of its `input`. One walk yields both,
 * so the paths `field()` accepts and the inputs it returns cannot disagree.
 */
type FieldEntriesOf<Schema, Prefix extends string = ''> =
  Unwrap<Schema> extends infer Bare
    ? IsArray<Bare> extends true
      ? IsEnum<ArrayElement<Bare>> extends true
        ? [Prefix, CheckboxGroupInput]
        : never
      : Bare extends { shape: infer Shape }
        ? {
            [Key in keyof Shape & string]: FieldEntriesOf<
              Shape[Key],
              Join<Prefix, Key>
            >;
          }[keyof Shape & string]
        : [Prefix, LeafInputOf<Schema>]
    : never;

export type FieldPathsOf<Schema> = FieldEntriesOf<Schema>[0];

export type FieldInputsOf<Schema> = {
  [Entry in FieldEntriesOf<Schema> as Entry[0]]: Entry[1];
};

/**
 * No recursion into an array's element: a repeat inside a repeat has no
 * unambiguous name, and the runtime walk refuses it too.
 */
type ArrayEntriesOf<Schema, Prefix extends string = ''> =
  Unwrap<Schema> extends infer Bare
    ? IsArray<Bare> extends true
      ? IsEnum<ArrayElement<Bare>> extends true
        ? never
        : Prefix extends ''
          ? never
          : [Prefix, FieldInputsOf<ArrayElement<Bare>>]
      : Bare extends { shape: infer Shape }
        ? {
            [Key in keyof Shape & string]: ArrayEntriesOf<
              Shape[Key],
              Join<Prefix, Key>
            >;
          }[keyof Shape & string]
        : never
    : never;

export type ArrayInputsOf<Schema> = {
  [Entry in ArrayEntriesOf<Schema> as Entry[0]]: Entry[1];
};

/**
 * The one control whose `input` carries a `value` is a checkbox whose schema
 * reads the submitted string (`z.stringbool()`). The runtime walk finds it by
 * encoding `true`, which takes a codec; the type sees the same codec as a
 * string on its way in and a boolean on its way out. The string is read off
 * the codec's inner schema because `zod/mini` leaves the codec's own input
 * `unknown`.
 */
type EncodesTrueAsString<Schema> = Schema extends {
  _zod: {
    output: infer Output;
    def: { in: { _zod: { output: infer In } }; reverseTransform: unknown };
  };
}
  ? [In] extends [string]
    ? [Output] extends [boolean]
      ? true
      : false
    : false
  : false;

/**
 * `Unwrap` without `.nullable()`, which turns a leaf's JSON node into a union
 * and so the control into a bare text input — the leaf no longer derives the
 * control its own type names.
 */
type UnwrapLeaf<Schema> = Schema extends {
  _zod: { def: { type: 'nullable' } };
}
  ? Schema
  : Schema extends { _zod: { def: { innerType: infer Inner } } }
    ? UnwrapLeaf<Inner>
    : Schema;

type InputOfType<Type> = [Type] extends ['number']
  ? NumberInput
  : [Type] extends ['boolean']
    ? CheckboxInput
    : [Type] extends ['file']
      ? FileInput
      : FieldInput;

type LeafInputOf<Schema> =
  UnwrapLeaf<Schema> extends infer Leaf
    ? EncodesTrueAsString<Leaf> extends true
      ? StringCheckboxInput
      : Leaf extends { _zod: { def: { type: infer Type } } }
        ? InputOfType<Type>
        : FieldInput
    : never;
