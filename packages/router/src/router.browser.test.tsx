import type { FC } from 'react';
import { useEffect } from 'react';
import { render } from 'vitest-browser-react';

import { defineRoutes } from './define-routes';
import { href, navigateTo } from './links';
import { Outlet, Router, useParams, useRoute } from './router';

let listMounts = 0;

// ページは routes の値を一切 import しない — href / useParams は
// パターン文字列だけで完結する(循環 import が構造的に存在しない)
const HomePage: FC = () => (
  <div data-testid="home">
    home
    <a href={href('/about')}>to about</a>
  </div>
);

const AboutPage: FC = () => <div data-testid="about">about</div>;

const Shell: FC = () => (
  <section data-testid="shell">
    <Outlet />
  </section>
);

const ListPage: FC = () => {
  useEffect(() => {
    listMounts += 1;
  }, []);
  return <div data-testid="list">list</div>;
};

const DetailPage: FC = () => {
  const { id } = useParams('/products/:id');
  const { pattern } = useRoute();
  return (
    <div data-testid="detail">
      {pattern}:{id}
    </div>
  );
};

const routes = defineRoutes({
  '/': HomePage,
  '/about': AboutPage,
  '/products': {
    layout: Shell,
    children: {
      '/': ListPage,
      '/:id': DetailPage,
    },
  },
});

let home: string;

// Router が intercept しない表外 URL への移動(復帰・セットアップ)のあいだ
// だけルーターを演じる interceptor
const interceptEverything = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};

const navigateOutsideTheTable = async (url: string): Promise<void> => {
  navigation.addEventListener('navigate', interceptEverything);
  try {
    await navigation.navigate(url, { history: 'replace' }).finished;
  } finally {
    navigation.removeEventListener('navigate', interceptEverything);
  }
};

beforeEach(() => {
  home = location.href;
  listMounts = 0;
});

afterEach(async () => {
  await navigateOutsideTheTable(home);
});

it('renders the matched stack, layouts wrapping the leaf through Outlet', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;

  await expect.element(screen.getByTestId('shell')).toBeInTheDocument();
  await expect.element(screen.getByTestId('list')).toBeInTheDocument();
});

it('resolves finished only after the new tree is on screen', async () => {
  await render(<Router routes={routes} />);
  await navigateTo('/', { history: 'replace' }).finished;

  await navigateTo('/about').finished;

  // finished 解決後に waitFor なしで存在する = commit が先である証明
  expect(document.querySelector('[data-testid="about"]')).not.toBeNull();
  expect(location.pathname.endsWith('/about')).toBe(true);
});

it('turns a plain anchor into a client navigation', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/', { history: 'replace' }).finished;

  await screen.getByRole('link', { name: 'to about' }).click();

  await expect.element(screen.getByTestId('about')).toBeInTheDocument();
});

it('feeds typed params to the leaf and restores them across back', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/about', { history: 'replace' }).finished;

  await navigateTo('/products/:id', { id: 'a/b' }).finished;
  await expect
    .element(screen.getByTestId('detail'))
    .toHaveTextContent('/products/:id:a/b');

  await navigation.back().finished;
  await expect.element(screen.getByTestId('about')).toBeInTheDocument();
});

it('leaves the route tree alone when only the search moves', async () => {
  await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;
  expect(listMounts).toBe(1);

  const url = new URL(location.href);
  url.searchParams.set('q', 'shoes');
  await navigation.navigate(url.href, { history: 'replace' }).finished;

  expect(new URL(location.href).searchParams.get('q')).toBe('shoes');
  expect(listMounts).toBe(1);
  expect(document.querySelector('[data-testid="list"]')).not.toBeNull();
});

it('renders nothing when mounted on a pathname outside the table', async () => {
  await navigateOutsideTheTable('/not-in-the-table');

  const screen = await render(<Router routes={routes} />);

  expect(screen.container.textContent).toBe('');
});

it('shows the navigation that won, not the one it overtook', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/', { history: 'replace' }).finished;

  // 追い越された側は abort される。その木が後から画面に出てはいけない。
  const overtaken = navigateTo('/products');
  const winner = navigateTo('/products/:id', { id: 'shoes' });
  await expect(overtaken.finished).rejects.toThrow(/abort/iu);
  await winner.finished;

  expect(location.pathname).toBe('/products/shoes');
  await expect
    .element(screen.getByTestId('detail'))
    .toHaveTextContent('/products/:id:shoes');
  expect(document.querySelector('[data-testid="list"]')).toBeNull();
});
