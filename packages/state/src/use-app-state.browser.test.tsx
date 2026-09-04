import type { FC } from 'react';
import { useState } from 'react';
import { render } from 'vitest-browser-react';
import { z } from 'zod';

import { defineLocalState } from './local-state';
import { defineMemoryState } from './memory-state';
import { definePageState } from './page-state';
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
});

const renders: Record<string, number> = {};
let lastHandle: UpdateHandle | undefined;

const Pager: FC = () => {
  const [{ page }, update] = useAppState(listState, ['page']);
  renders['pager'] = (renders['pager'] ?? 0) + 1;
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
  renders['query'] = (renders['query'] ?? 0) + 1;
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
    .toHaveTextContent('no URL serialization');
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
