import { notFound, usePathname } from '@k8ordo/router';
import { Component, Suspense, use, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { cleanup, render } from 'vitest-browser-react';

import { AppRouter, setDocumentClient } from './app-router';
import { FallbackBoundary, ShowNotFound } from './fallback-boundary';
import { reportCaught } from './page-boundary';
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
  // JSON では運べない木（React の要素）を持つペイロード。本文の
  // {"$payload": 名前} を、読み解くたびにここで作った新しいペイロードに替える
  payloads: new Map<string, () => unknown>(),
}));

// 届いた分だけで JSON になれば、ストリームの終わりを待たずに読み終える。
// ペイロードは頭が届いた時点で解決し、残りは同じリクエストで後から届く
const readJson = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  text = '',
): Promise<string> => {
  const { done, value } = await reader.read();
  const next =
    value === undefined ? text : text + new TextDecoder().decode(value);
  if (done) return next;
  try {
    JSON.parse(next);
    return next;
  } catch {
    return readJson(reader, next);
  }
};

// 復号は RSC の配線(ビルドが作る仮想モジュール)ごと差し替え、JSON で運ぶ。
// ここで確かめたいのは、届いたペイロードをどう扱うかだけ
vi.mock('@vitejs/plugin-rsc/browser', () => ({
  createFromReadableStream: async (
    stream: ReadableStream<Uint8Array>,
  ): Promise<unknown> => {
    const text = await readJson(stream.getReader());
    rsc.decoding += 1;
    await rsc.imports;
    const parsed = JSON.parse(text) as { $payload?: string };
    return parsed.$payload === undefined
      ? parsed
      : rsc.payloads.get(parsed.$payload)?.();
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

// ペイロードは search を付けて頼まれる（search を読むページのため）ので、
// パスだけで見分ける
const urlOf = (input: RequestInfo | URL): URL =>
  new URL(String(input instanceof Request ? input.url : input), location.href);

const asksForPayload = (input: RequestInfo | URL): boolean =>
  urlOf(input).pathname.endsWith('/index.rsc');

// ページのペイロードとアクションの答えを、どちらもこの 1 枚で返すサーバー
const answerWith = (payload: Payload, status = 200): void => {
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    if (!asksForPayload(input) && init?.method !== 'POST') {
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
    if (!asksForPayload(input)) return passThrough(input, init);
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

// 訪問者が戻る。戻る遷移が確定した時点で、取りかけの遷移は中断されている。
// finished を待たないのは、WebKit が取りかけの遷移を中断させた側の finished
// まで AbortError で reject するため（戻る遷移そのものは確定している）
const moveBack = async (): Promise<void> => {
  const back = navigation.back();
  back.finished?.catch(() => undefined);
  await back.committed;
};

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
  rsc.payloads.clear();
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
    await moveBack();
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

    await moveBack();

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

// ペイロードの URL の search ごとに答えを変えるサーバー。頼まれた search を返す
const answerBySearch = (answer: (search: string) => Payload): string[] => {
  const asked: string[] = [];
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    if (!asksForPayload(input)) return passThrough(input, init);
    const { search } = urlOf(input);
    asked.push(search);
    return Promise.resolve(payloadResponse(answer(search)));
  });
  return asked;
};

// ページのペイロードへの n 回目の GET に answer(n) で答え、何回来たかを数える。
// アクションの POST には、そのページを描き直した答えを返す
const countPayloadRequests = (
  answer: (nth: number, signal: AbortSignal) => Promise<Response> = () =>
    Promise.resolve(payloadResponse(NEXT)),
): (() => number) => {
  let requested = 0;
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === 'POST') {
      return Promise.resolve(payloadResponse({ ...NEXT, pathname: '/' }));
    }
    if (!asksForPayload(input)) return passThrough(input, init);
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
    const requested = recordPayloadRequests();
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/next">next</a>} />,
    );
    pointerOnto(screen.getByRole('link').element());
    await navigation.navigate('/next').finished;

    await navigation.back().finished;
    await navigation.navigate('/next').finished;

    // 行きと 2 度目の行きで 1 回ずつ。2 度目は取り直す。戻りが / を何回
    // 取るかは数えない: Firefox は iframe の中でだけ、戻る遷移の handler を
    // 2 回走らせる
    expect(
      requested.filter((pathname) => pathname === '/next/index.rsc'),
    ).toHaveLength(2);
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
      <AppRouter
        pathname="/"
        tree={
          // 動かしていない本物のポインタは (0, 0) にあり、左上に描いたリンクに
          // 重なる。戻ったあとで Chromium がホバーを計算し直すと本物の
          // pointerover が届き、先読みを正しくやり直す。数えたいのは遷移と
          // 戻りが頼んだものだけなので、本物のポインタはリンクに当てない
          <a href="/next" style={{ pointerEvents: 'none' }}>
            next
          </a>
        }
      />,
    );
    pointerOnto(screen.getByRole('link').element());
    navigation.navigate('/next').finished?.catch(() => undefined);

    await moveBack();
    await nextTask();

    expect(requested()).toBe(1);
    expect(cancelled).toBe(true);
    expect(reloadDocument).not.toHaveBeenCalled();
    expect(screen.container.textContent).toBe('next');
  });
});

