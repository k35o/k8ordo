import { cleanup, render } from 'vitest-browser-react';

import { AppRouter, setDocumentClient } from './app-router';
import type { Payload } from './payload';
import { reloadDocument } from './reload';

type ServerCallback = (id: string, args: unknown[]) => Promise<unknown>;

const rsc = vi.hoisted(() => ({
  // app-router が読み込まれた時点で登録する、アクションの呼び出し口
  serverCallback: undefined as ServerCallback | undefined,
  // 本文を受け取ってから、読み解き終えるまでに待つもの。ペイロードが
  // 名指しするクライアントコンポーネントの読み込みにあたる
  imports: Promise.resolve(),
  decoding: 0,
}));

// 復号は RSC の配線(ビルドが作る仮想モジュール)ごと差し替え、JSON で運ぶ。
// ここで確かめたいのは、届いたペイロードをどう扱うかだけ
vi.mock('@vitejs/plugin-rsc/browser', () => ({
  createFromReadableStream: async (
    stream: ReadableStream<Uint8Array>,
  ): Promise<unknown> => {
    const text = await new Response(stream).text();
    rsc.decoding += 1;
    await rsc.imports;
    return JSON.parse(text);
  },
  createFromFetch: async (response: Promise<Response>): Promise<unknown> =>
    JSON.parse(await (await response).text()),
  createTemporaryReferenceSet: () => ({}),
  encodeReply: () => Promise.resolve(''),
  setServerCallback: (callback: ServerCallback) => {
    rsc.serverCallback = callback;
  },
}));

// location.reload は差し替えられない(Location は unforgeable)。
// 名前を付けた唯一の継ぎ目をここで見張る
vi.mock('./reload', () => ({ reloadDocument: vi.fn<() => void>() }));

// このタブが読み込んだスクリプトと、タブを開いた後のデプロイが配るスクリプト
const RUNNING = '/assets/index-running.js';
const DEPLOYED = '/assets/index-deployed.js';

const passThrough = globalThis.fetch;

// ページのペイロードとアクションの答えを、どちらもこの 1 枚で返すサーバー
const answerWith = (payload: Payload, status = 200): void => {
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!url.endsWith('/index.rsc') && init?.method !== 'POST') {
      return passThrough(input, init);
    }
    return Promise.resolve(
      new Response(JSON.stringify(payload), {
        status,
        headers: { 'content-type': 'text/x-component;charset=utf-8' },
      }),
    );
  });
};

// ペイロードを取りに行った fetch への答えを、テストごとに決める。
// 本物の fetch と同じく、ナビゲーションの signal を受け取る
const answerPayloadRequests = (
  answer: (signal: AbortSignal) => Promise<Response>,
): void => {
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!url.endsWith('/index.rsc')) return passThrough(input, init);
    if (!(init?.signal instanceof AbortSignal)) {
      throw new Error('a payload request without a signal');
    }
    return answer(init.signal);
  });
};

const html = (status: number): Response =>
  new Response('<!doctype html><title>the host</title>', {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });

// ルーターが外れた後の、元の URL へ戻るあいだだけルーターを演じる
const interceptEverything = (event: NavigateEvent): void => {
  if (event.canIntercept) event.intercept();
};

// 決着したかどうかを、少し待ってから読む
const settledYet = (promise: Promise<unknown>): Promise<boolean> =>
  Promise.race([
    promise.then(
      () => true,
      () => true,
    ),
    new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 20);
    }),
  ]);

const serverCallback = (): ServerCallback => {
  if (rsc.serverCallback === undefined) {
    throw new Error('no server callback registered');
  }
  return rsc.serverCallback;
};

let home = '';

beforeEach(() => {
  home = location.href;
  setDocumentClient(RUNNING);
  rsc.imports = Promise.resolve();
  rsc.decoding = 0;
});

afterEach(async () => {
  // AppRouter は同一オリジンの URL をすべて引き受けるので、外してから戻る
  await cleanup();
  vi.unstubAllGlobals();
  navigation.addEventListener('navigate', interceptEverything);
  try {
    await navigation.navigate(home, { history: 'replace' }).finished;
  } finally {
    navigation.removeEventListener('navigate', interceptEverything);
  }
});

