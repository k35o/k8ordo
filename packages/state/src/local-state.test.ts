import { z } from 'zod';

import { defineLocalState } from './local-state';
import { defineMemoryState } from './memory-state';

describe('defineLocalState', () => {
  it('applies the absence rule to local fields too', () => {
    expect(() =>
      defineLocalState('strict-local', z.object({ view: z.string() })),
    ).toThrow(/local fields.*view/u);
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
