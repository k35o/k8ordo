/**
 * Checks HTML has no attribute for. They are plain data so they cross to the
 * client with everything else, and both sides run the same evaluator against
 * the same values — the client reading the live form, the server reading the
 * submission. One declaration, two consumers, no second implementation to
 * drift from the first.
 */
export type Rule =
  | { kind: 'sameAs'; field: string; other: string; message: string }
  | { kind: 'minChecked'; field: string; min: number; message: string }
  | {
      kind: 'requiredWhen';
      field: string;
      when: string;
      equals: string;
      message: string;
    };

/** Reads the current values of a name, however many controls carry it. */
export type Values = (name: string) => string[];

/** The value must equal another field's. Password confirmation, and the like. */
export const sameAs = (
  field: string,
  other: string,
  message: string,
): Rule => ({ kind: 'sameAs', field, other, message });

/** At least `min` boxes sharing this name must be checked. */
export const minChecked = (
  field: string,
  min: number,
  message: string,
): Rule => ({ kind: 'minChecked', field, min, message });

/** Required only while another field holds a particular value. */
export const requiredWhen = (
  field: string,
  when: string,
  equals: string,
  message: string,
): Rule => ({ kind: 'requiredWhen', field, when, equals, message });

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
