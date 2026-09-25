import type { FC, ReactElement } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { render } from 'vitest-browser-react';
import { z } from 'zod';

import { defineCookieState } from './cookie-state';
import { defineMemoryState } from './memory-state';
import { definePageState } from './page-state';
import { defineLocalState, defineSessionState } from './storage-state';
import type { UpdateHandle } from './store/core';
import { resetStateRegistry } from './store/registry';
import { useAppState } from './use-app-state';

const listState = definePageState('list', {
  url: z.object({
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
  }),
});

// The library assumes a router that intercepts the Navigation API; the tests
// play that router with the smallest possible handler.
const interceptAsRouter = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};

let home: string;
let navigations = 0;
const countNavigations = () => {
  navigations += 1;
};

beforeEach(() => {
  home = location.href;
  navigations = 0;
  renders['pager'] = 0;
  renders['query'] = 0;
  lastHandle = undefined;
  navigation.addEventListener('navigate', interceptAsRouter);
  navigation.addEventListener('navigate', countNavigations);
});

afterEach(async () => {
  navigation.removeEventListener('navigate', countNavigations);
  await navigation.navigate(home, { history: 'replace' }).finished;
  navigation.removeEventListener('navigate', interceptAsRouter);
  resetStateRegistry();
  localStorage.removeItem('k8ordo-state:prefs');
  sessionStorage.removeItem('k8ordo-state:prefs');
  await cookieStore.delete('k8ordo-state.density');
  await cookieStore.delete('k8ordo-state.note');
  await cookieStore.delete('k8ordo-state.counter');
  localStorage.removeItem('k8ordo-state:versioned');
  await cookieStore.delete('k8ordo-state.versioned');
});

const renders: Record<string, number> = {};
let lastHandle: UpdateHandle | undefined;

const Pager: FC = () => {
  const [{ page }, update] = useAppState(listState, ['page']);
  useEffect(() => {
    renders['pager'] = (renders['pager'] ?? 0) + 1;
  });
  return (
    <>
      <p data-testid="page">{page}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ page: page + 1 });
        }}
      >
        next
      </button>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ page: page + 1 }, { history: 'push' });
        }}
      >
        push next
      </button>
      <button
        type="button"
        onClick={() => {
          update({ q: 'shoes' });
          update((current) => ({ page: current['page'] + 1 }));
        }}
      >
        both
      </button>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ page });
        }}
      >
        same
      </button>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ page: 0 });
        }}
      >
        zero
      </button>
    </>
  );
};

const QueryViewer: FC = () => {
  const [{ q }] = useAppState(listState, ['q']);
  useEffect(() => {
    renders['query'] = (renders['query'] ?? 0) + 1;
  });
  return <p data-testid="q">{q}</p>;
};

const panelState = definePageState('panel', {
  url: z.object({ tab: z.enum(['a', 'b']).default('a') }),
  entry: z.object({ expanded: z.array(z.string()).default([]) }),
});

const Panel: FC = () => {
  const [{ tab, expanded }, update] = useAppState(panelState);
  return (
    <>
      <p data-testid="tab">{tab}</p>
      <p data-testid="expanded">{expanded.join(',')}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ expanded: [...expanded, 'x'] });
        }}
      >
        expand
      </button>
      <button
        type="button"
        onClick={() => {
          lastHandle = update(
            { tab: 'b', expanded: ['y'] },
            { history: 'push' },
          );
        }}
      >
        tab and expand
      </button>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ tab: 'b' });
        }}
      >
        tab only
      </button>
    </>
  );
};

const prefs = defineLocalState(
  'prefs',
  z.object({
    view: z.enum(['grid', 'table']).default('grid'),
    pageSize: z.number().default(20),
  }),
);

const Prefs: FC = () => {
  const [{ view, pageSize }, update] = useAppState(prefs, ['view', 'pageSize']);
  return (
    <>
      <p data-testid="view">{view}</p>
      <p data-testid="page-size">{pageSize}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ view: 'table' });
        }}
      >
        table
      </button>
    </>
  );
};

const debugState = defineMemoryState('debug', { open: false, clicks: 0 });

const Debug: FC = () => {
  const [{ open, clicks }, update] = useAppState(debugState);
  return (
    <>
      <p data-testid="debug">
        {String(open)}:{clicks}
      </p>
      <button
        type="button"
        onClick={() => {
          update((current) => ({
            open: !current.open,
            clicks: current.clicks + 1,
          }));
        }}
      >
        toggle
      </button>
    </>
  );
};

it('reflects the URL it mounts into', async () => {
  const target = new URL(home);
  target.searchParams.set('page', '3');
  await navigation.navigate(target.href, { history: 'replace' }).finished;

  const screen = await render(<Pager />);

  await expect.element(screen.getByTestId('page')).toHaveTextContent('3');
});

