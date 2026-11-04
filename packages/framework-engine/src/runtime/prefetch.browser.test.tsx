import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { prefetchInView } from './prefetch';

// 先読みを頼まれた URL の pathname を順に集める。答えはテストが決める
const recordPrefetches = (
  answer: () => Promise<unknown> = () => Promise.resolve(),
) => {
  const asked: string[] = [];
  const stop = prefetchInView((url) => {
    asked.push(url.pathname);
    return answer();
  });
  stops.push(stop);
  return { asked, stop };
};

const stops: Array<() => void> = [];

const linkTo = (href: string, style = ''): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = href;
  link.setAttribute('style', `display: block; ${style}`);
  return link;
};

// 画面の外に置く。下へ画面 2 枚ぶん離す
const BELOW = 'margin-top: 200vh';

// IntersectionObserver の知らせは描画のあとに来る。2 フレーム待つ
const twoFrames = (): Promise<unknown> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

afterEach(() => {
  for (const stop of stops.splice(0)) stop();
  document.body.replaceChildren();
  scrollTo(0, 0);
});

describe('prefetching the links on screen', () => {
  it('prefetches a link on screen', async () => {
    document.body.append(linkTo('/next'));

    const { asked } = recordPrefetches();

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('prefetches a link off screen once it comes into view', async () => {
    const link = linkTo('/next', BELOW);
    document.body.append(link);
    const { asked } = recordPrefetches();
    await twoFrames();
    const beforeScrolling = [...asked];

    link.scrollIntoView();

    expect(beforeScrolling).toStrictEqual([]);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('prefetches a link rendered once it was watching', async () => {
    const { asked } = recordPrefetches();

    document.body.append(linkTo('/later'));

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/later']);
    });
  });

  it('prefetches one link at a time, in the order they came into view', async () => {
    document.body.append(linkTo('/first'), linkTo('/second'));
    const answers: Array<() => void> = [];
    const { asked } = recordPrefetches(
      () =>
        new Promise<void>((resolve) => {
          answers.push(resolve);
        }),
    );
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first']);
    });
    await twoFrames();
    const whileTheFirstLoads = [...asked];

    answers[0]?.();

    expect(whileTheFirstLoads).toStrictEqual(['/first']);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/second']);
    });
  });

  it('passes over a link that left the screen before its turn', async () => {
    const second = linkTo('/second');
    document.body.append(linkTo('/first'), second, linkTo('/third'));
    const answers: Array<() => void> = [];
    const { asked } = recordPrefetches(
      () =>
        new Promise<void>((resolve) => {
          answers.push(resolve);
        }),
    );
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first']);
    });

    second.remove();
    await twoFrames();
    answers[0]?.();

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/third']);
    });
  });

  it('moves on past a prefetch that failed', async () => {
    document.body.append(linkTo('/first'), linkTo('/second'));

    const { asked } = recordPrefetches(() =>
      Promise.reject(new TypeError('offline')),
    );

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/second']);
    });
  });

  it('prefetches only what a click would load in place', async () => {
    const opted = linkTo('/opted-out');
    opted.dataset.k8ordoPrefetch = 'false';
    document.body.append(
      opted,
      linkTo('https://example.com/elsewhere'),
      linkTo('/next'),
    );

    const { asked } = recordPrefetches();

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('prefetches nothing rendered once it was stopped', async () => {
    const { asked, stop } = recordPrefetches();
    document.body.append(linkTo('/before'));
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/before']);
    });

    stop();
    document.body.append(linkTo('/after'));
    await twoFrames();

    expect(asked).toStrictEqual(['/before']);
  });
});
