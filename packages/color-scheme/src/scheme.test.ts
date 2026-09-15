import { colorSchemeState, resolve, scriptFor } from './scheme';

describe('resolve', () => {
  it('lets a stated preference win, then the default, then the system', () => {
    expect(resolve('dark', 'system', false)).toBe('dark');
    expect(resolve('light', 'dark', true)).toBe('light');
    expect(resolve(undefined, 'dark', false)).toBe('dark');
    expect(resolve(undefined, 'light', true)).toBe('light');
    expect(resolve(undefined, 'system', true)).toBe('dark');
    expect(resolve(undefined, 'system', false)).toBe('light');
  });
});

describe('scriptFor', () => {
  it('reads the same row the provider writes, and carries the default', () => {
    expect(scriptFor('system')).toContain(colorSchemeState.storageKey);
    expect(scriptFor('dark')).toContain('"dark"');
    expect(colorSchemeState.storageKey).toBe('k8ordo-state:color-scheme');
  });
});
