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
const answerWith = (payload: Payload): void => {
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!url.endsWith('/index.rsc') && init?.method !== 'POST') {
      return passThrough(input, init);
    }
    return Promise.resolve(
      new Response(JSON.stringify(payload), {
        headers: { 'content-type': 'text/x-component;charset=utf-8' },
      }),
    );
  });
};

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
