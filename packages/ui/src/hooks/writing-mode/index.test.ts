import { renderHook } from 'vitest-browser-react';

import { useWritingMode } from '.';

describe('useWritingMode', () => {
  it('writing-mode が horizontal のときは "horizontal" を返す', async () => {
    const div = document.createElement('div');
    div.style.writingMode = 'horizontal-tb';
    document.body.append(div);
    const ref = { current: div };

    const { result } = await renderHook(() => useWritingMode(ref));

    await vi.waitFor(() => {
      expect(result.current).toBe('horizontal');
    });

    div.remove();
  });

  it('writing-mode が vertical-rl のときは "vertical" を返す', async () => {
    const div = document.createElement('div');
    div.style.writingMode = 'vertical-rl';
    document.body.append(div);
    const ref = { current: div };

    const { result } = await renderHook(() => useWritingMode(ref));

    await vi.waitFor(() => {
      expect(result.current).toBe('vertical');
    });

    div.remove();
  });

  it('writing-mode が sideways-rl のときは "vertical" を返す', async () => {
    const div = document.createElement('div');
    div.style.writingMode = 'sideways-rl';
    document.body.append(div);
    const ref = { current: div };

    const { result } = await renderHook(() => useWritingMode(ref));

    await vi.waitFor(() => {
      expect(result.current).toBe('vertical');
    });

    div.remove();
  });

  it('ref が null の場合は "horizontal" を返す', async () => {
    const ref = { current: null };
    const { result } = await renderHook(() => useWritingMode(ref));
    expect(result.current).toBe('horizontal');
  });
});
