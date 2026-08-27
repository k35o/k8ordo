import { renderHook } from 'vitest-browser-react';

import { useDebouncedTransition } from './index';
import type { DebouncedAction } from './index';

const aborting = (signal: AbortSignal) =>
  new Promise<void>((_resolve, reject) => {
    signal.addEventListener(
      'abort',
      () => {
        reject(new DOMException('aborted', 'AbortError'));
      },
      { once: true },
    );
  });

describe('useDebouncedTransition', () => {
  it('delay 経過後にアクションが実行される', async () => {
    const action = vi.fn<DebouncedAction>();
    const { result } = await renderHook(() => useDebouncedTransition(50));

    result.current[1](action);

    expect(action).not.toHaveBeenCalled();

    await vi.waitFor(() => {
      expect(action).toHaveBeenCalledOnce();
    });
  });

  it('delay 内に再呼び出しされると前回はキャンセルされる', async () => {
    const first = vi.fn<DebouncedAction>();
    const second = vi.fn<DebouncedAction>();
    const { result } = await renderHook(() => useDebouncedTransition(50));

    result.current[1](first);
    result.current[1](second);

    await vi.waitFor(() => {
      expect(second).toHaveBeenCalledOnce();
    });
    expect(first).not.toHaveBeenCalled();
  });

  it('アクションに渡される signal がキャンセル時に abort される', async () => {
    let capturedSignal: AbortSignal | undefined;
    const longRunning = vi.fn<DebouncedAction>(async (signal) => {
      capturedSignal = signal;
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 200);
      });
    });
    const replacer = vi.fn<DebouncedAction>();
    const { result } = await renderHook(() => useDebouncedTransition(20));

    result.current[1](longRunning);

    await vi.waitFor(() => {
      expect(longRunning).toHaveBeenCalledOnce();
    });

    result.current[1](replacer);

    await vi.waitFor(() => {
      expect(capturedSignal?.aborted).toBe(true);
    });
  });

  it('action が AbortError で reject しても未処理 rejection にならない', async () => {
    const onUnhandled = vi.fn<(event: PromiseRejectionEvent) => void>();
    window.addEventListener('unhandledrejection', onUnhandled);

    const { result } = await renderHook(() => useDebouncedTransition(20));

    result.current[1](aborting);
    await vi.waitFor(() => {});
    result.current[1](() => {});

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(onUnhandled).not.toHaveBeenCalled();
    window.removeEventListener('unhandledrejection', onUnhandled);
  });
});
