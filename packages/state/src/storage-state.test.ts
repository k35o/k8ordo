import { z } from 'zod';

import { defineMemoryState } from './memory-state';
import { defineLocalState, defineSessionState } from './storage-state';

const storageWith = (
  rows: Record<string, string>,
): Pick<Storage, 'getItem'> => ({
  getItem: (key) => rows[key] ?? null,
});

/**
 * Plays the browser: evaluates the inline expression with `localStorage` and
 * `sessionStorage` bound to fakes, the way an inline `<script>` would see the
 * real ones.
 */
const evaluateInline = (
  expression: string,
  storage: Pick<Storage, 'getItem'>,
  session: Pick<Storage, 'getItem'> = storageWith({}),
): unknown => {
  // oxlint-disable-next-line no-new-func, no-implied-eval -- the expression under test is generated source; evaluating it is the test
  const read = new Function(
    'localStorage',
    'sessionStorage',
    `return ${expression};`,
  ) as (
    storage: Pick<Storage, 'getItem'>,
    session: Pick<Storage, 'getItem'>,
  ) => unknown;
  return read(storage, session);
};

describe('defineLocalState', () => {
  it('applies the absence rule to local fields too', () => {
    expect(() =>
      defineLocalState('strict-local', z.object({ view: z.string() })),
    ).toThrow(/local fields.*view/u);
  });

  it('exposes the storage key the store writes under', () => {
    const theme = defineLocalState(
      'theme',
      z.object({ mode: z.enum(['light', 'dark']).optional() }),
    );
    expect(theme.storageKey).toBe('k8ordo-state:theme');
  });
});

describe('inlineRead', () => {
  const theme = defineLocalState(
    'theme',
    z.object({ mode: z.enum(['light', 'dark']).optional() }),
  );

  it('evaluates to the stored object before hydration', () => {
    const stored = storageWith({
      [theme.storageKey]: JSON.stringify({ mode: 'dark' }),
    });
    expect(evaluateInline(theme.inlineRead(), stored)).toStrictEqual({
      mode: 'dark',
    });
  });

  it('evaluates to null when nothing is stored', () => {
    expect(evaluateInline(theme.inlineRead(), storageWith({}))).toBeNull();
  });

  it('evaluates to null instead of throwing on corrupt JSON', () => {
    const stored = storageWith({ [theme.storageKey]: '{"mode":' });
    expect(evaluateInline(theme.inlineRead(), stored)).toBeNull();
  });

  it('evaluates to null when the stored JSON is not an object', () => {
    for (const text of ['5', '"dark"', 'null', '["dark"]']) {
      const stored = storageWith({ [theme.storageKey]: text });
      expect(evaluateInline(theme.inlineRead(), stored)).toBeNull();
    }
  });

  it('evaluates to null when storage itself cannot be read', () => {
    const blocked: Pick<Storage, 'getItem'> = {
      getItem: () => {
        throw new DOMException('denied', 'SecurityError');
      },
    };
    expect(evaluateInline(theme.inlineRead(), blocked)).toBeNull();
  });

  it('is usable as an expression in any position', () => {
    const stored = storageWith({
      [theme.storageKey]: JSON.stringify({ mode: 'dark' }),
    });
    const mode = evaluateInline(
      `(${theme.inlineRead()} ?? { mode: 'light' }).mode`,
      stored,
    );
    expect(mode).toBe('dark');
  });

  it('escapes the key so no key can break the literal or close the script', () => {
    const odd = defineLocalState(
      'a"b\\c</script><d',
      z.object({ n: z.number().default(0) }),
    );
    const expression = odd.inlineRead();
    expect(expression).not.toContain('</script>');
    expect(expression).not.toContain('<');
    const stored = storageWith({ [odd.storageKey]: JSON.stringify({ n: 3 }) });
    expect(evaluateInline(expression, stored)).toStrictEqual({ n: 3 });
  });
});

describe('defineSessionState', () => {
  const draft = defineSessionState(
    'draft',
    z.object({ step: z.number().default(1) }),
  );

  it('applies the absence rule to session fields too', () => {
    expect(() =>
      defineSessionState('strict-session', z.object({ step: z.number() })),
    ).toThrow(/session fields.*step/u);
  });

  it('exposes the storage key the store writes under', () => {
    expect(draft.storageKey).toBe('k8ordo-state:draft');
  });

  it('reads sessionStorage before hydration, never localStorage', () => {
    const row = { [draft.storageKey]: JSON.stringify({ step: 3 }) };

    expect(
      evaluateInline(draft.inlineRead(), storageWith({}), storageWith(row)),
    ).toStrictEqual({ step: 3 });
    expect(
      evaluateInline(draft.inlineRead(), storageWith(row), storageWith({})),
    ).toBeNull();
  });
});

describe('defineMemoryState', () => {
  it('detaches the definition from the initial-values object it was given', () => {
    const initial = { open: false };
    const def = defineMemoryState('detached', initial);
    initial.open = true;
    expect(def.initial.open).toBe(false);
  });
});
