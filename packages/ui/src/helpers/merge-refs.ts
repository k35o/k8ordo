import type { Ref, RefCallback } from 'react';

export const mergeRefs =
  <T>(...refs: ReadonlyArray<Ref<T> | undefined>): RefCallback<T> =>
  (value) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === 'function') {
        const result = ref(value);
        if (typeof result === 'function') {
          cleanups.push(() => {
            result();
          });
        } else {
          cleanups.push(() => {
            ref(null);
          });
        }
      } else if (ref !== null && ref !== undefined) {
        ref.current = value;
        cleanups.push(() => {
          ref.current = null;
        });
      }
    }
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  };

if (import.meta.vitest) {
  describe('mergeRefs', () => {
    it('オブジェクトrefと関数refの両方に値を設定する', () => {
      const objectRef = { current: null as HTMLElement | null };
      const functionRef = vi.fn();
      const element = {} as HTMLElement;

      mergeRefs(objectRef, functionRef)(element);

      expect(objectRef.current).toBe(element);
      expect(functionRef).toHaveBeenCalledWith(element);
    });

    it('nullとundefinedのrefをスキップする', () => {
      const objectRef = { current: null as HTMLElement | null };
      const element = {} as HTMLElement;

      const cleanup = mergeRefs(null, undefined, objectRef)(element);

      expect(objectRef.current).toBe(element);
      expect(cleanup).toBeTypeOf('function');
    });

    it('クリーンアップでオブジェクトrefをnullに戻し、関数refをnullで呼ぶ', () => {
      const objectRef = { current: null as HTMLElement | null };
      const functionRef = vi.fn();
      const element = {} as HTMLElement;

      const cleanup = mergeRefs(objectRef, functionRef)(element);
      cleanup?.();

      expect(objectRef.current).toBeNull();
      expect(functionRef).toHaveBeenLastCalledWith(null);
    });

    it('クリーンアップ関数を返す関数refは、nullで再呼び出しせずそのクリーンアップを実行する', () => {
      const refCleanup = vi.fn();
      const functionRef = vi.fn(() => refCleanup);
      const element = {} as HTMLElement;

      const cleanup = mergeRefs(functionRef)(element);
      cleanup?.();

      expect(refCleanup).toHaveBeenCalledOnce();
      expect(functionRef).toHaveBeenCalledOnce();
      expect(functionRef).not.toHaveBeenCalledWith(null);
    });
  });
}