// ペイロードを取りに来た pathname を順に集め、どれにも NEXT で答える
const recordPayloadRequests = (): string[] => {
  const requested: string[] = [];
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      String(input instanceof Request ? input.url : input),
      location.href,
    );
    if (!url.pathname.endsWith('/index.rsc')) return passThrough(input, init);
    requested.push(url.pathname);
    return Promise.resolve(
      new Response(
        JSON.stringify({
          tree: 'next page',
          pathname: '/next',
          client: RUNNING,
        }),
        { headers: { 'content-type': 'text/x-component;charset=utf-8' } },
      ),
    );
  });
  return requested;
};

describe('under a base', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/site/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('fetches the payload that sits beside the page under the base', async () => {
    const requested = recordPayloadRequests();
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    await navigation.navigate('/site/next').finished;

    await expect.element(screen.getByText('next page')).toBeInTheDocument();
    expect(requested).toStrictEqual(['/site/next/index.rsc']);
  });

  it('leaves a URL outside the base to the browser', async () => {
    const requested = recordPayloadRequests();
    const screen = await render(<AppRouter pathname="/" tree="first page" />);

    // 引き受けなければ文書の読み込みになってテストが落ちるので、ここでは
    // テストがルーターを演じる。引き受けなかったことは、取りに行かないことで見る
    navigation.addEventListener('navigate', interceptEverything);
    try {
      await navigation.navigate('/elsewhere').finished;
    } finally {
      navigation.removeEventListener('navigate', interceptEverything);
    }

    expect(requested).toStrictEqual([]);
    expect(screen.container.textContent).toBe('first page');
  });

  it('fetches a link below the base ahead, at the payload beside its page', async () => {
    const requested = recordPayloadRequests();
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/site/next">next</a>} />,
    );

    pointerOnto(screen.getByRole('link').element());
    await nextTask();

    expect(requested).toStrictEqual(['/site/next/index.rsc']);
  });

  it('fetches nothing ahead for a link outside the base', async () => {
    const requested = recordPayloadRequests();
    const screen = await render(
      <AppRouter pathname="/" tree={<a href="/elsewhere">elsewhere</a>} />,
    );

    pointerOnto(screen.getByRole('link').element());
    await nextTask();

    expect(requested).toStrictEqual([]);
  });
});

