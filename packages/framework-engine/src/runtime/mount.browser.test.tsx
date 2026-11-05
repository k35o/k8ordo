import { usePathname } from '@k8ordo/router';
import { Suspense, use, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import type { Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { AppRouter, setDocumentClient, setPayloadReader } from './app-router';
import { DocumentRoot } from './document-root';
import { mount, renderedHere } from './mount';
import type { Payload } from './payload';
import { TreePathname } from './tree-pathname';

const CLIENT = '/assets/index-running.js';

// @k8ordo/i18n の文言と同じく、描くたびに URL のロケールの区間を読む。
// hydrate の間は runtime が置いた pathname を読む（i18n と同じ名前）
const HYDRATING = Symbol.for('@k8ordo/i18n/hydrating-pathname');
const hydrating = globalThis as { [HYDRATING]?: string | undefined };

const Segment = ({ name }: { name: string }) => (
  <p data-name={name}>
    {(hydrating[HYDRATING] ?? location.pathname).split('/')[1]}
  </p>
);

// ルーターがいまどこを指しているか。HTML には何も書かない（木の pathname は
// サーバーの描画には無い）
const seen: Array<{ pathname: string; tree: string | null }> = [];
const Router = () => {
  const pathname = usePathname();
  const tree = use(TreePathname);
  useLayoutEffect(() => {
    seen.push({ pathname, tree });
  });
  return null;
};

// 境界の中身は殻より後で、入れ子の中身はさらに後で hydrate される
const treeOf = (): ReactNode => (
  <main>
    <Segment name="shell" />
    <Suspense fallback="…">
      <Segment name="outer" />
      <Suspense fallback="…">
        <Segment name="inner" />
      </Suspense>
    </Suspense>
    <Router />
  </main>
);

const payloadOf = (tree: ReactNode, pathname: string): Payload => ({
  tree,
  pathname,
  client: CLIENT,
});

const NOT_FOUND = '/__k8ordo-not-found__/__k8ordo-not-found__';

let home = '';
const placed: Element[] = [];
const roots: Root[] = [];

// サーバーが rendered のために描いた HTML を文書に置き、ブラウザを at に置く
const serverHtml = (rendered: string, at: string): HTMLElement => {
  history.replaceState(null, '', rendered);
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <DocumentRoot>
      <AppRouter arrived={payloadOf(treeOf(), rendered)} />
    </DocumentRoot>,
  );
  document.body.append(container);
  placed.push(container);
  history.replaceState(null, '', at);
  return container;
};

const mounted = (...args: Parameters<typeof mount>): Root => {
  const root = mount(...args);
  roots.push(root);
  return root;
};

const paragraphs = (container: HTMLElement): HTMLParagraphElement[] => [
  ...container.querySelectorAll('p'),
];

const texts = (container: HTMLElement): Array<string | null> =>
  paragraphs(container).map((node) => node.textContent);

// ペイロードの要求にだけ答える。読み解いた中身は setPayloadReader が決める
const answerPayloads = (): void => {
  const passThrough = globalThis.fetch;
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      input instanceof Request ? input.url : input,
      location.href,
    );
    if (!url.pathname.endsWith('/index.rsc')) return passThrough(input, init);
    return Promise.resolve(
      new Response('', {
        headers: { 'content-type': 'text/x-component;charset=utf-8' },
      }),
    );
  });
};

// ルーターが外れた後の、元の URL へ戻るあいだだけルーターを演じる
const interceptEverything = (event: NavigateEvent): void => {
  if (event.canIntercept) event.intercept();
};

beforeEach(() => {
  home = location.href;
  seen.length = 0;
  setDocumentClient(CLIENT);
});

afterEach(async () => {
  for (const root of roots.splice(0)) root.unmount();
  for (const container of placed.splice(0)) container.remove();
  hydrating[HYDRATING] = undefined;
  vi.unstubAllGlobals();
  // AppRouter は同一オリジンの URL をすべて引き受けるので、外してから戻る
  navigation.addEventListener('navigate', interceptEverything);
  try {
    await navigation.navigate(home, { history: 'replace' }).finished;
  } finally {
    navigation.removeEventListener('navigate', interceptEverything);
  }
});

describe('renderedHere', () => {
  it('holds a pathname that differs from the browser’s by a trailing slash to be the browser’s', () => {
    history.replaceState(null, '', '/en/docs');

    expect(renderedHere('/en/docs/')).toBe(true);
    expect(renderedHere('/en/missing')).toBe(false);
  });

  it('compares the pathname with the browser’s below the base Vite serves the application under', () => {
    vi.stubEnv('BASE_URL', '/site/');
    try {
      history.replaceState(null, '', '/site/en/docs');

      expect(renderedHere('/en/docs')).toBe(true);
      expect(renderedHere('/site/en/docs')).toBe(false);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe('mount', () => {
  it('hydrates HTML rendered for the pathname the browser is at, keeping the nodes the server wrote', async () => {
    const container = serverHtml('/en/docs', '/en/docs');
    const written = paragraphs(container);
    const errors: unknown[] = [];

    mounted(container, payloadOf(treeOf(), '/en/docs'), undefined, {
      onRecoverableError: (error) => {
        errors.push(error);
      },
    });

    await vi.waitFor(() => {
      expect(seen).toStrictEqual([{ pathname: '/en/docs', tree: '/en/docs' }]);
    });
    expect(paragraphs(container)).toStrictEqual(written);
    expect(texts(container)).toStrictEqual(['en', 'en', 'en']);
    expect(errors).toStrictEqual([]);
  });

  it('hydrates HTML rendered for another pathname (a prerendered 404) as it was written, then renders it again where the browser is', async () => {
    const container = serverHtml(NOT_FOUND, '/en/missing');
    const written = paragraphs(container);
    expect(texts(container)).toStrictEqual([
      '__k8ordo-not-found__',
      '__k8ordo-not-found__',
      '__k8ordo-not-found__',
    ]);
    const errors: unknown[] = [];

    mounted(
      container,
      payloadOf(treeOf(), NOT_FOUND),
      Promise.resolve(payloadOf(treeOf(), NOT_FOUND)),
      {
        onRecoverableError: (error) => {
          errors.push(error);
        },
      },
    );

    await vi.waitFor(() => {
      expect(texts(container)).toStrictEqual(['en', 'en', 'en']);
    });
    expect(paragraphs(container)).toStrictEqual(written);
    expect(errors).toStrictEqual([]);
    expect(seen.at(-1)).toStrictEqual({
      pathname: '/en/missing',
      tree: '/en/missing',
    });
    expect(hydrating[HYDRATING]).toBeUndefined();
  });

  it('leaves the page a navigation applied before the payload was read again on screen', async () => {
    const next = payloadOf(<p data-name="next">next page</p>, '/en/next');
    setPayloadReader(() => Promise.resolve(next));
    answerPayloads();
    const container = serverHtml(NOT_FOUND, '/en/missing');
    const reread = Promise.withResolvers<Payload>();
    mounted(container, payloadOf(treeOf(), NOT_FOUND), reread.promise);
    await vi.waitFor(() => {
      expect(seen.length).toBeGreaterThan(0);
    });
    // 遷移を握るリスナーは、hydrate のコミットの後の effect で付く
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    await navigation.navigate('/en/next').finished;
    reread.resolve(payloadOf(treeOf(), NOT_FOUND));
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    expect(texts(container)).toStrictEqual(['next page']);
  });
});
