'use client';

import {
  NavigationGeneration,
  normalizePathname,
  PathnameProvider,
  useInterceptedNavigation,
  withoutBase,
} from '@k8ordo/router';
import {
  createContext,
  startTransition,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode, RefObject } from 'react';

import { preloadClientFiles, readClientFiles } from './client-files';
import { whenClientReady } from './client-ready';
import { ShowNotFound } from './fallback-boundary';
import { doneHydrating } from './hydrating-pathname';
import { isPayload } from './is-payload';
import type { Payload } from './payload';
import { payloadPathFor } from './payload-path';
import { createPageCache, prefetchInView, prefetchTargetOf } from './prefetch';
import type { PageCache } from './prefetch';
import {
  markNavigated,
  navigationsApplied,
  Recover,
  reloadInstead,
} from './recover';
import { TreePathname } from './tree-pathname';

/**
 * Where a Server Action's answer lands. The callback has to be registered
 * before any client component can call one, which is earlier than a component
 * can offer its own setter — so `answerAction` is module-level and the
 * mounted router lends it a way to apply what comes back, and to drop the
 * pages it fetched ahead, which the action may have changed.
 */
let mounted: {
  readonly apply: (payload: Payload, pathname: string) => void;
  readonly forgetPrefetched: () => void;
} | null = null;

/**
 * The client this document runs, as named by the payload its HTML was
 * rendered from — the same render that told the HTML which script to load.
 * A fact about the document, not about a component, which is why it is not
 * a prop.
 */
let documentClient: string | undefined;

export const setDocumentClient = (client: string): void => {
  documentClient = client;
};

/**
 * A payload rendered for another client comes from a deploy this document
 * predates, and may name client components its script has no entry for.
 * That fails only once the tree renders, where the page's `error.tsx` catches
 * it before `Recover` can — so it is decided before anything renders, and a
 * document load brings the script that can.
 */
const canRender = (payload: Payload): boolean =>
  payload.client === documentClient;

/**
 * How a payload is waited for before its tree is applied: until the client
 * components it renders have loaded — one still loading suspends where it
 * renders, and a `<Suspense>` the page just brought shows its fallback in a
 * page already on screen — and what the page sends once its data is in,
 * except under a `<Suspense>`, whose fallback stands in for it as a
 * transition leaves it.
 */
const WHEN_APPLIED = { rows: 'leave' } as const;

/**
 * Whether a page's payload is a file — the same until the next deploy,
 * however often it is asked for. Under `vite dev` a static application's
 * pages are rendered per request too.
 */
const payloadsAreFiles = (): boolean =>
  // 読むたびに見る。テストがモードを切り替える
  import.meta.env.K8ORDO_MODE === 'static' && !import.meta.env.DEV;

/**
 * What a Server Action's answer does to the document, once it is read.
 * `sent` is `navigationsApplied()` as the action was sent, and `url` where
 * it was posted: the answer is that page.
 */
export const answerAction = async (
  payload: Payload,
  sent: number,
  url: string,
): Promise<unknown> => {
  mounted?.forgetPrefetched();
  // An action that redirected has no page to apply: the visitor is going
  // somewhere else, and the router takes them there.
  if (payload.redirect !== undefined) {
    await navigation.navigate(payload.redirect).finished;
    return undefined;
  }
  if (!canRender(payload)) return reloadInstead();
  // The action's answer arrives with the page it re-rendered, so the screen
  // is up to date by the time the caller has its value — once the client
  // components it renders have loaded, as for a navigation.
  await whenClientReady([payload.tree, payload.notFound], WHEN_APPLIED);
  // A navigation applied another page while the action ran or its answer
  // loaded: the answer is the page the visitor left, and would put it back
  // under the URL they are at. The caller still gets its value.
  if (navigationsApplied() === sent) {
    mounted?.apply(payload, normalizePathname(new URL(url).pathname));
  }
  return payload.returnValue;
};

// ペイロードの読み方はブラウザの入口から受け取る。このモジュールは SSR でも
// 描かれ、@vitejs/plugin-rsc/browser は読み込まれただけで client 参照の
// 読み込み口を自分のものに差し替える。SSR に入ると、client コンポーネントの
// CSS と JS を HTML に <link> する SSR の読み込み口が上書きされる
let readPayload: (
  stream: ReadableStream<Uint8Array>,
) => Promise<Payload> = () =>
  Promise.reject(new Error('k8ordo: payloads are read in the browser only'));

