import type { FC } from 'react';
import { useLayoutEffect } from 'react';
import { afterEach, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { z } from 'zod';

import { definePageState } from './page-state';
import { mountPageUrl } from './testing';
import { useAppState } from './use-app-state';

const deckState = definePageState('testing-deck', {
  url: z.object({ q: z.string().default('') }),
  entry: z.object({ open: z.boolean().default(false) }),
  hash: z.coerce.number().int().min(1).default(1),
});

let update: ReturnType<typeof useAppState<typeof deckState>>[1] | undefined;

const Deck: FC = () => {
  const [{ q, open, hash }, write] = useAppState(deckState);
  useLayoutEffect(() => {
    update = write;
  }, [write]);
  return (
    <div style={{ height: '5000px' }}>
      <p data-testid="q">{q}</p>
      <p data-testid="open">{String(open)}</p>
      <p data-testid="slide">{hash}</p>
    </div>
  );
};

const write: NonNullable<typeof update> = (...args) =>
  (update as NonNullable<typeof update>)(...args);

let restore: (() => void) | undefined;

afterEach(() => {
  restore?.();
  restore = undefined;
});

it('puts the search and the fragment in the URL a component mounts into', async () => {
  restore = mountPageUrl({ search: 'q=css', hash: '3' });

  const screen = await render(<Deck />);

  await expect.element(screen.getByTestId('q')).toHaveTextContent('css');
  await expect.element(screen.getByTestId('slide')).toHaveTextContent('3');
});

it('keeps the params the page already had, and the spelling it was given', () => {
  // Vitest はテストの iframe の URL に自分のパラメーターを持つ
  const before = location.search;
  expect(before).not.toBe('');

  restore = mountPageUrl({ search: 'q=a%20b' });

  expect(location.search).toBe(`${before}&q=a%20b`);
});

it('plays the router: a url update stays in the document, where the viewport was', async () => {
  restore = mountPageUrl();
  const screen = await render(<Deck />);
  window.scrollTo(0, 800);

  await write({ q: 'grid', hash: 2 }).finished;
  await write({ hash: 1 }).finished;

  expect(new URL(location.href).searchParams.get('q')).toBe('grid');
  expect(location.hash).toBe('');
  expect(window.scrollY).toBe(800);
  await expect.element(screen.getByTestId('q')).toHaveTextContent('grid');
});

it('puts back the URL and the entry state it found', async () => {
  const url = location.href;
  navigation.updateCurrentEntry({ state: { found: 1 } });
  const cleanup = mountPageUrl({ search: 'q=css', hash: '3' });
  await render(<Deck />);
  await write({ open: true }).finished;

  cleanup();

  expect(location.href).toBe(url);
  expect(navigation.currentEntry?.getState()).toStrictEqual({ found: 1 });
  navigation.updateCurrentEntry({ state: null });
});

it('drops a write still waiting, so it never lands on the next test', async () => {
  const url = location.href;
  const cleanup = mountPageUrl();
  await render(<Deck />);
  await write({ q: 'a' }).committed;
  write({ q: 'ab' });
  await Promise.resolve();

  cleanup();
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  expect(location.href).toBe(url);
});

it('empties the stores, so the next mount reads the URL afresh', async () => {
  const first = mountPageUrl({ search: 'q=css' });
  const mounted = await render(<Deck />);
  await expect.element(mounted.getByTestId('q')).toHaveTextContent('css');
  await mounted.unmount();
  first();

  restore = mountPageUrl();
  const screen = await render(<Deck />);

  await expect.element(screen.getByTestId('q')).toHaveTextContent('');
});
