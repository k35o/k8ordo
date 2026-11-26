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
export type Rule<Field extends string = string> = RuleOf<Field, RuleMessage>;

/**
 * The text a broken rule reports, or a function returning it. Like zod's
 * `{ error: () => … }`, the function is called when the rule is reported —
 * `formFields` calls it as it derives the fields, `parseForm` when a rule
 * breaks — so a message that follows the request (its locale, say) is
 * declared once and read in whichever request reports it.
 */
export type RuleMessage = string | (() => string);

/**
 * A rule as it crosses to the client. A function cannot cross the RSC
 * boundary, so `formFields` has already called it. Besides the declared rules,
 * `formFields` adds the count a checkbox group's array schema allows
 * (`.min()` / `.max()`), worded by zod.
 */
export type DerivedRule =
  | RuleOf<string, string>
  | { kind: 'minChecked'; field: string; min: number; message: string }
  | { kind: 'maxChecked'; field: string; max: number; message: string };

type RuleOf<Field extends string, Message> =
  | { kind: 'sameAs'; field: Field; other: Field; message: Message }
  | {
      kind: 'requiredWhen';
      field: Field;
      when: Field;
      equals: string;
      message: Message;
    };

/** Reads the current values of a name, however many controls carry it. */
export type Values = (name: string) => string[];

/** The value must equal another field's. Password confirmation, and the like. */
export const sameAs = <Field extends string>(
  field: Field,
  other: Field,
  message: RuleMessage,
): Rule<Field> => ({ kind: 'sameAs', field, other, message });

/** Required only while another field holds a particular value. */
export const requiredWhen = <Field extends string>(
  field: Field,
  when: Field,
  equals: string,
  message: RuleMessage,
): Rule<Field> => ({ kind: 'requiredWhen', field, when, equals, message });

const first = (values: Values, name: string): string => values(name)[0] ?? '';

const holds = (rule: Rule | DerivedRule, values: Values): boolean => {
  switch (rule.kind) {
    case 'sameAs':
      return first(values, rule.field) === first(values, rule.other);
    case 'minChecked':
      return values(rule.field).length >= rule.min;
    case 'maxChecked':
      return values(rule.field).length <= rule.max;
    case 'requiredWhen':
      return (
        first(values, rule.when) !== rule.equals ||
        first(values, rule.field) !== ''
      );
  }
};

const textOf = (message: RuleMessage): string =>
  typeof message === 'function' ? message() : message;

/** The rule with its message called, ready to cross to the client. */
export const deriveRule = (rule: Rule): DerivedRule => ({
  ...rule,
  message: textOf(rule.message),
});

/** The message when the rule is broken, or undefined when it holds. */
export const breachOf = (
  rule: Rule | DerivedRule,
  values: Values,
): string | undefined =>
  holds(rule, values) ? undefined : textOf(rule.message);
