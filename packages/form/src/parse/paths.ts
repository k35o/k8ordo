/** One step of a name: an object key, or an array index. */
type Step = { key: string } | { index: number };

const STEP = /([^.[\]]+)|\[(\d+)\]/gu;

/** Split `items[1].name` into its steps. */
export const stepsOf = (name: string): Step[] => {
  const steps: Step[] = [];
  for (const match of name.matchAll(STEP)) {
    const [, key, index] = match;
    if (key !== undefined) {
      steps.push({ key });
    } else if (index !== undefined) {
      steps.push({ index: Number(index) });
    }
  }
  return steps;
};

/**
 * Write a value at a dotted/indexed path, creating the objects and arrays the
 * path implies. Gaps in an array stay holes rather than shifting later rows
 * onto earlier indexes, so a row removed on the client cannot silently
 * renumber the rows that follow.
 */
export const setPath = (
  root: Record<string, unknown>,
  name: string,
  value: unknown,
): void => {
  const steps = stepsOf(name);
  if (steps.length === 0) {
    return;
  }

  let cursor: Record<string, unknown> | unknown[] = root;

  for (const [position, step] of steps.entries()) {
    const last = position === steps.length - 1;
    const next = steps[position + 1];
    const container = next !== undefined && 'index' in next ? [] : {};

    if ('index' in step) {
      const list = cursor as unknown[];
      if (last) {
        list[step.index] = value;
      } else {
        list[step.index] ??= container;
        cursor = list[step.index] as Record<string, unknown> | unknown[];
      }
      continue;
    }

    const record = cursor as Record<string, unknown>;
    if (last) {
      record[step.key] = value;
    } else {
      record[step.key] ??= container;
      cursor = record[step.key] as Record<string, unknown> | unknown[];
    }
  }
};

/** Turn a zod issue path into the `name` of the input that produced it. */
export const nameOf = (path: readonly PropertyKey[]): string => {
  let name = '';
  for (const segment of path) {
    if (typeof segment === 'number') {
      name += `[${String(segment)}]`;
    } else {
      name += name === '' ? String(segment) : `.${String(segment)}`;
    }
  }
  return name;
};