it('update writes the state into the URL', async () => {
  const screen = await render(<Pager />);

  await screen.getByRole('button', { name: 'next', exact: true }).click();

  await expect.element(screen.getByTestId('page')).toHaveTextContent('2');
  await (lastHandle as UpdateHandle).finished;
  expect(new URL(location.href).searchParams.get('page')).toBe('2');
});

it('replaces the entry by default and pushes only on request', async () => {
  const screen = await render(<Pager />);
  const entries = navigation.entries().length;

  await screen.getByRole('button', { name: 'next', exact: true }).click();
  await (lastHandle as UpdateHandle).finished;
  expect(navigation.entries()).toHaveLength(entries);

  await screen.getByRole('button', { name: 'push next' }).click();
  await (lastHandle as UpdateHandle).finished;
  expect(navigation.entries()).toHaveLength(entries + 1);
});

it('going back restores the state the entry held', async () => {
  const screen = await render(<Pager />);

  await screen.getByRole('button', { name: 'push next' }).click();
  await (lastHandle as UpdateHandle).finished;
  await expect.element(screen.getByTestId('page')).toHaveTextContent('2');

  await navigation.back().finished;

  await expect.element(screen.getByTestId('page')).toHaveTextContent('1');
});

it('does not re-render a component subscribed to other keys', async () => {
  const screen = await render(
    <>
      <Pager />
      <QueryViewer />
    </>,
  );
  const queryRenders = renders['query'];

  await screen.getByRole('button', { name: 'next', exact: true }).click();
  await expect.element(screen.getByTestId('page')).toHaveTextContent('2');
  await (lastHandle as UpdateHandle).finished;

  expect(renders['query']).toBe(queryRenders);
});

it('collapses several updates in one handler into one navigation', async () => {
  const screen = await render(<Pager />);
  const before = navigations;

  await screen.getByRole('button', { name: 'both' }).click();

  await expect.element(screen.getByTestId('page')).toHaveTextContent('2');
  await vi.waitFor(() => {
    expect(new URL(location.href).searchParams.get('q')).toBe('shoes');
  });
  expect(new URL(location.href).searchParams.get('page')).toBe('2');
  expect(navigations - before).toBe(1);
});

it('validates the patch on the spot — the echo never shows a rejected value', async () => {
  const screen = await render(<Pager />);
  const before = navigations;

  // min(1) の page に 0 を渡す: ?page=0 に到着したのと同じく default の 1 に
  // 落ち、結果として何も変わらないので navigate も起きない。
  await screen.getByRole('button', { name: 'zero' }).click();

  await expect.element(screen.getByTestId('page')).toHaveTextContent('1');
  await (lastHandle as UpdateHandle).finished;
  expect(navigations - before).toBe(0);
});

const filterState = definePageState('filter', {
  url: z.object({
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
    inStock: z.stringbool().default(false),
  }),
});

const Filter: FC = () => {
  const [{ q, page, inStock }, update] = useAppState(filterState);
  return (
    <>
      <p data-testid="filter">{`${q}:${page}:${String(inStock)}`}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ q: 'boots', page: 0 });
        }}
      >
        boots
      </button>
    </>
  );
};

it('a rejected value in a patch drops only its own field, even beside a stringbool', async () => {
  const target = new URL(home);
  target.searchParams.set('q', 'shoes');
  target.searchParams.set('inStock', 'true');
  await navigation.navigate(target.href, { history: 'replace' }).finished;
  const screen = await render(<Filter />);

  // 弾かれた page の隣で、同じ呼び出しが書いた q と、URL にあった inStock が
  // 残る。以前は echo が全体を既定値に戻し、q の書き込みが消えていた
  await screen.getByRole('button', { name: 'boots' }).click();

  await expect
    .element(screen.getByTestId('filter'))
    .toHaveTextContent('boots:1:true');
  await (lastHandle as UpdateHandle).finished;
  const params = new URL(location.href).searchParams;
  expect(params.get('q')).toBe('boots');
  expect(params.get('inStock')).toBe('true');
  expect(params.has('page')).toBe(false);
});

it('settles without navigating when nothing changed', async () => {
  const screen = await render(<Pager />);
  const before = navigations;

  await screen.getByRole('button', { name: 'same' }).click();

  await (lastHandle as UpdateHandle).finished;
  expect(navigations - before).toBe(0);
});

it('an entry-only update writes state without navigating', async () => {
  const screen = await render(<Panel />);
  const before = navigations;

  await screen.getByRole('button', { name: 'expand', exact: true }).click();

  await expect.element(screen.getByTestId('expanded')).toHaveTextContent('x');
  await (lastHandle as UpdateHandle).finished;
  expect(navigations - before).toBe(0);
  expect(navigation.currentEntry?.getState()).toStrictEqual({
    panel: { expanded: ['x'] },
  });
});

