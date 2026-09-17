import { renderHook } from 'vitest-browser-react';

import { readWritingMode, useWritingMode } from '.';

const mount = (writingMode: string): HTMLDivElement => {
  const div = document.createElement('div');
  div.style.writingMode = writingMode;
  document.body.append(div);
  return div;
};

describe('readWritingMode', () => {
  it('horizontal-tb は "horizontal"', () => {
    const div = mount('horizontal-tb');
    expect(readWritingMode(div)).toBe('horizontal');
    div.remove();
  });

  it('vertical-rl は "vertical"', () => {
    const div = mount('vertical-rl');
    expect(readWritingMode(div)).toBe('vertical');
    div.remove();
  });

  it('sideways-rl は "vertical"', () => {
    const div = mount('sideways-rl');
    expect(readWritingMode(div)).toBe('vertical');
    div.remove();
  });
});

describe('useWritingMode', () => {
  it('要素が縦書きなら "vertical" を返す', async () => {
    const div = mount('vertical-rl');

    const { result } = await renderHook(() => useWritingMode(div));

    await vi.waitFor(() => {
      expect(result.current).toBe('vertical');
    });
    div.remove();
  });

  it('幅いっぱいに広がる要素なら、書字方向の切り替えに追従する', async () => {
    const div = mount('horizontal-tb');
    div.style.blockSize = '40px';

    const { result } = await renderHook(() => useWritingMode(div));
    await vi.waitFor(() => {
      expect(result.current).toBe('horizontal');
    });

    div.style.writingMode = 'vertical-rl';
    await vi.waitFor(() => {
      expect(result.current).toBe('vertical');
    });
    div.remove();
  });

  it('要素が null の間は "horizontal" を返す', async () => {
    const { result } = await renderHook(() => useWritingMode(null));
    expect(result.current).toBe('horizontal');
  });
});
