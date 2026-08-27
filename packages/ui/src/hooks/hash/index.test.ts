import { renderHook } from 'vitest-browser-react';

import { useHash } from '.';

vi.mock('../client', () => ({
  useClient: () => true,
}));

describe('useHash', () => {
  const realHash = window.location.hash;
  beforeEach(() => {
    window.location.hash = '#test';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = realHash;
  });

  it('現在のhash値を取得できる', async () => {
    const { result } = await renderHook(() => useHash());

    expect(result.current).toBe('test');
  });

  it('hash値が変更されたときに更新される', async () => {
    const { result, act } = await renderHook(() => useHash());

    act(() => {
      window.location.hash = '#changed';
      window.dispatchEvent(new Event('hashchange'));
    });

    expect(result.current).toBe('changed');
  });

  it('pushStateでhash値が変更されたときに更新される', async () => {
    const { result, act } = await renderHook(() => useHash());

    act(() => {
      window.history.pushState({}, '', '/#pushed');
    });

    await vi.waitFor(() => {
      expect(result.current).toBe('pushed');
    });
  });

  it('replaceStateでhash値が変更されたときに更新される', async () => {
    const { result, act } = await renderHook(() => useHash());

    act(() => {
      window.history.replaceState({}, '', '/#replaced');
    });

    await vi.waitFor(() => {
      expect(result.current).toBe('replaced');
    });
  });
});