describe('a client navigation', () => {
  it('renders the next page when its payload was rendered for the client this document runs', async () => {
    answerWith({ tree: 'next page', pathname: '/next', client: RUNNING });
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    await navigation.navigate('/next').finished;

    await expect.element(screen.getByText('next page')).toBeInTheDocument();
    expect(reloadDocument).not.toHaveBeenCalled();
  });

  it('loads the URL as a document instead when its payload was rendered for a client deployed since', async () => {
    answerWith({ tree: 'next page', pathname: '/next', client: DEPLOYED });
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    // 文書が置き換わるので、このナビゲーションは終わらない。戻るときに
    // 中断されるのを、未処理の失敗にしない
    navigation.navigate('/next').finished?.catch(() => undefined);

    await vi.waitFor(() => {
      expect(reloadDocument).toHaveBeenCalledTimes(1);
    });
    // 古いスクリプトには描けない木なので、描こうとしない
    expect(screen.container.textContent).toBe('first page');
  });

  it('leaves the document alone when the visitor moved on before that payload was read', async () => {
    answerWith({ tree: 'next page', pathname: '/next', client: DEPLOYED });
    let imported!: () => void;
    rsc.imports = new Promise((resolve) => {
      imported = resolve;
    });
    const screen = await render(<AppRouter pathname="/" tree="first page" />);
    navigation.navigate('/next').finished?.catch(() => undefined);
    await vi.waitFor(() => {
      expect(rsc.decoding).toBe(1);
    });

    // 本文は届き終え、読み解きが import を待っているうちに戻る
    await navigation.back().finished;
    imported();

    // 読み解きの続きはマイクロタスクで走りきる。その後のタスクで読む
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(reloadDocument).not.toHaveBeenCalled();
    expect(screen.container.textContent).toBe('first page');
  });

  it('renders the not-found page the server answered with a payload under 404, in place', async () => {
    answerWith(
      { tree: 'not found page', pathname: '/nowhere', client: RUNNING },
      404,
    );
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    await navigation.navigate('/nowhere').finished;

    await expect
      .element(screen.getByText('not found page'))
      .toBeInTheDocument();
    expect(reloadDocument).not.toHaveBeenCalled();
  });
});

describe('a client navigation the answer cannot complete in place', () => {
  it.each([
    ['its 404 page', 404],
    ['a page it serves under 200 for any URL', 200],
  ])(
    'loads the destination as a document when the host answers with %s',
    async (_, status) => {
      answerPayloadRequests(() => Promise.resolve(html(status)));
      const screen = await render(<AppRouter pathname="/" tree="first page" />);

      // 文書が置き換わるので、このナビゲーションは終わらない
      navigation.navigate('/next').finished?.catch(() => undefined);

      await vi.waitFor(() => {
        expect(reloadDocument).toHaveBeenCalledTimes(1);
      });
      // 割り込みの時点で URL は移っている。読み込み直されるのは行き先
      expect(location.pathname).toBe('/next');
      expect(screen.container.textContent).toBe('first page');
    },
  );

  it('loads the destination as a document when the network fails', async () => {
    answerPayloadRequests(() =>
      Promise.reject(new TypeError('Failed to fetch')),
    );
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    navigation.navigate('/next').finished?.catch(() => undefined);

    await vi.waitFor(() => {
      expect(reloadDocument).toHaveBeenCalledTimes(1);
    });
    expect(location.pathname).toBe('/next');
    expect(screen.container.textContent).toBe('first page');
  });

  it('loads the destination as a document when the connection drops mid-payload', async () => {
    answerPayloadRequests(() =>
      Promise.resolve(
        new Response(
          new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(new TextEncoder().encode('{"tree":'));
              controller.error(new TypeError('network error'));
            },
          }),
          { headers: { 'content-type': 'text/x-component;charset=utf-8' } },
        ),
      ),
    );
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    navigation.navigate('/next').finished?.catch(() => undefined);

    await vi.waitFor(() => {
      expect(reloadDocument).toHaveBeenCalledTimes(1);
    });
    expect(location.pathname).toBe('/next');
    expect(screen.container.textContent).toBe('first page');
  });

  it('leaves the document alone when the visitor moved on while the payload was on its way', async () => {
    let requested = 0;
    // 本物の fetch と同じく、中断されたらその理由で reject する
    answerPayloadRequests((signal) => {
      requested += 1;
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(signal.reason as Error);
        });
      });
    });
    const screen = await render(<AppRouter pathname="/" tree="first page" />);
    navigation.navigate('/next').finished?.catch(() => undefined);
    await vi.waitFor(() => {
      expect(requested).toBe(1);
    });

    await navigation.back().finished;

    // 中断で reject した fetch はマイクロタスクで片付く。その後のタスクで読む
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(reloadDocument).not.toHaveBeenCalled();
    expect(screen.container.textContent).toBe('first page');
  });
});