export const setPayloadReader = (
  read: (stream: ReadableStream<Uint8Array>) => Promise<Payload>,
): void => {
  readPayload = read;
};

type Stream = {
  /** Stops the request: nothing will render what is still to come. */
  readonly cancel: () => void;
  /** Unties the request from the signal it was fetched under. */
  readonly keep: () => void;
};

/**
 * The request each fetched payload is still streaming in on. A payload
 * resolves once its top arrives, and a page that awaits its data arrives
 * after — so once its tree is applied, what is still to come is part of a
 * page React is rendering. Cancelled then, the abort would be thrown inside
 * that page, where `Recover` takes it for a page that failed and loads the
 * document. The signal a payload was fetched under cancels it only until its
 * tree is applied (`keep`); after that, the router cancels it once another
 * tree has replaced it.
 */
const streams = new WeakMap<Payload, Stream>();

/**
 * A page's payload, or `null` when what came back is not one — a file the
 * host serves, or a URL nothing answers. It resolves once the client
 * components the page renders have loaded, so a prefetch has those in hand
 * too; what a static build listed of their files is linked as the request
 * leaves.
 */
const fetchPage = async (
  payloadPath: string,
  signal: AbortSignal,
  priority: RequestPriority = 'auto',
): Promise<Payload | null> => {
  signal.throwIfAborted();
  preloadClientFiles(payloadPath);
  const request = new AbortController();
  const cancel = (): void => {
    request.abort(signal.reason);
  };
  signal.addEventListener('abort', cancel, { once: true });
  const response = await fetch(payloadPath, {
    signal: request.signal,
    priority,
  });
  if (!isPayload(response)) return null;
  const payload = await readPayload(
    response.body as ReadableStream<Uint8Array>,
  );
  await whenClientReady([payload.tree, payload.notFound], WHEN_APPLIED);
  streams.set(payload, {
    cancel: () => {
      request.abort();
    },
    keep: () => {
      signal.removeEventListener('abort', cancel);
    },
  });
  return payload;
};

/**
 * A payload's trees still streaming in on its request: the page, and a
 * shell's not-found, which is serialized after it and may be what is on
 * screen once the shell swapped it in.
 */
type Streaming = {
  readonly trees: readonly ReactNode[];
  readonly cancel: () => void;
  /** The `order` of what was applied with it. */
  readonly order: number;
};

/**
 * What is applied: a page's tree, and — a shell's only — the not-found its
 * fallback.tsx shows in place when the value turns out to have nothing.
 */
type Applied = {
  readonly tree: ReactNode;
  readonly notFound: ReactNode | undefined;
  /** How many payloads this document had applied, this one included. */
  readonly order: number;
  /**
   * The pathname the tree is the page of, in the URL's terms and normalized
   * (`TreePathname`); `null` in the HTML render, which has no URL.
   */
  readonly pathname: string | null;
};

/** A navigation's payload, with the pathname of the URL it was loaded for. */
type Loaded = { readonly payload: Payload; readonly pathname: string };

/** How many payloads this document has applied. It has one router. */
let applies = 0;

/**
 * Read by no component: it changes so that React finishes hydrating. React
 * hydrates a Suspense boundary at its own pace, when the browser is idle,
 * and says nowhere when it is done; a context that changes above a boundary
 * not yet hydrated makes React hydrate it before the transition that changed
 * the context commits, so that commit is where all of the HTML is hydrated.
 */
const Hydrating = createContext(false);

/**
 * Takes over the request of a payload whose tree is being applied, records
 * the search it was rendered with, and returns what applying it puts in state.
 */
