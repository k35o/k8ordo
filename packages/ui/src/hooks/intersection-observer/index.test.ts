import { renderHook } from 'vitest-browser-react';

import { useIntersectionObserver } from './use-intersection-observer';

describe('useIntersectionObserver', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('要素が交差したときcallbackが呼ばれる', async () => {
    const callback = vi.fn<(entry: IntersectionObserverEntry) => void>();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private callback: IntersectionObserverCallback;
        constructor(cb: IntersectionObserverCallback) {
          this.callback = cb;
        }
        observe(el: Element) {
          this.callback(
            [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
            {} as IntersectionObserver,
          );
        }
        disconnect() {}
      },
    );

    const div = document.createElement('div');
    const ref = { current: div };
    await renderHook(() => {
      useIntersectionObserver(ref, callback);
    });

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledOnce();
    });
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ isIntersecting: true }),
    );
  });

  it('onceオプションで交差後にdisconnectされる', async () => {
    const callback = vi.fn<(entry: IntersectionObserverEntry) => void>();
    const disconnectSpy = vi.fn<() => void>();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private callback: IntersectionObserverCallback;
        constructor(cb: IntersectionObserverCallback) {
          this.callback = cb;
        }
        observe(el: Element) {
          this.callback(
            [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
            {} as IntersectionObserver,
          );
        }
        disconnect() {
          disconnectSpy();
        }
      },
    );

    const div = document.createElement('div');
    const ref = { current: div };
    await renderHook(() => {
      useIntersectionObserver(ref, callback, { once: true });
    });

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledOnce();
    });
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('refがnullの場合は何もしない', async () => {
    const callback = vi.fn<(entry: IntersectionObserverEntry) => void>();
    const ref = { current: null };
    await renderHook(() => {
      useIntersectionObserver(ref, callback);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('オプションがIntersectionObserverに渡される', async () => {
    const callback = vi.fn<(entry: IntersectionObserverEntry) => void>();
    const optionsSpy = vi.fn<(options?: IntersectionObserverInit) => void>();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(
          _: IntersectionObserverCallback,
          options?: IntersectionObserverInit,
        ) {
          optionsSpy(options);
        }
        observe() {}
        disconnect() {}
      },
    );

    const div = document.createElement('div');
    const ref = { current: div };
    await renderHook(() => {
      useIntersectionObserver(ref, callback, {
        threshold: 0.5,
        rootMargin: '10px',
      });
    });

    expect(optionsSpy).toHaveBeenCalledWith({
      threshold: 0.5,
      root: null,
      rootMargin: '10px',
    });
  });
});
