import { renderHook } from 'vitest-browser-react';
import { page } from 'vitest/browser';

import { useBreakpoint } from './index';

describe('useBreakpoint', () => {
  it('ブレークポイント以上の幅であればtrueを返す', async () => {
    await page.viewport(800, 600);
    const { result } = await renderHook(() => useBreakpoint('sm'));

    expect(result.current).toBe(true);
  });

  it('ブレークポイント未満の幅であればfalseを返す', async () => {
    await page.viewport(600, 400);
    const { result } = await renderHook(() => useBreakpoint('sm'));

    expect(result.current).toBe(false);
  });

  it('メディアクエリの変更に応じて値が更新される', async () => {
    await page.viewport(600, 400);
    const { result } = await renderHook(() => useBreakpoint('sm'));

    expect(result.current).toBe(false);

    await page.viewport(800, 600);
    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