it('a mixed update is one navigation carrying both faces', async () => {
  const screen = await render(<Panel />);
  const before = navigations;

  await screen.getByRole('button', { name: 'tab and expand' }).click();

  await (lastHandle as UpdateHandle).finished;
  expect(navigations - before).toBe(1);
  expect(new URL(location.href).searchParams.get('tab')).toBe('b');
  expect(navigation.currentEntry?.getState()).toStrictEqual({
    panel: { expanded: ['y'] },
  });
});

it('going back restores both faces of the entry', async () => {
  const screen = await render(<Panel />);

  await screen.getByRole('button', { name: 'tab and expand' }).click();
  await (lastHandle as UpdateHandle).finished;
  await expect.element(screen.getByTestId('tab')).toHaveTextContent('b');

  await navigation.back().finished;

  await expect.element(screen.getByTestId('tab')).toHaveTextContent('a');
  await expect.element(screen.getByTestId('expanded')).toHaveTextContent('');
});

it('a url-only update carries entry and foreign state forward', async () => {
  navigation.updateCurrentEntry({ state: { alien: 7 } });
  const screen = await render(<Panel />);

  await screen.getByRole('button', { name: 'expand', exact: true }).click();
  await (lastHandle as UpdateHandle).finished;
  await screen.getByRole('button', { name: 'tab only' }).click();
  await (lastHandle as UpdateHandle).finished;

  expect(new URL(location.href).searchParams.get('tab')).toBe('b');
  expect(navigation.currentEntry?.getState()).toStrictEqual({
    alien: 7,
    panel: { expanded: ['x'] },
  });
});

it('entry state written by an older schema parses to defaults', async () => {
  navigation.updateCurrentEntry({ state: { panel: { expanded: 'nope' } } });

  const screen = await render(<Panel />);

  await expect.element(screen.getByTestId('expanded')).toHaveTextContent('');
});

const drawerState = definePageState('drawer', {
  entry: z.object({
    open: z.stringbool().default(false),
    step: z.number().default(0),
  }),
});

const Drawer: FC = () => {
  const [{ open, step }, update] = useAppState(drawerState);
  return (
    <>
      <p data-testid="drawer">{`${String(open)}:${step}`}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ open: true, step: 3 });
        }}
      >
        open drawer
      </button>
    </>
  );
};

it('an entry field that rejects its own output falls back alone on write', async () => {
  const screen = await render(<Drawer />);

  // entry は型付きの値をそのままスキーマに戻すので、stringbool の open は
  // 書くたびに既定値へ戻る。それが step の書き込みまで道連れにしないこと
  await screen.getByRole('button', { name: 'open drawer' }).click();

  await expect
    .element(screen.getByTestId('drawer'))
    .toHaveTextContent('false:3');
  await (lastHandle as UpdateHandle).finished;
  expect(navigation.currentEntry?.getState()).toStrictEqual({
    drawer: { open: false, step: 3 },
  });
});

it('local state reads what an earlier session stored', async () => {
  localStorage.setItem(
    'k8ordo-state:prefs',
    JSON.stringify({ view: 'table', pageSize: 50 }),
  );

  const screen = await render(<Prefs />);

  await expect.element(screen.getByTestId('view')).toHaveTextContent('table');
  await expect.element(screen.getByTestId('page-size')).toHaveTextContent('50');
});

it('local state persists an update and settles its handle', async () => {
  const screen = await render(<Prefs />);

  await screen.getByRole('button', { name: 'table' }).click();

  await expect.element(screen.getByTestId('view')).toHaveTextContent('table');
  await (lastHandle as UpdateHandle).finished;
  expect(
    JSON.parse(localStorage.getItem('k8ordo-state:prefs') as string),
  ).toStrictEqual({ view: 'table', pageSize: 20 });
});

it('corrupt localStorage JSON resets to defaults instead of crashing', async () => {
  localStorage.setItem('k8ordo-state:prefs', '{oops');

  const screen = await render(<Prefs />);

  await expect.element(screen.getByTestId('view')).toHaveTextContent('grid');
});

it('a field an older schema wrote salvages alone', async () => {
  localStorage.setItem(
    'k8ordo-state:prefs',
    JSON.stringify({ view: 'nope', pageSize: 50 }),
  );

  const screen = await render(<Prefs />);

  await expect.element(screen.getByTestId('view')).toHaveTextContent('grid');
  await expect.element(screen.getByTestId('page-size')).toHaveTextContent('50');
});

it("another tab's write flows in through the storage event", async () => {
  const screen = await render(<Prefs />);
  await expect.element(screen.getByTestId('view')).toHaveTextContent('grid');

  localStorage.setItem(
    'k8ordo-state:prefs',
    JSON.stringify({ view: 'table', pageSize: 20 }),
  );
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'k8ordo-state:prefs',
      storageArea: localStorage,
    }),
  );

  await expect.element(screen.getByTestId('view')).toHaveTextContent('table');
});

it('memory state updates through the functional form and stays in memory', async () => {
  const screen = await render(<Debug />);

  await screen.getByRole('button', { name: 'toggle' }).click();
  await screen.getByRole('button', { name: 'toggle' }).click();

  await expect
    .element(screen.getByTestId('debug'))
    .toHaveTextContent('false:2');
});

