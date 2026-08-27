import { renderHook } from 'vitest-browser-react';

import { useInterval } from '.';

describe('useInterval', () => {
  it('指定時間ごとに実行される', async () => {
    const fn = vi.fn<() => void>();
    vi.useFakeTimers();

    await renderHook(() => {
      useInterval(fn, 1000);
    });
    vi.advanceTimersByTime(2000);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('指定時間を過ぎないと実行されない', async () => {
    const fn = vi.fn<() => void>();
    vi.useFakeTimers();

    await renderHook(() => {
      useInterval(fn, 1000);
    });
    vi.advanceTimersByTime(10);

    expect(fn).not.toHaveBeenCalled();
  });

  it('アンマウント後は実行されない', async () => {
    const fn = vi.fn<() => void>();
    vi.useFakeTimers();

    const { unmount } = await renderHook(() => {
      useInterval(fn, 1000);
    });
    unmount();
    vi.advanceTimersByTime(2000);

    expect(fn).not.toHaveBeenCalled();
  });
});
