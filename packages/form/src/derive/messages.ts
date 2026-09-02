import type { $ZodType } from 'zod/v4/core';

import { asProbe } from '../schema/object-schema';
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
    // The probe is what the parse would hand the schema for an untouched
    // control: '' for a text field (never undefined — a form always submits
    // something), false for a checkbox. Probing anything else reports a type
    // error the user can never actually trigger — and misses a custom message
    // on `.min(1, '...')` or `.literal(true, '...')`.
    probes.push(
      input.type === 'checkbox'
        ? {
            flag: 'valueMissing',
            value: false,
            codes: ['invalid_value', 'invalid_type'],
          }
        : {
            flag: 'valueMissing',
            value: '',
            codes: ['too_small', 'invalid_type', 'invalid_format'],
          },
    );
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
    if (typeof input.step === 'number') {
      // The probe must fail the step check and nothing before it: a failed
      // `.int()` aborts zod's later checks, so for an integer step the probe
      // stays an integer, just off the grid. Step 1 can only be missed by a
      // non-integer.
      probes.push({
        flag: 'stepMismatch',
        value:
          input.step === 1
            ? 0.5
            : Number.isInteger(input.step)
              ? input.step + 1
              : input.step / 2,
        codes: ['not_multiple_of', 'invalid_type'],
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
  schema: $ZodType,
  input: FieldInput,
  required: boolean,
): Partial<Record<ValidityFlag, string>> => {
  const messages: Partial<Record<ValidityFlag, string>> = {};

  for (const probe of probesFor(input, required)) {
    const result = asProbe(schema).safeParse(probe.value);
    if (result.success) {
      continue;
    }
    // A probe can trip several checks at once (2.5 is both a non-integer and
    // off the multiple-of grid); the codes are listed most-specific first.
    const issue =
      probe.codes
        .map((code) =>
          result.error.issues.find((candidate) => candidate.code === code),
        )
        .find((found) => found !== undefined) ?? result.error.issues[0];
    if (issue !== undefined) {
      messages[probe.flag] = issue.message;
    }
  }

  return messages;
};
