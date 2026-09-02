/**
 * Checks HTML has no attribute for. They are plain data so they cross to the
 * client with everything else, and both sides run the same evaluator against
 * the same values — the client reading the live form, the server reading the
 * submission. One declaration, two consumers, no second implementation to
 * drift from the first.
 *
 * `Field` is the set of paths the schema actually has: `defineForm` supplies
 * it, so a typo in a field name fails to compile instead of producing a rule
 * that never fires.
 */
export type Rule<Field extends string = string> =
  | { kind: 'sameAs'; field: Field; other: Field; message: string }
  | { kind: 'minChecked'; field: Field; min: number; message: string }
  | {
      kind: 'requiredWhen';
      field: Field;
      when: Field;
      equals: string;
      message: string;
    };

/** Reads the current values of a name, however many controls carry it. */
export type Values = (name: string) => string[];

/** The value must equal another field's. Password confirmation, and the like. */
export const sameAs = <Field extends string>(
  field: Field,
  other: Field,
  message: string,
): Rule<Field> => ({ kind: 'sameAs', field, other, message });

/** At least `min` boxes sharing this name must be checked. */
export const minChecked = <Field extends string>(
  field: Field,
  min: number,
  message: string,
): Rule<Field> => ({ kind: 'minChecked', field, min, message });

/** Required only while another field holds a particular value. */
export const requiredWhen = <Field extends string>(
  field: Field,
  when: Field,
  equals: string,
  message: string,
): Rule<Field> => ({ kind: 'requiredWhen', field, when, equals, message });

const first = (values: Values, name: string): string => values(name)[0] ?? '';

/** The message when the rule is broken, or undefined when it holds. */
export const breachOf = (rule: Rule, values: Values): string | undefined => {
  switch (rule.kind) {
    case 'sameAs':
      return first(values, rule.field) === first(values, rule.other)
        ? undefined
        : rule.message;
    case 'minChecked':
      return values(rule.field).length >= rule.min ? undefined : rule.message;
    case 'requiredWhen':
      return first(values, rule.when) === rule.equals &&
        first(values, rule.field) === ''
        ? rule.message
        : undefined;
    default:
      return undefined;
  }
};
