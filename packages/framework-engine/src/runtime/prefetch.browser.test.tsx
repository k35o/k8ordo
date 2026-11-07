import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { IN_VIEW_DWELL, prefetchInView } from './prefetch';
import type { InView } from './prefetch';

// 先読みを頼まれた URL の pathname と signal を順に集める。答えはテストが決める
const recordPrefetches = (
  answer: (signal: AbortSignal) => Promise<unknown> = () => Promise.resolve(),
) => {
  const asked: string[] = [];
  const signals: AbortSignal[] = [];
  const inView = prefetchInView((url, signal) => {
    asked.push(url.pathname);
    signals.push(signal);
    return answer(signal);
  });
  watching.push(inView);
  return { asked, signals, inView };
};

const watching: InView[] = [];

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

// 画面に入ったという知らせが links のすべてに届くまで待つ。最初の知らせは
// 2 フレームより遅れることがあるので、同じ知らせを聞く。見張りの知らせは
// 同じタスクの後に回ることもあるので、さらに 2 フレーム待つ
const reportedOnScreen = async (...links: Element[]): Promise<void> => {
  await Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          const observer = new IntersectionObserver((entries) => {
            if (entries.some(({ isIntersecting }) => isIntersecting)) {
              observer.disconnect();
              resolve();
            }
          });
          observer.observe(link);
        }),
    ),
  );
  await twoFrames();
};

// 画面に入ってから、留まる時間を進める
const stayOnScreen = async (...links: Element[]): Promise<void> => {
  await reportedOnScreen(...links);
  vi.advanceTimersByTime(IN_VIEW_DWELL);
};

// 答えるまで決着せず、signal が中止されたら reject する先読み
const heldOpen = (answers: Array<() => void>) => (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    answers.push(resolve);
    signal.addEventListener('abort', () => {
      reject(signal.reason as Error);
    });
  });

beforeEach(() => {
  // 留まる時間だけを進める。IntersectionObserver とフレームは本物
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
});

afterEach(() => {
  for (const inView of watching.splice(0)) inView.stop();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.replaceChildren();
  scrollTo(0, 0);
});

describe('prefetching the links on screen', () => {
  it('prefetches a link once it has stayed on screen', async () => {
    const link = linkTo('/next');
    document.body.append(link);
    const { asked } = recordPrefetches();
    await reportedOnScreen(link);
    vi.advanceTimersByTime(IN_VIEW_DWELL - 1);
    await twoFrames();
    const beforeStaying = [...asked];

    vi.advanceTimersByTime(1);

    expect(beforeStaying).toStrictEqual([]);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('passes over a link scrolled past before it stayed on screen', async () => {
    const passed = linkTo('/passed');
    const stoppedAt = linkTo('/stopped-at', 'margin-top: 300vh');
    document.body.append(passed, stoppedAt);
    const { asked } = recordPrefetches();
    await reportedOnScreen(passed);
    vi.advanceTimersByTime(IN_VIEW_DWELL / 2);

    scrollTo(0, document.documentElement.scrollHeight);
    await stayOnScreen(stoppedAt);

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/stopped-at']);
    });
  });

  it('prefetches a link off screen once it comes into view', async () => {
    const link = linkTo('/next', BELOW);
    document.body.append(link);
    const { asked } = recordPrefetches();
    await twoFrames();
    vi.advanceTimersByTime(IN_VIEW_DWELL);
    await twoFrames();
    const beforeScrolling = [...asked];

    link.scrollIntoView();
    await stayOnScreen(link);

    expect(beforeScrolling).toStrictEqual([]);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('prefetches a link rendered once it was watching', async () => {
    const { asked } = recordPrefetches();
    const link = linkTo('/later');

    document.body.append(link);
    await stayOnScreen(link);

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/later']);
    });
  });

  it('prefetches nothing before the document has loaded', async () => {
    const readyState = vi
      .spyOn(document, 'readyState', 'get')
      .mockReturnValue('loading');
    const link = linkTo('/next');
    document.body.append(link);
    const { asked } = recordPrefetches();
    await stayOnScreen(link);
    await twoFrames();
    const beforeLoad = [...asked];

    readyState.mockRestore();
    dispatchEvent(new Event('load'));

    expect(beforeLoad).toStrictEqual([]);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('prefetches one link at a time, in the order they came into view', async () => {
    const links = [linkTo('/first'), linkTo('/second')];
    document.body.append(...links);
    const answers: Array<() => void> = [];
    const { asked } = recordPrefetches(heldOpen(answers));
    await stayOnScreen(...links);
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
    const links = [linkTo('/first'), linkTo('/second'), linkTo('/third')];
    document.body.append(...links);
    const answers: Array<() => void> = [];
    const { asked } = recordPrefetches(heldOpen(answers));
    await stayOnScreen(...links);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first']);
    });

    links[1]?.remove();
    await twoFrames();
    answers[0]?.();

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/third']);
    });
  });

  it('moves on past a prefetch that failed', async () => {
    const links = [linkTo('/first'), linkTo('/second')];
    document.body.append(...links);

    const { asked } = recordPrefetches(() =>
      Promise.reject(new TypeError('offline')),
    );
    await stayOnScreen(...links);

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/second']);
    });
  });

  it('prefetches only what a click would load in place', async () => {
    const opted = linkTo('/opted-out');
    opted.dataset.k8ordoPrefetch = 'false';
    const links = [
      opted,
      linkTo('https://example.com/elsewhere'),
      linkTo('/next'),
    ];
    document.body.append(...links);

    const { asked } = recordPrefetches();
    await stayOnScreen(...links);

    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/next']);
    });
  });

  it('prefetches nothing rendered once it was stopped', async () => {
    const { inView, asked } = recordPrefetches();
    const before = linkTo('/before');
    document.body.append(before);
    await stayOnScreen(before);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/before']);
    });

    inView.stop();
    const after = linkTo('/after');
    document.body.append(after);
    await stayOnScreen(after);
    await twoFrames();

    expect(asked).toStrictEqual(['/before']);
  });
});

describe('prefetching the links on screen while a page change loads', () => {
  it('starts no prefetch until the page change is on screen', async () => {
    const links = [linkTo('/first'), linkTo('/second')];
    document.body.append(...links);
    const answers: Array<() => void> = [];
    const { asked, inView } = recordPrefetches(heldOpen(answers));
    await stayOnScreen(...links);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first']);
    });
    inView.pending('/first');
    answers[0]?.();
    await twoFrames();
    const whileLoading = [...asked];

    inView.pending(null);

    expect(whileLoading).toStrictEqual(['/first']);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/second']);
    });
  });

  it('lets the prefetch of the page being loaded run on', async () => {
    const link = linkTo('/first');
    document.body.append(link);
    const { asked, signals, inView } = recordPrefetches(heldOpen([]));
    await stayOnScreen(link);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first']);
    });

    inView.pending('/first');

    expect(signals[0]?.aborted).toBe(false);
  });

  it('calls off a prefetch on its way to another page, and fetches it first once the page is on screen', async () => {
    const links = [linkTo('/first'), linkTo('/second')];
    document.body.append(...links);
    const { asked, signals, inView } = recordPrefetches(heldOpen([]));
    await stayOnScreen(...links);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first']);
    });

    inView.pending('/elsewhere');
    await twoFrames();
    const whileLoading = [...asked];
    inView.pending(null);

    expect(signals[0]?.aborted).toBe(true);
    expect(whileLoading).toStrictEqual(['/first']);
    await vi.waitFor(() => {
      expect(asked).toStrictEqual(['/first', '/first']);
    });
  });
});
