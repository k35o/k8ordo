import { resetStateRegistry } from './store/registry';

export type PageUrl = {
  /** Params to add to the search the page already has, as written. */
  search?: string;
  /** The fragment, without its `#`. */
  hash?: string;
};

// `@k8ordo/router` が横取りする条件と置き方。fragment への移動はブラウザに任せ、
// 画面のページへの書き込みでは位置もフォーカスも動かさない
const interceptAsRouter = (event: NavigateEvent): void => {
  if (!event.canIntercept) return;
  if (event.hashChange && event.destination.sameDocument) return;
  event.intercept({ scroll: 'manual', focusReset: 'manual' });
};

const replace = (url: string, state: unknown): void => {
  const moved = navigation.navigate(url, { history: 'replace', state });
  // 次の navigate に追い越された分は、ここでは失敗ではない
  moved.committed?.catch(() => undefined);
  moved.finished?.catch(() => undefined);
};

/**
 * Stands in for a router while a test runs, and gives the page the URL the
 * test starts from: without something intercepting, the first `update()`
 * that changes the URL loads a document and takes the test runner with it.
 *
 * The search is added to what the page already has — a test runner and
 * Storybook keep params of their own there — and in the spelling given.
 * Returns the cleanup: the stores are emptied, which drops any write still
 * waiting, and the URL and entry state found are put back. Unmount what was
 * rendered first, as for `resetStateRegistry()`.
 */
export const mountPageUrl = ({ search, hash }: PageUrl = {}): (() => void) => {
  const found = {
    url: location.href,
    state: navigation.currentEntry?.getState() as unknown,
  };
  const url = new URL(found.url);
  if (search !== undefined && search !== '') {
    // URLSearchParams で足すと、渡された %20 が + に書き直される
    url.search = [url.search.slice(1), search.replace(/^\?/u, '')]
      .filter((part) => part !== '')
      .join('&');
  }
  if (hash !== undefined) url.hash = hash;

  navigation.addEventListener('navigate', interceptAsRouter);
  if (url.href !== found.url) replace(url.href, found.state);

  return () => {
    resetStateRegistry();
    // updateCurrentEntry は undefined の state を受け取らないので、URL が同じでも navigate で戻す
    replace(found.url, found.state);
    navigation.removeEventListener('navigate', interceptAsRouter);
  };
};
