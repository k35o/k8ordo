import { renderHook } from 'vitest-browser-react';

import { useSessionStorage } from './index';

const consoleErrorMock = vi
  .spyOn(console, 'error')
  .mockImplementation(() => undefined);

describe('useSessionStorage', () => {
  const key = 'testKey';

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterAll(() => {
    consoleErrorMock.mockReset();
  });

  it('sessionStorageに値がなければ初期値を返す', async () => {
    const { result } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    expect(result.current[0]).toBe('defaultValue');
  });

  it('sessionStorageに値が存在あればその値を返す', async () => {
    sessionStorage.setItem(key, JSON.stringify('storedValue'));
    const { result } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    expect(result.current[0]).toBe('storedValue');
  });

  it('更新処理ではsessionStorageとstateの両方を更新する', async () => {
    const { result, act } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(sessionStorage.getItem(key)).toBe(JSON.stringify('newValue'));
    expect(result.current[0]).toBe('newValue');
  });

  it('削除処理ではsessionStorageは値を削除され、stateは初期値になる', async () => {
    sessionStorage.setItem(key, JSON.stringify('storedValue'));
    const { result, act } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    act(() => {
      result.current[2]();
    });

    expect(sessionStorage.getItem(key)).toBeNull();
    expect(result.current[0]).toBe('defaultValue');
  });

  it('nullで更新した場合はremoveと同じ結果になる', async () => {
    const { result, act } = await renderHook(() =>
      useSessionStorage<{ lang: string[] } | null>(key, {
        lang: ['ja', 'en'],
      }),
    );

    act(() => {
      result.current[1](null);
    });

    expect(sessionStorage.getItem(key)).toBeNull();
    expect(result.current[0]).toStrictEqual({ lang: ['ja', 'en'] });
  });

  it('storageイベントの発火に応じてstateが更新される', async () => {
    const { result, act } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    act(() => {
      sessionStorage.setItem(key, JSON.stringify('updatedValue'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: JSON.stringify('updatedValue'),
        }),
      );
    });

    expect(result.current[0]).toBe('updatedValue');
  });

  it('異なるキーのstorageイベントはstateを更新しない', async () => {
    const { result, act } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    act(() => {
      sessionStorage.setItem('otherKey', JSON.stringify('otherValue'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'otherKey',
          newValue: JSON.stringify('otherValue'),
        }),
      );
    });

    expect(result.current[0]).toBe('defaultValue');
  });

  it('JSONをパースできない時はエラーを吐いて初期値を返す', async () => {
    sessionStorage.setItem(key, '{invalidJSON');
    const { result } = await renderHook(() =>
      useSessionStorage(key, 'defaultValue'),
    );

    expect(result.current[0]).toBe('defaultValue');
    expect(consoleErrorMock).toHaveBeenCalledOnce();
  });
});
