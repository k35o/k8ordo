import { renderHook } from 'vitest-browser-react';

import { useWindowResize } from '.';

describe('useWindowResize', () => {
  it('windowリサイズ時にコールバックが呼ばれる', async () => {
    const resizedWindowSize = { width: 1000, height: 1000 };

    const callback = vi.fn<(size: { width: number; height: number }) => void>();
    const { act } = await renderHook(() => {
      useWindowResize(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    window.innerWidth = resizedWindowSize.width;
    window.innerHeight = resizedWindowSize.height;

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(callback).toHaveBeenCalledWith(resizedWindowSize);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('enabled=falseの場合はコールバックが呼ばれない', async () => {
    const callback = vi.fn<(size: { width: number; height: number }) => void>();
    await renderHook(() => {
      useWindowResize(callback, { enabled: false });
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
