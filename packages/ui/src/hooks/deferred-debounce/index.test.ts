import { renderHook } from 'vitest-browser-react';

import { useDeferredDebounce } from './index';

describe('useDeferredDebounce', () => {
  it('初期値をそのまま返し isPending は false', async () => {
    const { result } = await renderHook(() => useDeferredDebounce('hello'));

    expect(result.current[0]).toBe('hello');
    expect(result.current[1]).toBe(false);
  });

  it('値が変わるとしばらく前の値を返しつつ isPending が true になる', async () => {
    const { result, rerender } = await renderHook(
      (value = 'initial') => useDeferredDebounce(value),
      { initialProps: 'initial' },
    );

    rerender('updated');

    await vi.waitFor(() => {
      expect(result.current[0]).toBe('updated');
      expect(result.current[1]).toBe(false);
    });
  });

  it('initialValue 指定時も最終的に value に追いつく', async () => {
    const { result } = await renderHook(() =>
      useDeferredDebounce('target', 'fallback'),
    );

    await vi.waitFor(() => {
      expect(result.current[0]).toBe('target');
      expect(result.current[1]).toBe(false);
    });
  });
});