describe('a page that reads the search', () => {
  // 本文は JSON で運ぶので、木は文字列にする
  const searched = (search: string): Payload => ({
    tree: `results for ${search}`,
    pathname: '/',
    client: RUNNING,
    search,
  });

  it('is loaded again, with the new search, when a navigation moves it', async () => {
    const asked = answerBySearch(searched);
    const screen = await render(
      <AppRouter
        pathname={location.pathname}
        search={location.search}
        tree="first"
      />,
    );

    await navigation.navigate(`${location.pathname}?q=shoes`, {
      history: 'replace',
    }).finished;

    await expect
      .element(screen.getByText('results for ?q=shoes'))
      .toBeInTheDocument();
    expect(asked).toStrictEqual(['?q=shoes']);
  });

  it('is left alone by a navigation that keeps its search', async () => {
    const requested = countPayloadRequests();
    await render(
      <AppRouter
        pathname={location.pathname}
        search={location.search}
        tree={<p>first</p>}
      />,
    );

    await navigation.navigate(location.href, { history: 'replace' }).finished;

    expect(requested()).toBe(0);
  });

  it('leaves a page that does not read the search alone when it moves', async () => {
    const requested = countPayloadRequests();
    await render(
      <AppRouter pathname={location.pathname} tree={<p>first</p>} />,
    );

    await navigation.navigate(`${location.pathname}?q=shoes`, {
      history: 'replace',
    }).finished;

    expect(requested()).toBe(0);
  });
});

// 殻の fallback.tsx がブラウザで描くもの。値を URL から読み、データに無ければ
// notFound() と言う。データはテストが持つ
const posts = new Set<string>();

function PostFromUrl(): ReactNode {
  const id = usePathname().split('/').at(-1) ?? '';
  if (!posts.has(id)) notFound();
  return <p>post {id}</p>;
}

// テストが error.tsx の代わりに置く境界
class Errors extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override render(): ReactNode {
    return this.state.failed ? 'error.tsx' : this.props.children;
  }
}

const shellTree = (leaf: ReactNode = <PostFromUrl />): ReactNode => (
  <Errors>
    <FallbackBoundary>{leaf}</FallbackBoundary>
  </Errors>
);

// /posts/:id の殻のペイロード。読み解くたびに同じ形の新しい木を返す
const SHELL = { $payload: 'shell' };
const shellPayload = (notFoundTree: ReactNode = 'nothing here'): Payload => ({
  tree: shellTree(),
  notFound: notFoundTree,
  pathname: '/posts/!fallback',
  client: RUNNING,
});

const jsonResponse = (body: unknown): Response =>
  new Response(JSON.stringify(body), {
    headers: { 'content-type': 'text/x-component;charset=utf-8' },
  });

// ページのペイロードを pathname ごとに答える。答えを待たせたいものは
// 約束で渡す
const answerByPathname = (
  answers: Record<string, () => Promise<Response>>,
): void => {
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    if (!asksForPayload(input)) return passThrough(input, init);
    const answer = answers[urlOf(input).pathname];
    if (answer === undefined) {
      throw new Error(`no answer for ${urlOf(input).pathname}`);
    }
    return answer();
  });
};

const held = (): {
  readonly answer: () => Promise<Response>;
  readonly release: (response: Response) => void;
} => {
  const { promise, resolve } = Promise.withResolvers<Response>();
  return { answer: () => promise, release: resolve };
};

const renderRouter = (tree: ReactNode = 'first page') =>
  render(<AppRouter pathname="/" tree={tree} />, {
    createRootOptions: { onCaughtError: reportCaught },
  });