it('memory state starts from its initial values on a fresh registry', async () => {
  const screen = await render(<Debug />);

  await expect
    .element(screen.getByTestId('debug'))
    .toHaveTextContent('false:0');
});

const Combo: FC = () => {
  const [, updatePanel] = useAppState(panelState, []);
  const [{ page }, updateList] = useAppState(listState, ['page']);
  return (
    <button
      type="button"
      onClick={() => {
        updatePanel({ expanded: ['x'] });
        lastHandle = updateList({ page: page + 1 });
      }}
    >
      combo
    </button>
  );
};

it("one store's entry write does not erase another store's batched url write", async () => {
  const screen = await render(<Combo />);

  // panel の flush(updateCurrentEntry)が同期的に currententrychange を発火
  // させ、list 側の未 flush バッチを巻き戻していた競合の回帰テスト。
  await screen.getByRole('button', { name: 'combo' }).click();

  await (lastHandle as UpdateHandle).finished;
  expect(new URL(location.href).searchParams.get('page')).toBe('2');
  expect(navigation.currentEntry?.getState()).toStrictEqual({
    panel: { expanded: ['x'] },
  });
});

it('failed persistence rejects the handle but keeps the echo', async () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('quota', 'QuotaExceededError');
  });
  try {
    const screen = await render(<Prefs />);

    await screen.getByRole('button', { name: 'table' }).click();

    await expect.element(screen.getByTestId('view')).toHaveTextContent('table');
    await expect((lastHandle as UpdateHandle).finished).rejects.toThrow(
      'quota',
    );
  } finally {
    spy.mockRestore();
  }
});

it('leaves params it does not own untouched', async () => {
  const target = new URL(home);
  target.searchParams.set('other', '1');
  await navigation.navigate(target.href, { history: 'replace' }).finished;
  const screen = await render(<Pager />);

  await screen.getByRole('button', { name: 'next', exact: true }).click();
  await (lastHandle as UpdateHandle).finished;

  const params = new URL(location.href).searchParams;
  expect(params.get('other')).toBe('1');
  expect(params.get('page')).toBe('2');
});

const sinceState = definePageState('since', {
  url: z.object({ since: z.date().optional() }),
});

const Since: FC = () => {
  const [{ since }, update] = useAppState(sinceState);
  const [refused, setRefused] = useState('');
  return (
    <>
      <p data-testid="since">{since === undefined ? 'none' : 'set'}</p>
      <p data-testid="refused">{refused}</p>
      <button
        type="button"
        onClick={() => {
          try {
            update({ since: new Date(0) });
          } catch (error) {
            setRefused(String(error));
          }
        }}
      >
        set
      </button>
    </>
  );
};

it('refuses a value the URL cannot carry on the spot, writing nothing', async () => {
  const screen = await render(<Since />);
  const before = navigations;

  // スキーマは Date を受けるが URL には書けない。fire-and-forget が普通の
  // 呼び方である以上、ハンドルの reject では誰も気づかない
  await screen.getByRole('button', { name: 'set' }).click();

  await expect
    .element(screen.getByTestId('refused'))
    .toMatchTextContent('no URL serialization');
  await expect.element(screen.getByTestId('since')).toHaveTextContent('none');
  expect(navigations - before).toBe(0);
});

const flagState = definePageState('flag', {
  url: z.object({ open: z.stringbool().default(true) }),
});

const Flag: FC = () => {
  const [{ open }, update] = useAppState(flagState);
  return (
    <>
      <p data-testid="flag">{String(open)}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ open: !open });
        }}
      >
        toggle flag
      </button>
    </>
  );
};

it('a boolean written by update comes back as the boolean it wrote', async () => {
  const screen = await render(<Flag />);

  // stringbool は文字列しか受け取らない。echo が typed な値をそのまま
  // スキーマに渡していた頃は、false を書くと既定値の true に戻っていた
  await screen.getByRole('button', { name: 'toggle flag' }).click();

  await expect.element(screen.getByTestId('flag')).toHaveTextContent('false');
  await (lastHandle as UpdateHandle).finished;
  expect(new URL(location.href).searchParams.get('open')).toBe('false');
  expect(flagState.parseUrl(new URL(location.href).searchParams).open).toBe(
    false,
  );
});

const densityState = defineCookieState(
  'density',
  z.object({
    density: z.enum(['comfortable', 'compact']).default('comfortable'),
    fontSize: z.number().default(16),
  }),
);

type DensityValues = { density: 'comfortable' | 'compact'; fontSize: number };

const Density: FC = () => {
  const [{ density, fontSize }, update] = useAppState(densityState);
  return (
    <>
      <p data-testid="density">{`${density}:${fontSize}`}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ density: 'compact' });
        }}
      >
        compact
      </button>
    </>
  );
};

let secondHandle: UpdateHandle | undefined;

