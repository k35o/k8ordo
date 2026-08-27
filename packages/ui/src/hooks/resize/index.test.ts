import { renderHook } from 'vitest-browser-react';

import { useResize } from '.';

describe('useResize', () => {
  it('要素のリサイズ時にコールバックが呼ばれる', async () => {
    const callback = vi.fn<(entry: ResizeObserverEntry) => void>();
    const div = document.createElement('div');
    document.body.append(div);
    const ref = { current: div };

    await renderHook(() => {
      useResize(ref, callback);
    });

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalled();
    });

    div.remove();
  });

  it('enabled=falseの場合はコールバックが呼ばれない', async () => {
    const callback = vi.fn<(entry: ResizeObserverEntry) => void>();
    const ref = { current: document.createElement('div') };
    await renderHook(() => {
      useResize(ref, callback, { enabled: false });
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