const hold = (
  streaming: RefObject<Streaming[]>,
  searchApplied: RefObject<string | undefined>,
  payload: Payload,
  pathname: string,
): Applied => {
  // HTML の hydrate を待たずに来た遷移の木は、行き先の URL で描く
  doneHydrating();
  applies += 1;
  searchApplied.current = payload.search;
  const stream = streams.get(payload);
  if (stream !== undefined) {
    stream.keep();
    // ファイルは最後まで読ませる。ページは置き場に残って次の訪問に渡るので、
    // 途中で切ると、戻ったときに欠けたページを出す
    if (!payloadsAreFiles()) {
      streaming.current.push({
        trees:
          payload.notFound === undefined
            ? [payload.tree]
            : [payload.tree, payload.notFound],
        cancel: stream.cancel,
        order: applies,
      });
    }
  }
  return {
    tree: payload.tree,
    notFound: payload.notFound,
    order: applies,
    pathname,
  };
};

/**
 * The router's page cache, made the first time it is asked for. It is only
 * ever asked for in an event or an effect; made as `useRef`'s initial value
 * it would be built, and thrown away, on every render.
 */
const cacheIn = (
  ref: RefObject<PageCache<Payload | null> | null>,
): PageCache<Payload | null> =>
  (ref.current ??= createPageCache(fetchPage, { files: payloadsAreFiles() }));

/**
 * Where a page's payload is asked for: its path, with the URL's search. A page
 * that reads the search is rendered for it; for any other page the server
 * ignores it — and a static host, which has no such page, ignores it anyway.
 */
const payloadUrlFor = (url: URL): string =>
  `${payloadPathFor(url.pathname)}${url.search}`;

/** What starts a prefetch: a pointer onto a link, focus on one, a press. */
const INTENTS = ['pointerover', 'focusin', 'pointerdown'] as const;

/**
 * The client half under the framework: the tree comes from the server, so
 * there is no route table in the browser at all — only navigation. The
 * router supplies that (interception, a deferred render, and resolving the
 * platform's `finished` once the new tree is on screen); this component
 * supplies what to load, which is the next page's RSC payload.
 *
 * A pathname the application does not have is still the server's answer: it
 * renders `not-found.tsx` and this renders whatever came back.
 */
