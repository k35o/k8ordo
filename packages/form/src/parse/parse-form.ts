import { toJSONSchema } from 'zod';
import type { ZodObject } from 'zod';

import type { FormState } from '../types';

type Layout = {
  keys: string[];
  /** Fields whose absence from FormData is normal: an unchecked checkbox. */
  booleans: Set<string>;
  /** Fields that must never be echoed back to the client. */
  secrets: Set<string>;
};

const layouts = new WeakMap<ZodObject, Layout>();

const layoutOf = (schema: ZodObject): Layout => {
  const cached = layouts.get(schema);
  if (cached !== undefined) {
    return cached;
  }

  const json = toJSONSchema(schema, {
    io: 'output',
    unrepresentable: 'any',
  }) as {
    properties?: Record<string, { type?: string; input?: string }>;
  };

  const layout: Layout = {
    keys: Object.keys(json.properties ?? {}),
    booleans: new Set(),
    secrets: new Set(),
  };

  for (const [name, leaf] of Object.entries(json.properties ?? {})) {
    if (leaf.type === 'boolean') {
      layout.booleans.add(name);
    }
    if (leaf.input === 'password') {
      layout.secrets.add(name);
    }
  }

  layouts.set(schema, layout);
  return layout;
};

export type ParseResult<Output, Keys extends string> =
  | { success: true; data: Output; state: FormState<Keys> }
  | { success: false; data?: undefined; state: FormState<Keys> };

/**
 * Turn FormData into the shape the schema expects, then validate it.
 *
 * Only the structural part happens here — an unchecked checkbox arrives as a
 * missing key rather than `false`, a repeated name arrives as several entries,
 * and everything is a string. Converting `'42'` to `42` stays the schema's job
 * via `z.coerce`, so the schema keeps describing what it actually validates.
 */
export const parseForm = <Shape extends ZodObject>(
  schema: Shape,
  formData: FormData,
): ParseResult<ReturnType<Shape['parse']>, keyof Shape['shape'] & string> => {
  type Keys = keyof Shape['shape'] & string;

  const layout = layoutOf(schema);
  const raw: Record<string, unknown> = {};
  const missing: string[] = [];

  for (const key of layout.keys) {
    if (layout.booleans.has(key)) {
      raw[key] = formData.has(key);
      continue;
    }

    const entries = formData.getAll(key);
    if (entries.length === 0) {
      // A text field left empty still submits ''. An absent key means no input
      // carried this name at all — the markup and the schema disagree, which is
      // a wiring mistake rather than something the person filling it in did.
      missing.push(key);
      continue;
    }
    raw[key] = entries.length === 1 ? entries[0] : entries;
  }

  if (missing.length > 0) {
    throw new Error(
      `[@k8ordo/form] スキーマにあるフィールドが送信されていません: ${missing.join(', ')}\n` +
        'input に name が付いていないか、その入力欄が描画されていない可能性があります。',
    );
  }

  const result = schema.safeParse(raw);

  const values: Partial<Record<Keys, string>> = {};
  for (const key of layout.keys) {
    if (layout.secrets.has(key)) {
      continue;
    }
    const value = raw[key];
    if (typeof value === 'string') {
      values[key as Keys] = value;
    }
  }

  if (result.success) {
    return {
      success: true,
      data: result.data as ReturnType<Shape['parse']>,
      state: { values },
    };
  }

  const errors: Partial<Record<Keys, string>> = {};
  let formError: string | undefined;

  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && key in schema.shape) {
      // The first issue per field is the one shown; later ones would push the
      // earlier, usually more fundamental, message out of view.
      errors[key as Keys] ??= issue.message;
    } else {
      formError ??= issue.message;
    }
  }

  return { success: false, state: { errors, values, formError } };
};