describe('a shell', () => {
  let errors: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    posts.clear();
    posts.add('3');
    rsc.payloads.set('shell', () => shellPayload());
    errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    errors.mockRestore();
  });

  it('shows the not-found its payload carries in place when its fallback.tsx says notFound()', async () => {
    answerByPathname({
      '/posts/999/index.rsc': () => Promise.resolve(jsonResponse(SHELL)),
    });
    const screen = await renderRouter();

    await navigation.navigate('/posts/999').finished;

    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('nothing here');
    });
    expect(location.pathname).toBe('/posts/999');
    expect(reloadDocument).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });

  it('hands anything else it throws on to error.tsx', async () => {
    rsc.payloads.set('shell', () => ({
      ...shellPayload(),
      tree: shellTree(<Broken />),
    }));
    answerByPathname({
      '/posts/3/index.rsc': () => Promise.resolve(jsonResponse(SHELL)),
    });
    const screen = await renderRouter();

    await navigation.navigate('/posts/3').finished;

    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('error.tsx');
    });
    expect(reloadDocument).not.toHaveBeenCalled();
  });

  it('hands a notFound() on to error.tsx when the payload carries no not-found', async () => {
    rsc.payloads.set('shell', () => ({
      ...shellPayload(),
      notFound: undefined,
    }));
    answerByPathname({
      '/posts/999/index.rsc': () => Promise.resolve(jsonResponse(SHELL)),
    });
    const screen = await renderRouter();

    await navigation.navigate('/posts/999').finished;

    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('error.tsx');
    });
  });

  it('renders the next value of the same shell once its navigation applies, after a notFound() said on the way', async () => {
    const next = held();
    answerByPathname({
      '/posts/3/index.rsc': () => Promise.resolve(jsonResponse(SHELL)),
      '/posts/4/index.rsc': next.answer,
    });
    const screen = await renderRouter();
    await navigation.navigate('/posts/3').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('post 3');
    });

    // URL は先に移る。画面の殻は 4 を読み、まだデータに無いので notFound()
    const arrived = navigation.navigate('/posts/4').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('');
    });
    posts.add('4');
    next.release(jsonResponse(SHELL));
    await arrived;

    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('post 4');
    });
  });

  it('shows no not-found while a navigation to another page is under way', async () => {
    const about = held();
    answerByPathname({
      '/posts/3/index.rsc': () => Promise.resolve(jsonResponse(SHELL)),
      '/about/index.rsc': about.answer,
    });
    const screen = await renderRouter();
    await navigation.navigate('/posts/3').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('post 3');
    });
    const inserted: string[] = [];
    const observer = new MutationObserver(() => {
      inserted.push(screen.container.textContent);
    });
    observer.observe(screen.container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const arrived = navigation.navigate('/about').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('');
    });
    about.release(
      jsonResponse({ tree: 'about page', pathname: '/about', client: RUNNING }),
    );
    await arrived;

    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('about page');
    });
    observer.disconnect();
    expect(inserted).not.toContain('nothing here');
    expect(inserted).not.toContain('error.tsx');
  });

  it('leaves a newer page alone when a swap is asked for after it applied', async () => {
    const shown: Array<(() => boolean) | null> = [];
    rsc.payloads.set('shell', () => ({
      ...shellPayload(),
      tree: shellTree(
        <Remember
          onShow={(show) => {
            shown.push(show);
          }}
        />,
      ),
    }));
    answerByPathname({
      '/posts/3/index.rsc': () => Promise.resolve(jsonResponse(SHELL)),
      '/next/index.rsc': () => Promise.resolve(jsonResponse(NEXT)),
    });
    const screen = await renderRouter();
    await navigation.navigate('/posts/3').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('post 3');
    });
    const stale = shown.at(-1);
    expect(stale).toBeTypeOf('function');

    await navigation.navigate('/next').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('next page');
    });
    (stale as () => boolean)();
    await nextTask();

    expect(screen.container.textContent).toBe('next page');
  });

  it('keeps the request of the shell its not-found came with', async () => {
    const signalOf = answerHeldOpen(SHELL);
    const screen = await renderRouter();

    await navigation.navigate('/posts/999').finished;
    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('nothing here');
    });
    await nextTask();

    expect(signalOf()?.aborted).toBe(false);
  });
});