export function AppRouter({
  arrived,
  reread,
}: {
  /** The payload the document's HTML was rendered from. */
  arrived: Payload;
  /**
   * The same payload read again, when the HTML was rendered for another
   * pathname than the browser's: hydration keeps what the server wrote, and
   * this copy — the same page, every element new — renders it again at the
   * URL once all of it is hydrated.
   */
  reread?: Promise<Payload> | undefined;
}): ReactNode {
  const [latest, setLatest] = useState<Applied>(() => ({
    tree: arrived.tree,
    notFound: arrived.notFound,
    order: 0,
    // payload の pathname は表の語で、殻では殻の pathname なので使わない
    pathname:
      typeof location === 'undefined'
        ? null
        : normalizePathname(location.pathname),
  }));
  const current = useDeferredValue(latest);
  const [hydrating, setHydrating] = useState(reread !== undefined);
  const prefetched = useRef<PageCache<Payload | null>>(null);
  // The search the tree last applied was rendered with — `undefined` when its
  // page does not read the search, which is every page that did not declare
  // it. Only for such a page does a navigation that keeps the pathname load.
  const searchApplied = useRef(arrived.search);
  // The trees applied whose requests may still be streaming.
  const streaming = useRef<Streaming[]>([]);
  // Navigations whose page has not arrived. The URL commits before the next
  // tree does, so a shell still on screen reads the URL it is being left for
  // and may find nothing there: its not-found is not shown meanwhile.
  // Counted here rather than read from `usePendingPathname`, which clears in
  // a layout effect of this component — after the boundary's
  // `componentDidCatch` in the same commit, which would refuse the swap the
  // applied shell asks for.
  const loading = useRef(0);

  // 別の pathname の HTML は、境界がすべて hydrate を終えてから描き直す。
  // その前に i18n が今の URL を読むと、まだ hydrate していない境界が HTML と
  // 食い違い、React がその境界を作り直す
  useEffect(() => {
    if (!hydrating) return;
    startTransition(() => {
      setHydrating(false);
    });
  }, [hydrating]);

  // hydrate を終えたコミットの中で URL を返す。次の描画が先に来ても、
  // それは今の URL で描く
  useLayoutEffect(() => {
    if (hydrating || reread === undefined) return undefined;
    doneHydrating();
    const unmounted = new AbortController();
    void (async () => {
      const again = await reread;
      await whenClientReady([again.tree, again.notFound], { rows: 'wait' });
      if (unmounted.signal.aborted) return;
      startTransition(() => {
        setLatest((previous) => {
          // 遷移が当てた木は、その URL のために描かれている
          if (previous.order !== 0) return previous;
          // 殻は fallback.tsx の notFound() で not-found に替わっていることがある
          return previous.tree === arrived.tree
            ? { ...previous, tree: again.tree, notFound: again.notFound }
            : { ...previous, tree: again.notFound };
        });
      });
    })();
    return () => {
      unmounted.abort();
    };
  }, [hydrating, reread, arrived.tree]);

  // A tree neither asked for nor on screen will never render again, so what
  // it is still receiving is cancelled.
  useEffect(() => {
    streaming.current = streaming.current.filter((entry) => {
      // 木を当てた時点で並べるので、このコミットの後に当てた木の分もある。
      // コミットの passive effect は次の木が当たってから走ることがあり、
      // その木はまだ latest にも current にも無い
      if (entry.order > latest.order) return true;
      if (
        entry.trees.includes(latest.tree) ||
        entry.trees.includes(current.tree)
      ) {
        return true;
      }
      entry.cancel();
      return false;
    });
  }, [latest, current]);

  useEffect(() => {
    mounted = {
      apply: (payload, postedTo) => {
        const next = hold(streaming, searchApplied, payload, postedTo);
        startTransition(() => {
          setLatest(next);
        });
      },
      forgetPrefetched: () => {
        cacheIn(prefetched).clear();
      },
    };
    return () => {
      mounted = null;
    };
  }, []);

  // `vite dev` only: a server module changed, so the page on screen was
  // rendered from code that is gone. The RSC plugin says so and leaves
  // fetching it again to the framework; the new tree replaces the old in a
  // transition, so client components keep their state, the way Fast Refresh
  // keeps it for an edit of their own.
  useEffect(() => {
    // Spelled out at every use: Vite hands a module its HMR context only
    // where the source says `import.meta.hot`, so a destructured `hot` is
    // never there.
    if (import.meta.hot === undefined) return undefined;
    let inFlight: AbortController | undefined;
    const onServerUpdate = async (): Promise<void> => {
      inFlight?.abort();
      const controller = new AbortController();
      inFlight = controller;
      // What was fetched ahead was rendered from the old code too.
      cacheIn(prefetched).clear();
      const url = location.href;
      let payload: Payload | null;
      try {
        payload = await fetchPage(
          payloadUrlFor(new URL(url)),
          controller.signal,
        );
      } catch (error) {
        // A later edit took over; its own fetch is on the way.
        if (controller.signal.aborted) return;
        throw error;
      }
      // The visitor navigated meanwhile, and that navigation loaded the page
      // from the new code already.
      if (payload === null || location.href !== url) return;
      if (!canRender(payload)) return reloadInstead();
      markNavigated();
      const next = hold(
        streaming,
        searchApplied,
        payload,
        normalizePathname(new URL(url).pathname),
      );
      startTransition(() => {
        setLatest(next);
      });
    };
    const listener = (): void => {
      void onServerUpdate();
    };
    import.meta.hot.on('rsc:update', listener);
    return () => {
      inFlight?.abort();
      import.meta.hot?.off('rsc:update', listener);
    };
  }, []);

  // static のビルドでは文書のページもファイルなので、置き場に持つ。戻って
  // きたときに取り直さない
  useEffect(() => {
    if (!payloadsAreFiles()) return;
    cacheIn(prefetched).keep(payloadUrlFor(new URL(location.href)), arrived);
    void readClientFiles();
  }, [arrived]);

  // 粗いポインタにはホバーが無く、タップは押し始めとクリックがほぼ同時に
  // 来るので、先に取る間が無い。代わりに画面のリンクを取る。ファイルに限る
  // のは、リクエストごとに描くページでは、通り過ぎたリンクの数だけサーバーが
  // 描き、30 秒で捨てることになるから
  useEffect(() => {
    if (!payloadsAreFiles()) return undefined;
    const coarse = matchMedia('(pointer: coarse)');
    let stop: (() => void) | undefined;
    const follow = (): void => {
      stop?.();
      stop = coarse.matches
        ? prefetchInView((url) =>
            cacheIn(prefetched).prefetch(payloadUrlFor(url), 'low'),
          )
        : undefined;
    };
    follow();
    coarse.addEventListener('change', follow);
    return () => {
      coarse.removeEventListener('change', follow);
      stop?.();
    };
  }, []);

  useEffect(() => {
    const onIntent = (event: Event): void => {
      const url = prefetchTargetOf(event.target);
      if (url !== null) {
        void cacheIn(prefetched).prefetch(payloadUrlFor(url), 'auto');
      }
    };
    // 捕捉段で聞く。途中の要素が伝播を止めても、押し始めは見逃さない
    for (const type of INTENTS) {
      document.addEventListener(type, onIntent, {
        capture: true,
        passive: true,
      });
    }
    return () => {
      for (const type of INTENTS) {
        document.removeEventListener(type, onIntent, { capture: true });
      }
    };
  }, []);

  const { generation } = useInterceptedNavigation<Loaded>({
    // The browser holds no route table, so this cannot answer "is it mine?"
    // the way the client router does. It claims every same-origin URL under
    // Vite's `base` and finds out from the answer — which is why `load` has
    // somewhere to put the ones that turn out not to be.
    claim: (url) =>
      url.origin === location.origin && withoutBase(url.pathname) !== null,
    load: async (url, signal) => {
      loading.current += 1;
      try {
        const payloadPath = payloadUrlFor(url);
        let payload: Payload | null;
        try {
          payload = await cacheIn(prefetched).load(payloadPath, signal);
        } catch (error) {
          if (signal.aborted) throw error;
          // The network, or a server that could not answer: the same rule
          // as a URL that is not a page — the document load shows the truth.
          return await reloadInstead<Loaded>();
        }
        // A second navigation may have taken over while this was in flight —
        // the body read, the client components it names imported — and
        // reloading then would fetch the URL that already lost.
        signal.throwIfAborted();
        // Not a page of this application. Interception already committed
        // the URL, so reloading asks the server for exactly what the browser
        // would have asked for had this never been claimed — its real status
        // included.
        if (payload === null) return await reloadInstead<Loaded>();
        if (!canRender(payload)) return await reloadInstead<Loaded>();
        return { payload, pathname: normalizePathname(url.pathname) };
      } finally {
        // The router applies what this returned right after it settles, so
        // the applied tree renders with the count back where it was.
        loading.current -= 1;
      }
    },
    apply: (loaded) => {
      markNavigated();
      setLatest(
        hold(streaming, searchApplied, loaded.payload, loaded.pathname),
      );
    },
    // A page that reads the search is rendered for the one it was given, so
    // a navigation that moves it loads the page again; a page that does not
    // renders the same whatever the search holds.
    refresh: (url) =>
      searchApplied.current !== undefined &&
      url.search !== searchApplied.current,
  });

  // A shell's fallback.tsx says notFound() in the browser; what it then shows
  // is the not-found its payload carries, in place of the shell on screen —
  // unless a navigation is under way, whose page replaces both, or a newer
  // tree was applied meanwhile, which is left alone. Not a navigation: the
  // URL and the history stay as they are.
  const shown = current;
  const show = (): boolean => {
    if (loading.current > 0) return false;
    setLatest((previous) =>
      previous === shown
        ? { ...shown, tree: shown.notFound, notFound: undefined }
        : previous,
    );
    return true;
  };

  // The tree comes from the server, so a client component in it cannot ask a
  // table where it is. The pathname the server rendered for is what seeds
  // `usePathname` until the browser can answer for itself.
  return (
    <Hydrating value={hydrating}>
      <PathnameProvider pathname={arrived.pathname}>
        <NavigationGeneration value={generation}>
          <TreePathname value={current.pathname}>
            <Recover>
              <ShowNotFound
                value={current.notFound === undefined ? null : show}
              >
                {current.tree}
              </ShowNotFound>
            </Recover>
          </TreePathname>
        </NavigationGeneration>
      </PathnameProvider>
    </Hydrating>
  );
}
