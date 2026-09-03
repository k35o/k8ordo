import type { FC } from 'react';
import { render } from 'vitest-browser-react';
import { z } from 'zod';

import { definePageState } from './page-state';
import type { UpdateHandle } from './store/page-store';
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
    </>
  );
};

const QueryViewer: FC = () => {
  const [{ q }] = useAppState(listState, ['q']);
  renders['query'] = (renders['query'] ?? 0) + 1;
  return <p data-testid="q">{q}</p>;
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

it('settles without navigating when nothing changed', async () => {
  const screen = await render(<Pager />);
  const before = navigations;

  await screen.getByRole('button', { name: 'same' }).click();

  await (lastHandle as UpdateHandle).finished;
  expect(navigations - before).toBe(0);
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
