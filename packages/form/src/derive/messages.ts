import type { ZodType } from 'zod';

import type { FieldInput, ValidityFlag } from '../types';

/**
 * A value chosen to make one specific check fail, paired with the zod issue
 * code that check reports. Probing is what keeps the wording honest: the
 * message the client shows is the one zod itself would have produced, so a
 * custom `min(1, '...')` cannot drift from what the server says.
 */
type Probe = {
  flag: ValidityFlag;
  value: unknown;
  codes: string[];
};

const repeat = (length: number): string => 'a'.repeat(Math.max(length, 0));

const probesFor = (input: FieldInput, required: boolean): Probe[] => {
  const probes: Probe[] = [];

  if (required) {
    // An HTML form submits an untouched text field as '', never as undefined,
    // so probing with undefined would report a type error the user can never
    // actually trigger — and would miss a custom message on `.min(1, '...')`.
    probes.push({
      flag: 'valueMissing',
      value: '',
      codes: ['too_small', 'invalid_type', 'invalid_format'],
    });
  }

  if (input.minLength !== undefined) {
    probes.push({
      flag: 'tooShort',
      value: repeat(input.minLength - 1),
      codes: ['too_small'],
    });
  }
  if (input.maxLength !== undefined) {
    probes.push({
      flag: 'tooLong',
      value: repeat(input.maxLength + 1),
      codes: ['too_big'],
    });
  }

  if (input.type === 'email' || input.type === 'url' || input.type === 'date') {
    probes.push({
      flag: 'typeMismatch',
      value: 'k8ordo-probe',
      codes: ['invalid_format'],
    });
  } else if (input.pattern !== undefined) {
    probes.push({
      flag: 'patternMismatch',
      value: 'k8ordo-probe',
      codes: ['invalid_format'],
    });
  }

  if (input.type === 'number') {
    probes.push({
      flag: 'badInput',
      value: 'k8ordo-probe',
      codes: ['invalid_type'],
    });
    if (typeof input.min === 'number') {
      probes.push({
        flag: 'rangeUnderflow',
        value: input.min - 1,
        codes: ['too_small'],
      });
    }
    if (typeof input.max === 'number') {
      probes.push({
        flag: 'rangeOverflow',
        value: input.max + 1,
        codes: ['too_big'],
      });
    }
    if (input.step === 1) {
      probes.push({
        flag: 'stepMismatch',
        value: 0.5,
        codes: ['invalid_type', 'not_multiple_of'],
      });
    }
  }

  return probes;
};

/**
 * Run each probe through the field's own schema and keep the message zod
 * returns. A probe that unexpectedly passes simply yields no message for that
 * flag — the browser's own wording is never used, since it is locale-dependent
 * and cannot be controlled.
 */
export const messagesFor = (
  schema: ZodType,
  input: FieldInput,
  required: boolean,
): Partial<Record<ValidityFlag, string>> => {
  const messages: Partial<Record<ValidityFlag, string>> = {};

  for (const probe of probesFor(input, required)) {
    const result = schema.safeParse(probe.value);
    if (result.success) {
      continue;
    }
    const issue =
      result.error.issues.find((candidate) =>
        probe.codes.includes(candidate.code),
      ) ?? result.error.issues[0];
    if (issue !== undefined) {
      messages[probe.flag] = issue.message;
    }
  }

  return messages;
};