const TwoBatches: FC = () => {
  const [{ density, fontSize }, update] = useAppState(densityState);
  return (
    <>
      <p data-testid="density">{`${density}:${fontSize}`}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ density: 'compact' });
          // 1 つ目のバッチの flush より後に走るので、別のバッチになる
          queueMicrotask(() => {
            secondHandle = update({ fontSize: 20 });
          });
        }}
      >
        two batches
      </button>
    </>
  );
};

const committed: string[] = [];
const committedViews: string[] = [];

const VersionProbe: FC<{
  initialCookie?: { view: 'grid' | 'table'; pageSize: number };
}> = ({ initialCookie }) => {
  const [{ view }] = useAppState(versionedCookie, ['view'], { initialCookie });
  useLayoutEffect(() => {
    committedViews.push(view);
  });
  return <p>{view}</p>;
};

const DensityProbe: FC<{ initialCookie?: DensityValues }> = ({
  initialCookie,
}) => {
  const [{ density }] = useAppState(densityState, ['density'], {
    initialCookie,
  });
  useLayoutEffect(() => {
    committed.push(density);
  });
  return <p>{density}</p>;
};

const hydrate = (
  element: ReactElement,
): { container: HTMLElement; unmount: () => void } => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.append(container);
  const app = hydrateRoot(container, element);
  return {
    container,
    unmount: () => {
      app.unmount();
      container.remove();
    },
  };
};

const frame = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
};

it('cookie state reads the cookie an earlier visit stored', async () => {
  await cookieStore.set(
    densityState.cookieName,
    densityState.cookieValue({ density: 'compact', fontSize: 18 }),
  );

  const screen = await render(<Density />);

  await expect
    .element(screen.getByTestId('density'))
    .toHaveTextContent('compact:18');
});

it('cookie state persists an update and settles its handle', async () => {
  const screen = await render(<Density />);

  await screen.getByRole('button', { name: 'compact' }).click();

  await expect
    .element(screen.getByTestId('density'))
    .toHaveTextContent('compact:16');
  await (lastHandle as UpdateHandle).finished;
  const cookie = (await cookieStore.get(
    densityState.cookieName,
  )) as CookieListItem;
  expect(JSON.parse(decodeURIComponent(cookie.value as string))).toStrictEqual({
    density: 'compact',
    fontSize: 16,
  });
});

it('writes a cookie that a first visit from another site still carries', async () => {
  const set = vi.spyOn(CookieStore.prototype, 'set');
  try {
    const screen = await render(<Density />);

    await screen.getByRole('button', { name: 'compact' }).click();
    await (lastHandle as UpdateHandle).finished;

    // 既定の sameSite: 'strict' だと、ほかのサイトのリンクから来た最初の
    // リクエストに Cookie が付かず、サーバーが既定値で描く
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'k8ordo-state.density',
        path: '/',
        sameSite: 'lax',
        maxAge: 400 * 24 * 60 * 60,
      }),
    );
  } finally {
    set.mockRestore();
  }
});

it("another tab's write flows in through the change event", async () => {
  const screen = await render(<Density />);
  await expect
    .element(screen.getByTestId('density'))
    .toHaveTextContent('comfortable:16');

  await cookieStore.set(
    densityState.cookieName,
    densityState.cookieValue({ density: 'compact', fontSize: 20 }),
  );

  await expect
    .element(screen.getByTestId('density'))
    .toHaveTextContent('compact:20');
});

it('a corrupt cookie reads as the defaults instead of crashing', async () => {
  await cookieStore.set(densityState.cookieName, '%7Boops');

  const screen = await render(<Density />);

  await expect
    .element(screen.getByTestId('density'))
    .toHaveTextContent('comfortable:16');
});

it("the server render shows the request's cookie and hydration keeps it", async () => {
  committed.length = 0;
  await cookieStore.set(
    densityState.cookieName,
    densityState.cookieValue({ density: 'compact' }),
  );
  // サーバーでページが読む request.cookies は、値を復号済みで持っている
  const initialCookie = densityState.parseCookies(
    new Map([[densityState.cookieName, '{"density":"compact","fontSize":16}']]),
  );

  const app = hydrate(<DensityProbe initialCookie={initialCookie} />);
  await vi.waitFor(() => {
    expect(committed).toContain('compact');
  });
  await frame();
  await frame();

  expect(app.container.textContent).toBe('compact');
  expect(committed).not.toContain('comfortable');
  app.unmount();
});

it('without the request, the server renders the defaults and hydration takes the cookie', async () => {
  committed.length = 0;
  await cookieStore.set(
    densityState.cookieName,
    densityState.cookieValue({ density: 'compact' }),
  );

  const app = hydrate(<DensityProbe />);
  await vi.waitFor(() => {
    expect(committed.at(-1)).toBe('compact');
  });

  expect(committed[0]).toBe('comfortable');
  app.unmount();
});

const noteState = defineCookieState(
  'note',
  z.object({ text: z.string().default('') }),
);

