import { describe, expect, it } from 'vite-plus/test';

import {
  colorSchemeScriptHash,
  colorSchemeState,
  resolve,
  scriptFor,
} from './scheme';

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
    expect(scriptFor()).toContain(colorSchemeState.storageKey);
    expect(scriptFor({ defaultPreference: 'dark' })).toContain('"dark"');
    expect(colorSchemeState.storageKey).toBe('k8ordo-state:color-scheme');
  });
});

describe('colorSchemeScriptHash', () => {
  it('depends on the theme colours, not on the order they are given in', async () => {
    const lightFirst = await colorSchemeScriptHash({
      themeColor: { light: '#fafafa', dark: '#18181b' },
    });
    const darkFirst = await colorSchemeScriptHash({
      themeColor: { dark: '#18181b', light: '#fafafa' },
    });

    expect(darkFirst).toBe(lightFirst);
    expect(lightFirst).not.toBe(await colorSchemeScriptHash());
  });
});
