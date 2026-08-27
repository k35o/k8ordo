import { renderHook } from 'vitest-browser-react';

import { useInView } from './use-in-view';

function assertDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error('Expected value to be defined');
  }
}

describe('useInView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('初期状態ではfalseを返す', async () => {
    const ref = { current: null };
    const { result } = await renderHook(() => useInView(ref));

    expect(result.current).toBe(false);
  });

  it('要素がビューポート内にある場合trueを返す', async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private callback: IntersectionObserverCallback;
        constructor(callback: IntersectionObserverCallback) {
          this.callback = callback;
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
    const { result } = await renderHook(() => useInView(ref));

    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('ビューポートから出るとfalseに戻る', async () => {
    let storedCallback: IntersectionObserverCallback | undefined;
    let storedElement: Element | undefined;

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private callback: IntersectionObserverCallback;
        constructor(callback: IntersectionObserverCallback) {
          this.callback = callback;
          storedCallback = callback;
        }
        observe(el: Element) {
          storedElement = el;
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
    const { result } = await renderHook(() => useInView(ref));

    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });

    assertDefined(storedCallback);
    assertDefined(storedElement);
    storedCallback(
      [
        {
          isIntersecting: false,
          target: storedElement,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    await vi.waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('onceオプションでビューポートから出てもtrueを維持する', async () => {
    let storedCallback: IntersectionObserverCallback | undefined;
    let storedElement: Element | undefined;

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private callback: IntersectionObserverCallback;
        constructor(callback: IntersectionObserverCallback) {
          this.callback = callback;
          storedCallback = callback;
        }
        observe(el: Element) {
          storedElement = el;
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
    const { result } = await renderHook(() => useInView(ref, { once: true }));

    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });

    assertDefined(storedCallback);
    assertDefined(storedElement);
    storedCallback(
      [
        {
          isIntersecting: false,
          target: storedElement,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
