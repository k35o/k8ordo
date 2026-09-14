import { navigateTo } from '@k8ordo/router';
import { render } from 'vitest-browser-react';

import { App } from './app';

let home: string;

// 表は '/*' で何でも受けるので、<Router> がマウントされている間はどこへでも
// 移れる。テスト後の復帰はマウントの有無に関わらず同一文書内で済ませたいので、
// その間だけルーターを演じる interceptor を入れる
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
});

afterEach(async () => {
  await navigateOutsideTheTable(home);
});

it('renders the matched stack, layouts wrapping the leaf through Outlet', async () => {
  const screen = await render(<App />);
  await navigateTo('/products', { history: 'replace' }).finished;

  await expect.element(screen.getByTestId('root-layout')).toBeInTheDocument();
  await expect
    .element(screen.getByTestId('products-frame'))
    .toBeInTheDocument();
  await expect.element(screen.getByTestId('product-list')).toBeInTheDocument();
});

it('turns a plain anchor into a client navigation', async () => {
  const screen = await render(<App />);
  await navigateTo('/', { history: 'replace' }).finished;

  await screen.getByRole('link', { name: 'products', exact: true }).click();

  // 文書の読み込みが起きていたらテストランナーごと消えている
  await expect.element(screen.getByTestId('product-list')).toBeInTheDocument();
  expect(location.pathname).toBe('/products');
});

it('delivers the param to the leaf through useParams', async () => {
  const screen = await render(<App />);
  await navigateTo('/products/:id', { id: '2' }, { history: 'replace' })
    .finished;

  await expect
    .element(screen.getByTestId('product'))
    .toMatchTextContent('2:second product');
});

it('goes to a page through navigateTo from a button', async () => {
  const screen = await render(<App />);
  await navigateTo('/', { history: 'replace' }).finished;

  await screen.getByRole('button', { name: 'open product 1' }).click();

  await expect
    .element(screen.getByTestId('product'))
    .toMatchTextContent('1:first product');
  expect(location.pathname).toBe('/products/1');
});

it('shows the error component inside the layout and leaves it behind on navigation', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const screen = await render(<App />);
    await navigateTo('/products/broken', { history: 'replace' }).finished;

    // 枠と nav は生き残り、error は枠の穴の中に出る
    await expect
      .element(screen.getByTestId('products-frame'))
      .toBeInTheDocument();
    await expect
      .element(screen.getByTestId('route-error'))
      .toMatchTextContent('this product page is broken');

    await navigateTo('/products').finished;

    await expect
      .element(screen.getByTestId('product-list'))
      .toBeInTheDocument();
    expect(document.querySelector('[data-testid="route-error"]')).toBeNull();
  } finally {
    consoleError.mockRestore();
  }
});

it('marks the active section through useMatch', async () => {
  const screen = await render(<App />);
  await navigateTo('/', { history: 'replace' }).finished;
  const homeLink = screen.getByRole('link', { name: 'home', exact: true });
  const productsLink = screen.getByRole('link', {
    name: 'products',
    exact: true,
  });

  await expect.element(homeLink).toHaveAttribute('aria-current', 'page');
  await expect.element(productsLink).not.toHaveAttribute('aria-current');

  await navigateTo('/products/:id', { id: '3' }).finished;

  await expect.element(productsLink).toHaveAttribute('aria-current', 'page');
  await expect.element(homeLink).not.toHaveAttribute('aria-current');
});

it('renders a route group with its own layout and no URL segment', async () => {
  const screen = await render(<App />);
  await navigateTo('/guide', { history: 'replace' }).finished;

  await expect.element(screen.getByTestId('docs-shell')).toBeInTheDocument();
  await expect.element(screen.getByTestId('guide')).toBeInTheDocument();
  expect(location.pathname).toBe('/guide');
});

it('answers a pathname the table does not name with the not-found leaf, inside the layout', async () => {
  const screen = await render(<App />);
  // '/nowhere' は表のパターンではないので navigateTo は型で拒む。'/*' が
  // 受けることの主張なので、プラットフォームの navigate で行く
  await navigation.navigate('/nowhere', { history: 'replace' }).finished;

  await expect.element(screen.getByTestId('root-layout')).toBeInTheDocument();
  await expect
    .element(screen.getByTestId('not-found'))
    .toMatchTextContent('not found: /nowhere');
});
