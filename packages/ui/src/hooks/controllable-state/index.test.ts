import { describe, expect, it, vi } from 'vite-plus/test';
import { renderHook } from 'vitest-browser-react';

import { useControllableState } from '.';

describe('useControllableState', () => {
  describe('uncontrolled', () => {
    it('defaultValueが初期値として使われる', async () => {
      const { result } = await renderHook(() =>
        useControllableState({ defaultValue: 'hello' }),
      );

      expect(result.current[0]).toBe('hello');
    });

    it('setValueで内部状態が更新される', async () => {
      const { result, act } = await renderHook(() =>
        useControllableState({ defaultValue: 0 }),
      );

      await act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    it('関数型のsetValueが使える', async () => {
      const { result, act } = await renderHook(() =>
        useControllableState({ defaultValue: 10 }),
      );

      await act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(15);
    });

    it('onChangeが呼ばれる', async () => {
      const onChange = vi.fn<(value: number) => void>();
      const { result, act } = await renderHook(() =>
        useControllableState({ defaultValue: 0, onChange }),
      );

      await act(() => {
        result.current[1](42);
      });

      expect(onChange).toHaveBeenCalledWith(42);
    });
  });

  describe('controlled', () => {
    it('valueが優先される', async () => {
      const { result } = await renderHook(() =>
        useControllableState({ value: 'controlled', defaultValue: 'default' }),
      );

      expect(result.current[0]).toBe('controlled');
    });

    it('setValueで内部状態は更新されない', async () => {
      const { result, act } = await renderHook(() =>
        useControllableState({ value: 'controlled', defaultValue: 'default' }),
      );

      await act(() => {
        result.current[1]('new value');
      });

      expect(result.current[0]).toBe('controlled');
    });

    it('onChangeが呼ばれる', async () => {
      const onChange = vi.fn<(value: string) => void>();
      const { result, act } = await renderHook(() =>
        useControllableState({
          value: 'controlled',
          defaultValue: 'default',
          onChange,
        }),
      );

      await act(() => {
        result.current[1]('new value');
      });

      expect(onChange).toHaveBeenCalledWith('new value');
    });
  });

  describe('配列の値', () => {
    it('配列をuncontrolledで管理できる', async () => {
      const { result, act } = await renderHook(() =>
        useControllableState<string[]>({ defaultValue: [] }),
      );

      await act(() => {
        result.current[1](['a', 'b']);
      });

      expect(result.current[0]).toStrictEqual(['a', 'b']);
    });
  });
});