describe("a Server Action's answer", () => {
  it('is applied, and its value handed back, when rendered for the client this document runs', async () => {
    answerWith({
      tree: 'after the action',
      pathname: '/',
      client: RUNNING,
      returnValue: 'saved',
    });
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    await expect(serverCallback()('action-id', [])).resolves.toBe('saved');

    await expect
      .element(screen.getByText('after the action'))
      .toBeInTheDocument();
    expect(reloadDocument).not.toHaveBeenCalled();
  });

  it('is not applied, and the document loaded again, when rendered for a client deployed since', async () => {
    answerWith({
      tree: 'after the action',
      pathname: '/',
      client: DEPLOYED,
      returnValue: 'saved',
    });
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    const outcome = serverCallback()('action-id', []);

    await vi.waitFor(() => {
      expect(reloadDocument).toHaveBeenCalledTimes(1);
    });
    // 置き換わる文書に値を返してはいけない。「settle しない」は待ってみるしかない
    expect(await settledYet(outcome)).toBe(false);
    expect(screen.container.textContent).toBe('first page');
  });
});

const NEXT: Payload = { tree: 'next page', pathname: '/next', client: RUNNING };

const payloadResponse = (payload: Payload): Response =>
  new Response(JSON.stringify(payload), {
    headers: { 'content-type': 'text/x-component;charset=utf-8' },
  });

// ページのペイロードへの n 回目の GET に answer(n) で答え、何回来たかを数える。
// アクションの POST には、そのページを描き直した答えを返す
const countPayloadRequests = (
  answer: (nth: number, signal: AbortSignal) => Promise<Response> = () =>
    Promise.resolve(payloadResponse(NEXT)),
): (() => number) => {
  let requested = 0;
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (init?.method === 'POST') {
      return Promise.resolve(payloadResponse({ ...NEXT, pathname: '/' }));
    }
    if (!url.endsWith('/index.rsc')) return passThrough(input, init);
    requested += 1;
    if (!(init?.signal instanceof AbortSignal)) {
      throw new Error('a payload request without a signal');
    }
    return answer(requested, init.signal);
  });
  return () => requested;
};

// 答えずに待ち、中断されたら本物の fetch と同じくその理由で reject する
const answerOnlyAnAbort = (
  _nth: number,
  signal: AbortSignal,
): Promise<Response> =>
  new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => {
      reject(signal.reason as Error);
    });
  });

// 1 回目だけネットワークが落ちている
const offlineAtFirst = (nth: number): Promise<Response> =>
  nth === 1
    ? Promise.reject(new TypeError('offline'))
    : Promise.resolve(payloadResponse(NEXT));

const pointerOnto = (link: Element): void => {
  link.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
};

const intents: ReadonlyArray<[string, (link: Element) => void]> = [
  ['a pointer moves onto', pointerOnto],
  [
    'focus lands on',
    (link) => {
      link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    },
  ],
  [
    'a press starts on',
    (link) => {
      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    },
  ],
];

