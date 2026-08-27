import { renderHook } from 'vitest-browser-react';

import { useWindowSize } from '.';

describe('useWindowSize', () => {
  it('windowサイズの変更に合わせて現在のwindowサイズを取得する', async () => {
    const initWindowSize = { width: 0, height: 0 };
    const resizedWindowSize = { width: 1000, height: 1000 };

    window.innerWidth = initWindowSize.width;
    window.innerHeight = initWindowSize.height;

    const { result, act } = await renderHook(() => useWindowSize());

    expect(result.current).toStrictEqual(initWindowSize);

    window.innerWidth = resizedWindowSize.width;
    window.innerHeight = resizedWindowSize.height;

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toStrictEqual(resizedWindowSize);
  });
});
