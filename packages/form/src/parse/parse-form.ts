import type { output } from 'zod/v4/core';

import { asDefinition } from '../rules/define-form';
import type { FormDefinition } from '../rules/define-form';
import { breachOf } from '../rules/rules';
import { asProbe } from '../schema/object-schema';
import type { ObjectSchema } from '../schema/object-schema';
import { INDEX, schemaMap } from '../schema/walk';
import type { ArrayNode } from '../schema/walk';
import type { FormState } from '../types';
import { nameOf, setPath } from './paths';

export type ParseResult<Output> =
  | { success: true; data: Output; state: FormState }
  | { success: false; data?: undefined; state: FormState };

/**
 * The submitted names are the only source for row counts, and anyone can POST
 * anything: without a ceiling, one forged `items[99999999].name` key makes the
 * reconstruction allocate an array that long before the schema ever runs.
 * Arrays with a `.max()` are capped there; this bounds the rest.
 */
const MAX_ROWS = 1000;

/** How many rows each array actually received, read from the submitted names. */
const rowCounts = (
  formData: FormData,
  arrays: ArrayNode[],
): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const array of arrays) {
    const cap = Math.min(array.maxItems ?? MAX_ROWS, MAX_ROWS);
    let highest = -1;
    for (const key of formData.keys()) {
      if (!key.startsWith(`${array.path}[`)) {
        continue;
      }
      const index = Number(
        key.slice(array.path.length + 1, key.indexOf(']', array.path.length)),
      );
      if (Number.isInteger(index) && index > highest) {
        highest = index;
      }
    }
    counts[array.path] = Math.min(highest + 1, cap);
  }
  return counts;
};

const describeMissing = (missing: string[]): string => {
  const shown = missing.slice(0, 5).join(', ');
  return missing.length > 5
    ? `${shown} … ほか${String(missing.length - 5)}件`
    : shown;
};

/**
 * Turn FormData into the shape the schema expects, then validate it.
 *
 * Only the structural part happens here — an unchecked checkbox arrives as a
 * missing key, a repeated name arrives as several entries, names carry their
 * nesting, and everything is a string. Converting `'42'` to `42` stays the
 * schema's job via `z.coerce`, so the schema keeps describing what it
 * actually validates.
 */
export const parseForm = <Shape extends ObjectSchema>(
  input: FormDefinition<Shape> | Shape,
  formData: FormData,
): ParseResult<output<Shape>> => {
  const { schema, rules } = asDefinition(input);
  const map = schemaMap(schema);
  const raw: Record<string, unknown> = {};
  const missing: string[] = [];
  const secrets = new Set<string>();

  const rows = rowCounts(formData, map.arrays);

  for (const array of map.arrays) {
    setPath(raw, array.path, Array.from({ length: rows[array.path] ?? 0 }));
  }

  const strings = (name: string): string[] =>
    formData.getAll(name).filter((value) => typeof value === 'string');

  for (const leaf of map.leaves) {
    const names =
      leaf.arrayPath === null
        ? [leaf.name]
        : Array.from({ length: rows[leaf.arrayPath] ?? 0 }, (_, index) =>
            leaf.name.replace(INDEX, String(index)),
          );

    for (const name of names) {
      if (leaf.json.input === 'password') {
        secrets.add(name);
      }

      if (leaf.group !== undefined) {
        // A checkbox group: every checked box appends one entry under the
        // shared name, and none checked means no entry at all.
        setPath(raw, name, strings(name));
        continue;
      }

      if (leaf.json.type === 'boolean') {
        setPath(raw, name, formData.has(name));
        continue;
      }

      const entries = formData.getAll(name);
      if (entries.length === 0) {
        if (leaf.json.enum !== undefined) {
          // A radio group with nothing selected submits no entry — a state
          // the person filling in the form can reach, unlike a text control,
          // which always submits at least ''. The schema reports it as a
          // validation error instead.
          continue;
        }
        // A text field left empty still submits ''. An absent key means no
        // input carried this name at all — the markup and the schema disagree,
        // which is a wiring mistake rather than something the person filling it
        // in did.
        missing.push(name);
        continue;
      }
      setPath(raw, name, entries.length === 1 ? entries[0] : entries);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[@k8ordo/form] スキーマにあるフィールドが送信されていません: ${describeMissing(missing)}\n` +
        'input に name が付いていないか、その入力欄が描画されていない可能性があります。',
    );
  }

  const result = asProbe(schema).safeParse(raw);

  // Evaluated against the submitted values, exactly as the browser evaluates
  // them against the live form. Same function, same inputs, same verdict.
  const breaches: Record<string, string> = {};
  for (const rule of rules) {
    const message = breachOf(rule, strings);
    if (message !== undefined) {
      breaches[rule.field] = message;
    }
  }

  const values: Record<string, string> = {};
  for (const [name, value] of formData.entries()) {
    if (typeof value === 'string' && !secrets.has(name)) {
      values[name] = value;
    }
  }

  if (result.success && Object.keys(breaches).length === 0) {
    return {
      success: true,
      data: result.data as output<Shape>,
      state: { values, rows },
    };
  }

  const errors: Record<string, string> = { ...breaches };
  let formError: string | undefined;

  for (const issue of result.error?.issues ?? []) {
    const name = nameOf(issue.path);
    if (name === '') {
      formError ??= issue.message;
    } else {
      // The first issue per field is the one shown; later ones would push the
      // earlier, usually more fundamental, message out of view.
      errors[name] ??= issue.message;
    }
  }

  return { success: false, state: { errors, values, rows, formError } };
};