const Note: FC = () => {
  const [{ text }, update] = useAppState(noteState);
  return (
    <>
      <p data-testid="note-length">{text.length}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ text: 'x'.repeat(5000) });
        }}
      >
        long note
      </button>
    </>
  );
};

it('a cookie the store refuses rejects the handle but keeps the echo', async () => {
  const screen = await render(<Note />);

  // 名前と値で 4096 バイトを超える Cookie は、Cookie Store API が拒む
  await screen.getByRole('button', { name: 'long note' }).click();

  await expect
    .element(screen.getByTestId('note-length'))
    .toHaveTextContent('5000');
  await expect((lastHandle as UpdateHandle).finished).rejects.toThrow(
    TypeError,
  );
  expect(await cookieStore.get(noteState.cookieName)).toBeNull();
});

it('a change that lands while its own write is in flight does not roll the echo back', async () => {
  const realSet = CookieStore.prototype.set;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const set = vi
    .spyOn(CookieStore.prototype, 'set')
    .mockImplementation(async function held(
      this: CookieStore,
      ...args: Parameters<CookieStore['set']>
    ) {
      await gate;
      return realSet.apply(this, args);
    });
  try {
    const screen = await render(<Density />);
    await screen.getByRole('button', { name: 'compact' }).click();
    await expect
      .element(screen.getByTestId('density'))
      .toHaveTextContent('compact:16');

    // 書き込みが終わる前に届いた change で読み直すと、echo が一瞬その前の
    // 値に戻る。ほかのタブの書き込みで change を起こして確かめる
    const changed = new Promise((resolve) => {
      cookieStore.addEventListener('change', resolve, { once: true });
    });
    await realSet.call(cookieStore, {
      name: densityState.cookieName,
      value: densityState.cookieValue({ fontSize: 24 }),
    });
    await changed;
    await frame();
    expect(screen.getByTestId('density').element().textContent).toBe(
      'compact:16',
    );

    release();
    await (lastHandle as UpdateHandle).finished;
    await expect
      .element(screen.getByTestId('density'))
      .toHaveTextContent('compact:16');
  } finally {
    release();
    set.mockRestore();
  }
});

it("a batch written while an earlier one is in flight keeps the earlier batch's fields", async () => {
  const realSet = CookieStore.prototype.set;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  // 1 つ目の書き込みだけを止め、Cookie に入る前に 2 つ目のバッチを走らせる。
  // 2 つ目からは本物の set() が呼ばれる
  const set = vi
    .spyOn(CookieStore.prototype, 'set')
    .mockImplementationOnce(async function held(
      this: CookieStore,
      ...args: Parameters<CookieStore['set']>
    ) {
      await gate;
      return realSet.apply(this, args);
    });
  try {
    const screen = await render(<TwoBatches />);

    await screen.getByRole('button', { name: 'two batches' }).click();
    await expect
      .element(screen.getByTestId('density'))
      .toHaveTextContent('compact:20');
    release();
    await (lastHandle as UpdateHandle).finished;
    await (secondHandle as UpdateHandle).finished;

    const cookie = (await cookieStore.get(
      densityState.cookieName,
    )) as CookieListItem;
    expect(
      JSON.parse(decodeURIComponent(cookie.value as string)),
    ).toStrictEqual({ density: 'compact', fontSize: 20 });
    await expect
      .element(screen.getByTestId('density'))
      .toHaveTextContent('compact:20');
  } finally {
    release();
    set.mockRestore();
  }
});

const counterState = defineCookieState(
  'counter',
  z.object({ big: z.bigint().optional(), clicks: z.number().default(0) }),
);

let refusedHandle: UpdateHandle | undefined;

const Counter: FC = () => {
  const [{ clicks }, update] = useAppState(counterState);
  return (
    <>
      <p data-testid="clicks">{clicks}</p>
      <button
        type="button"
        onClick={() => {
          refusedHandle = update({ big: 1n });
          queueMicrotask(() => {
            lastHandle = update({ big: undefined, clicks: clicks + 1 });
          });
        }}
      >
        count
      </button>
    </>
  );
};

it('a write that cannot be encoded fails alone and the next one still lands', async () => {
  const screen = await render(<Counter />);

  // bigint は JSON にできないので 1 つ目のバッチは書けない。それが後ろに
  // つないだ 2 つ目のバッチまで止めないこと
  await screen.getByRole('button', { name: 'count' }).click();

  await expect((refusedHandle as UpdateHandle).finished).rejects.toThrow(
    TypeError,
  );
  await (lastHandle as UpdateHandle).finished;
  const cookie = (await cookieStore.get(
    counterState.cookieName,
  )) as CookieListItem;
  expect(JSON.parse(decodeURIComponent(cookie.value as string))).toStrictEqual({
    clicks: 1,
  });
});