const nextTask = (): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('prefetching the page a link leads to', () => {
  it.each(intents)(
    'fetches the payload when %s a link, and the navigation renders it without asking again',
    async (_, intent) => {
      const requested = countPayloadRequests();
      const screen = await render(
        <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
      );

      intent(screen.getByRole('link').element());
      await vi.waitFor(() => {
        expect(requested()).toBe(1);
      });
      await navigation.navigate('/next').finished;

      await expect.element(screen.getByText('next page')).toBeInTheDocument();
      expect(requested()).toBe(1);
    },
  );

  it('fetches a page once however many times its link is touched', async () => {
    const requested = countPayloadRequests();
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
    );
    const link = screen.getByRole('link').element();

    for (const [, intent] of intents) intent(link);
    await nextTask();

    expect(requested()).toBe(1);
  });

  it('hands what it fetched to one navigation only — the next visit fetches afresh', async () => {
    const requested = countPayloadRequests();
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
    );
    pointerOnto(screen.getByRole('link').element());
    await navigation.navigate('/next').finished;

    await navigation.back().finished;
    await navigation.navigate('/next').finished;

    // 行き・戻り（/ のペイロード）・2 度目の行きで 3 回。2 度目は取り直す
    expect(requested()).toBe(3);
  });

  it.each([
    [
      'a link that says so',
      () => (
        <a data-k8ordo-prefetch={false} href="/next">
          next
        </a>
      ),
    ],
    [
      'a link inside an element that says so',
      () => (
        <nav data-k8ordo-prefetch="false">
          <a href="/next">next</a>
        </nav>
      ),
    ],
    [
      'a link to another origin',
      () => <a href="https://example.com/next">next</a>,
    ],
    [
      'a link that opens another tab',
      () => (
        <a href="/next" target="_blank">
          next
        </a>
      ),
    ],
    [
      'a download',
      () => (
        <a download href="/next">
          next
        </a>
      ),
    ],
    ['a link to the page on screen', () => <a href="/?q=shoes">search</a>],
  ])('fetches nothing for %s', async (_, tree) => {
    const requested = countPayloadRequests();
    const screen = await render(<AppRouter pathname="/" tree={tree()} />);
    const link = screen.getByRole('link').element();

    for (const [, intent] of intents) intent(link);
    await nextTask();

    expect(requested()).toBe(0);
  });

  it('fetches a link that opts back in inside an element that opted out', async () => {
    const requested = countPayloadRequests();
    const screen = await render(
      <AppRouter
        pathname="/"
        tree={
          <nav data-k8ordo-prefetch={false}>
            <a data-k8ordo-prefetch href="/next">
              next
            </a>
          </nav>
        }
      />,
    );

    pointerOnto(screen.getByRole('link').element());
    await nextTask();

    expect(requested()).toBe(1);
  });

  it('drops what it fetched once a Server Action answers, which may have changed it', async () => {
    const requested = countPayloadRequests();
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
    );
    pointerOnto(screen.getByRole('link').element());
    await nextTask();

    await serverCallback()('action-id', []);
    await navigation.navigate('/next').finished;

    expect(requested()).toBe(2);
  });

  it('asks again when the prefetch failed', async () => {
    const requested = countPayloadRequests(offlineAtFirst);
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
    );
    pointerOnto(screen.getByRole('link').element());
    await nextTask();

    await navigation.navigate('/next').finished;

    await expect.element(screen.getByText('next page')).toBeInTheDocument();
    expect(requested()).toBe(2);
    expect(reloadDocument).not.toHaveBeenCalled();
  });

  it('cancels the prefetch a navigation took once that navigation is overtaken, and reloads nothing', async () => {
    let cancelled = false;
    const requested = countPayloadRequests((nth, signal) => {
      signal.addEventListener('abort', () => {
        cancelled = true;
      });
      return answerOnlyAnAbort(nth, signal);
    });
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
    );
    pointerOnto(screen.getByRole('link').element());
    navigation.navigate('/next').finished?.catch(() => undefined);

    await navigation.back().finished;
    await nextTask();

    expect(requested()).toBe(1);
    expect(cancelled).toBe(true);
    expect(reloadDocument).not.toHaveBeenCalled();
    expect(screen.container.textContent).toBe('next');
  });
});
