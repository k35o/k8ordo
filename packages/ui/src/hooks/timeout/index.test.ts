import { renderHook } from 'vitest-browser-react';

import { useTimeout } from '.';

describe('useTimeout', () => {
  it('指定時間後に実行される', async () => {
    const fn = vi.fn<() => void>();
    vi.useFakeTimers();

    await renderHook(() => {
      useTimeout(fn, 1000);
    });
    vi.advanceTimersByTime(1000);

    expect(fn).toHaveBeenCalledOnce();
  });

  it('指定時間前に実行されない', async () => {
    const fn = vi.fn<() => void>();
    vi.useFakeTimers();

    await renderHook(() => {
      useTimeout(fn, 1000);
    });
    vi.advanceTimersByTime(10);

    expect(fn).not.toHaveBeenCalled();
  });

  it('指定時間前にアンマウントされない場合は実行されない', async () => {
    const fn = vi.fn<() => void>();
    vi.useFakeTimers();

    const { unmount } = await renderHook(() => {
      useTimeout(fn, 1000);
    });
    unmount();

    expect(fn).not.toHaveBeenCalled();
  });
});
