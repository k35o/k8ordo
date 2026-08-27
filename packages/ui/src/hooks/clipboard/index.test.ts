import { renderHook } from 'vitest-browser-react';

import { useClipboard } from '.';

describe('useClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('クリップボードを書き込める', async () => {
    const writeText = 'test';
    const writeTextMockFn = vi.fn<(text: string) => Promise<void>>();
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMockFn,
      },
    });

    const { result } = await renderHook(() => useClipboard());
    await result.current.writeClipboard(writeText);

    expect(writeTextMockFn).toHaveBeenCalledWith(writeText);
    expect(writeTextMockFn).toHaveBeenCalledOnce();
  });

  it('クリップボードを読み込める', async () => {
    const readTextMockFn = vi.fn<() => Promise<string>>();
    vi.stubGlobal('navigator', {
      clipboard: {
        readText: readTextMockFn,
      },
    });

    const { result } = await renderHook(() => useClipboard());
    await result.current.readClipboard();

    expect(readTextMockFn).toHaveBeenCalledOnce();
  });
});