describe('a page still streaming in', () => {
  it('keeps its request when it is applied right after the page before it went on screen', async () => {
    const signalOf = answerEachHeldOpen();
    rsc.payloads.set('/a/index.rsc', () => ({
      tree: <LeavesOnceShown to="/b" />,
      pathname: '/a',
      client: RUNNING,
    }));
    rsc.payloads.set('/b/index.rsc', () => ({
      tree: (
        <>
          page b
          <Suspense fallback={null}>
            <StillToCome on={signalOf('/b/index.rsc')} />
          </Suspense>
        </>
      ),
      pathname: '/b',
      client: RUNNING,
    }));
    const screen = await renderRouter();

    navigation.navigate('/a').finished?.catch(() => undefined);

    await vi.waitFor(() => {
      expect(screen.container.textContent).toBe('page b');
    });
    // 置き換えられたページの分は、次のページが画面に出たら取り消される。
    // WebKit ではその effect が次のタスクより後に回ることがあるので、取り消し
    // まで待ってから、次のページの分が残っていることを確かめる
    await vi.waitFor(() => {
      expect(signalOf('/a/index.rsc')?.aborted).toBe(true);
    });
    expect(signalOf('/b/index.rsc')?.aborted).toBe(false);
    expect(reloadDocument).not.toHaveBeenCalled();
  });
});

// 画面に出たところで、訪問者が次のページへ移るページ。それを画面に出した
// コミットが React の持ち時間（5ms）を使い切るので、React は手を返し、
// コミットの passive effect は次のタスクに回る。次のページはその前に当たる。
// 負荷の高いマシンで、データを待つページの本体が届いた直後にクリックが
// 来たときの順番
function LeavesOnceShown({ to }: { to: string }): ReactNode {
  useLayoutEffect(() => {
    navigation.navigate(to).finished?.catch(() => undefined);
    const start = performance.now();
    while (performance.now() - start < 20) {
      // コミットを長引かせる
    }
  }, [to]);
  return 'page a';
}

// ペイロードの頭のあとで、同じリクエストに乗って届く部分。リクエストが
// 取り消されると、届くはずだった所に中断が投げられる（Flight がそうする）
const stillToCome = new WeakMap<AbortSignal, Promise<never>>();
function StillToCome({ on }: { on: AbortSignal | undefined }): ReactNode {
  if (on === undefined) throw new Error('the request was not made');
  let rest = stillToCome.get(on);
  if (rest === undefined) {
    rest = new Promise<never>((_resolve, reject) => {
      on.addEventListener('abort', () => {
        reject(on.reason as Error);
      });
    });
    stillToCome.set(on, rest);
  }
  return use(rest);
}

// どのページのペイロードにも、頭だけを届けて残りは届く途中のままにする。
// ペイロードは rsc.payloads にその URL の pathname で置く。頼まれたリクエストの
// signal を pathname ごとに返す
function answerEachHeldOpen(): (pathname: string) => AbortSignal | undefined {
  const signals = new Map<string, AbortSignal>();
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    if (!asksForPayload(input)) return passThrough(input, init);
    const { pathname } = urlOf(input);
    if (init?.signal instanceof AbortSignal) signals.set(pathname, init.signal);
    return Promise.resolve(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(
              new TextEncoder().encode(JSON.stringify({ $payload: pathname })),
            );
          },
        }),
        { headers: { 'content-type': 'text/x-component;charset=utf-8' } },
      ),
    );
  });
  return (pathname) => signals.get(pathname);
}

function Broken(): ReactNode {
  throw new Error('broken');
}

// 描かれた殻が受け取った、その場で not-found を出す関数をテストに渡す
function Remember({
  onShow,
}: {
  onShow: (show: (() => boolean) | null) => void;
}): ReactNode {
  onShow(use(ShowNotFound));
  return <PostFromUrl />;
}

// ペイロードの頭だけを届け、残りはまだ同じリクエストで届く途中のままにする。
// そのリクエストの signal を返す
function answerHeldOpen(body: unknown): () => AbortSignal | undefined {
  let signal: AbortSignal | undefined;
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    if (!asksForPayload(input)) return passThrough(input, init);
    signal = init?.signal ?? undefined;
    return Promise.resolve(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(JSON.stringify(body)));
          },
        }),
        { headers: { 'content-type': 'text/x-component;charset=utf-8' } },
      ),
    );
  });
  return () => signal;
}