// local の prefs と同じキー。置き場所が違えば別の状態であることを確かめる
const tabPrefs = defineSessionState(
  'prefs',
  z.object({
    view: z.enum(['grid', 'table']).default('grid'),
    pageSize: z.number().default(20),
  }),
);

const TabPrefs: FC = () => {
  const [{ view }, update] = useAppState(tabPrefs, ['view']);
  return (
    <>
      <p data-testid="tab-view">{view}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ view: 'table' });
        }}
      >
        tab table
      </button>
    </>
  );
};

it('session state reads what the tab stored before a reload', async () => {
  sessionStorage.setItem(
    'k8ordo-state:prefs',
    JSON.stringify({ view: 'table', pageSize: 50 }),
  );

  const screen = await render(<TabPrefs />);

  await expect
    .element(screen.getByTestId('tab-view'))
    .toHaveTextContent('table');
});

it('session state persists an update in sessionStorage and settles its handle', async () => {
  const screen = await render(<TabPrefs />);

  await screen.getByRole('button', { name: 'tab table' }).click();

  await expect
    .element(screen.getByTestId('tab-view'))
    .toHaveTextContent('table');
  await (lastHandle as UpdateHandle).finished;
  expect(
    JSON.parse(sessionStorage.getItem('k8ordo-state:prefs') as string),
  ).toStrictEqual({ view: 'table', pageSize: 20 });
});

it('local and session state under the same key are separate places', async () => {
  const screen = await render(
    <>
      <Prefs />
      <TabPrefs />
    </>,
  );

  await screen.getByRole('button', { name: 'tab table' }).click();
  await (lastHandle as UpdateHandle).finished;

  await expect
    .element(screen.getByTestId('tab-view'))
    .toHaveTextContent('table');
  await expect.element(screen.getByTestId('view')).toHaveTextContent('grid');
  expect(localStorage.getItem('k8ordo-state:prefs')).toBeNull();
});

it("another frame's sessionStorage write flows in through the storage event", async () => {
  const screen = await render(<TabPrefs />);

  // storage イベントは、同じ置き場所を共有するほかの文書でだけ発火する。
  // sessionStorage なら、このタブのほかのフレームがそれに当たる
  sessionStorage.setItem(
    'k8ordo-state:prefs',
    JSON.stringify({ view: 'table', pageSize: 20 }),
  );
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'k8ordo-state:prefs',
      storageArea: sessionStorage,
    }),
  );

  await expect
    .element(screen.getByTestId('tab-view'))
    .toHaveTextContent('table');
});

// v1 は { layout: 'list' | 'cards' } を書いていた。v2 で view に改名した
const versionedSchema = z.object({
  view: z.enum(['grid', 'table']).default('grid'),
  pageSize: z.number().default(20),
});

const versioning = {
  version: 2,
  migrate: (old: Readonly<Record<string, unknown>>) => ({
    view: old['layout'] === 'list' ? 'table' : 'grid',
  }),
};

const versionedLocal = defineLocalState(
  'versioned',
  versionedSchema,
  versioning,
);

const versionedCookie = defineCookieState(
  'versioned',
  versionedSchema,
  versioning,
);

const VersionedLocal: FC = () => {
  const [{ view }, update] = useAppState(versionedLocal);
  return (
    <>
      <p data-testid="local-view">{view}</p>
      <button
        type="button"
        onClick={() => {
          lastHandle = update({ pageSize: 50 });
        }}
      >
        page size
      </button>
    </>
  );
};

const VersionedCookie: FC = () => {
  const [{ view }] = useAppState(versionedCookie);
  return <p data-testid="cookie-view">{view}</p>;
};

it('local state migrates a row an older version wrote and writes it back', async () => {
  localStorage.setItem('k8ordo-state:versioned', '[1,{"layout":"list"}]');

  const screen = await render(<VersionedLocal />);

  await expect
    .element(screen.getByTestId('local-view'))
    .toHaveTextContent('table');
  await vi.waitFor(() => {
    expect(localStorage.getItem('k8ordo-state:versioned')).toBe(
      '[2,{"view":"table","pageSize":20}]',
    );
  });
});

it('local state writes a migrated row back after the render that read it, not during it', async () => {
  localStorage.setItem('k8ordo-state:versioned', '[1,{"layout":"list"}]');
  const seenInRender: Array<string | null> = [];
  const Reader: FC = () => {
    const [{ view }] = useAppState(versionedLocal);
    // 描画の中で行を覗くのはこのテストだけの確かめ方
    seenInRender.push(localStorage.getItem('k8ordo-state:versioned'));
    return <p data-testid="reader-view">{view}</p>;
  };

  const screen = await render(<Reader />);

  await expect
    .element(screen.getByTestId('reader-view'))
    .toHaveTextContent('table');
  expect(seenInRender[0]).toBe('[1,{"layout":"list"}]');
  await vi.waitFor(() => {
    expect(localStorage.getItem('k8ordo-state:versioned')).toBe(
      '[2,{"view":"table","pageSize":20}]',
    );
  });
});

