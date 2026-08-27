import { renderHook } from 'vitest-browser-react';

import { useDisclosure } from './index';

describe('useDisclosure', () => {
  it('初期状態はfalseである', async () => {
    const { result } = await renderHook(() => useDisclosure());

    expect(result.current.isOpen).toBe(false);
  });

  it('初期値をtrueに設定できる', async () => {
    const { result } = await renderHook(() => useDisclosure(true));

    expect(result.current.isOpen).toBe(true);
  });

  it('openでtrueになる', async () => {
    const { result, act } = await renderHook(() => useDisclosure());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closeでfalseになる', async () => {
    const { result, act } = await renderHook(() => useDisclosure(true));

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('toggleで状態が反転する', async () => {
    const { result, act } = await renderHook(() => useDisclosure());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