it('a versioned local state writes its version with every update', async () => {
  const screen = await render(<VersionedLocal />);

  await screen.getByRole('button', { name: 'page size' }).click();
  await (lastHandle as UpdateHandle).finished;

  expect(localStorage.getItem('k8ordo-state:versioned')).toBe(
    '[2,{"view":"grid","pageSize":50}]',
  );
});

it('a local row a failing migrate cannot turn stays as it was', async () => {
  const failing = defineLocalState('failing', versionedSchema, {
    version: 2,
    migrate: () => {
      throw new Error('unexpected shape');
    },
  });
  localStorage.setItem('k8ordo-state:failing', '[1,{"layout":"list"}]');
  const Failing: FC = () => {
    const [{ view }] = useAppState(failing);
    return <p data-testid="failing-view">{view}</p>;
  };
  try {
    const screen = await render(<Failing />);

    // 直した migrate が次の読み込みでやり直せるよう、行には触らない
    await expect
      .element(screen.getByTestId('failing-view'))
      .toHaveTextContent('grid');
    expect(localStorage.getItem('k8ordo-state:failing')).toBe(
      '[1,{"layout":"list"}]',
    );
  } finally {
    localStorage.removeItem('k8ordo-state:failing');
  }
});

it('cookie state migrates a cookie an older version wrote and writes it back', async () => {
  await cookieStore.set(
    versionedCookie.cookieName,
    encodeURIComponent('{"layout":"list"}'),
  );

  const screen = await render(<VersionedCookie />);

  await expect
    .element(screen.getByTestId('cookie-view'))
    .toHaveTextContent('table');
  await vi.waitFor(async () => {
    const cookie = (await cookieStore.get(
      versionedCookie.cookieName,
    )) as CookieListItem;
    expect(decodeURIComponent(cookie.value as string)).toBe(
      '[2,{"view":"table","pageSize":20}]',
    );
  });
});

it("hydration of a migrated cookie shows the server's values without a flash", async () => {
  committedViews.length = 0;
  await cookieStore.set(
    versionedCookie.cookieName,
    encodeURIComponent('{"layout":"list"}'),
  );
  // サーバーも同じ migrate を通して読むので、ブラウザの最初の読み取りと一致する
  const initialCookie = versionedCookie.parseCookies(
    new Map([[versionedCookie.cookieName, '{"layout":"list"}']]),
  );

  const app = hydrate(<VersionProbe initialCookie={initialCookie} />);
  await vi.waitFor(() => {
    expect(committedViews).toContain('table');
  });
  await frame();
  await frame();

  expect(committedViews).not.toContain('grid');
  app.unmount();
});

const announce = (row: string): void => {
  localStorage.setItem('k8ordo-state:versioned', row);
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'k8ordo-state:versioned',
      storageArea: localStorage,
    }),
  );
};

it('an older row another tab writes is migrated here and written back', async () => {
  const screen = await render(<VersionedLocal />);
  await expect
    .element(screen.getByTestId('local-view'))
    .toHaveTextContent('grid');

  // デプロイ前のコードのままのタブが、古い形の行を書いた
  announce('{"layout":"list"}');

  await expect
    .element(screen.getByTestId('local-view'))
    .toHaveTextContent('table');
  await vi.waitFor(() => {
    expect(localStorage.getItem('k8ordo-state:versioned')).toBe(
      '[2,{"view":"table","pageSize":20}]',
    );
  });
});

it('a newer row another tab writes is read but never written back', async () => {
  const screen = await render(<VersionedLocal />);

  // 次のデプロイを先に読み込んだタブが、新しい版の行を書いた
  announce('[3,{"view":"table","pageSize":50,"density":"compact"}]');

  await expect
    .element(screen.getByTestId('local-view'))
    .toHaveTextContent('table');
  await frame();
  expect(localStorage.getItem('k8ordo-state:versioned')).toBe(
    '[3,{"view":"table","pageSize":50,"density":"compact"}]',
  );
});

it('a cookie a failing migrate cannot turn stays as it was', async () => {
  const failing = defineCookieState('failing', versionedSchema, {
    version: 2,
    migrate: () => {
      throw new Error('unexpected shape');
    },
  });
  const Failing: FC = () => {
    const [{ view }] = useAppState(failing);
    return <p data-testid="failing-cookie-view">{view}</p>;
  };
  await cookieStore.set(
    failing.cookieName,
    encodeURIComponent('[1,{"layout":"list"}]'),
  );
  try {
    const screen = await render(<Failing />);

    await expect
      .element(screen.getByTestId('failing-cookie-view'))
      .toHaveTextContent('grid');
    await frame();
    const cookie = (await cookieStore.get(
      failing.cookieName,
    )) as CookieListItem;
    expect(decodeURIComponent(cookie.value as string)).toBe(
      '[1,{"layout":"list"}]',
    );
  } finally {
    await cookieStore.delete(failing.cookieName);
  }
});
