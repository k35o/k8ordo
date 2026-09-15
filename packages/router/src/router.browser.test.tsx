import type { FC } from 'react';
import { useEffect, useState, ViewTransition } from 'react';
import { render } from 'vitest-browser-react';

import { defineRoutes } from './define-routes';
import { href, navigateTo } from './links';
import { usePathname } from './location';
import { useMatch } from './match';
import { useInterceptedNavigation } from './navigation';
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

// 十分に背の高いページ。スクロール位置の主張に使う
const TallPage: FC = () => (
  <div data-testid="tall" style={{ height: '5000px' }}>
    <a href={href('/about')}>leave</a>
    <a href="/about#target">leave to target</a>
    <p id="target" style={{ marginTop: '4000px' }}>
      target
    </p>
  </div>
);

// 表を引かずに「products の下にいるか」を答える
const SectionProbe: FC = () => {
  const under = useMatch('/products/*');
  return <span data-testid="section">{under === null ? 'out' : 'in'}</span>;
};

// 表を持たない現在地の読み手。レイアウトに置いて、子のルートが入れ替わっても
// マウントされたままにする
const PathnameProbe: FC = () => (
  <span data-testid="pathname">{usePathname()}</span>
);

const Shell: FC = () => (
  <section data-testid="shell">
    <PathnameProbe />
    <SectionProbe />
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
  '/tall': TallPage,
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
  // finished は commit で settle し、ページの passive effect はその後に走る
  await vi.waitFor(() => {
    expect(listMounts).toBe(1);
  });

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

it('reports the pathname the browser is on, without consulting the table', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;
  await expect
    .element(screen.getByTestId('pathname'))
    .toHaveTextContent('/products');

  await navigateTo('/products/:id', { id: 'shoes' }).finished;
  await expect
    .element(screen.getByTestId('pathname'))
    .toHaveTextContent('/products/shoes');
});

it('holds the pathname still when only the search moves', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;

  const url = new URL(location.href);
  url.searchParams.set('q', 'shoes');
  await navigation.navigate(url.href, { history: 'replace' }).finished;

  await expect
    .element(screen.getByTestId('pathname'))
    .toHaveTextContent('/products');
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

it('starts a new page at the top, whatever the previous page had scrolled to', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/tall', { history: 'replace' }).finished;
  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  window.scrollTo(0, 3000);
  expect(window.scrollY).toBeGreaterThan(0);

  await navigateTo('/about').finished;

  expect(window.scrollY).toBe(0);
});

it('scrolls to the fragment the new URL names', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/about', { history: 'replace' }).finished;

  await navigation.navigate(`${location.origin}/tall#target`).finished;

  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  expect(window.scrollY).toBeGreaterThan(1000);
});

it('answers which section is showing without a table in hand', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;
  await expect.element(screen.getByTestId('section')).toHaveTextContent('out');

  await navigateTo('/products/:id', { id: '1' }).finished;
  await expect.element(screen.getByTestId('section')).toHaveTextContent('in');
});

// フレームワークの下ではペイロードの fetch が入るので、load は非同期になる。
// その待ちの間を再現するための、表を持たない最小のホスト
const DeferredHost: FC<{ gate: Promise<void> }> = ({ gate }) => {
  const [page, setPage] = useState('start');
  useInterceptedNavigation<string>({
    claim: () => true,
    load: async (url) => {
      await gate;
      return url.pathname;
    },
    apply: setPage,
  });
  return <p data-testid="page">{page}</p>;
};

it('still loads the page when a state update lands on its URL mid-load', async () => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const screen = await render(<DeferredHost gate={gate} />);

  // URL は先に確定し、木はまだ前のページのまま
  const page = navigation.navigate('/products');
  await page.committed;
  expect(location.pathname).toBe('/products');
  expect(document.querySelector('[data-testid="page"]')?.textContent).toBe(
    'start',
  );

  // その URL への state 更新(search だけ動く)。「同じ場所」と見なして
  // 読み込みを飛ばすと、追い越された読み込みは捨てられて前のページが残る
  const state = navigation.navigate('/products?q=1', { history: 'replace' });
  release();
  await state.finished;

  await expect
    .element(screen.getByTestId('page'))
    .toHaveTextContent('/products');
  expect(location.search).toBe('?q=1');
  await expect(page.finished).rejects.toThrow(/abort/iu);
  await screen.unmount();
});

// error 境界: 表の branch が error を持つと、その layout の内側で下を受け止める
const Boom: FC = () => {
  throw new Error('boom');
};
const Fine: FC = () => <div data-testid="fine">fine</div>;
const Oops: FC<{ error: unknown; reset: () => void }> = ({ error }) => (
  <p data-testid="oops">{error instanceof Error ? error.message : 'unknown'}</p>
);
const Frame: FC = () => (
  <section data-testid="frame">
    <Outlet />
  </section>
);
const guarded = defineRoutes({
  '/': HomePage,
  '/area': {
    layout: Frame,
    error: Oops,
    children: { '/boom': Boom, '/fine': Fine },
  },
});

it('shows the error component inside the layout when what is below throws', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const screen = await render(<Router routes={guarded} />);
    await navigateTo('/area/boom', { history: 'replace' }).finished;

    await expect.element(screen.getByTestId('frame')).toBeInTheDocument();
    await expect.element(screen.getByTestId('oops')).toHaveTextContent('boom');
  } finally {
    consoleError.mockRestore();
  }
});

it('leaves the failure behind when the pathname changes', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const screen = await render(<Router routes={guarded} />);
    await navigateTo('/area/boom', { history: 'replace' }).finished;
    await expect.element(screen.getByTestId('oops')).toBeInTheDocument();

    await navigateTo('/area/fine').finished;

    await expect.element(screen.getByTestId('fine')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="oops"]')).toBeNull();
  } finally {
    consoleError.mockRestore();
  }
});

it('tags the transition that applies a new tree with the navigation kind', async () => {
  const seen: string[][] = [];
  // update を受けるのは「境界の中身が transition の中で変わった」ときなので、
  // ページの穴をレイアウトの境界で包む
  const Animated: FC = () => (
    <ViewTransition
      default="none"
      onUpdate={(_instance, types) => {
        seen.push(types);
      }}
      update="auto"
    >
      <div data-testid="animated">
        <Outlet />
      </div>
    </ViewTransition>
  );
  const animated = defineRoutes({
    '/': {
      layout: Animated,
      children: { '/': HomePage, '/about': AboutPage },
    },
  });
  const screen = await render(<Router routes={animated} />);
  await navigateTo('/', { history: 'replace' }).finished;
  await expect.element(screen.getByTestId('home')).toBeInTheDocument();

  await navigateTo('/about').finished;

  await expect.element(screen.getByTestId('about')).toBeInTheDocument();
  await vi.waitFor(() => {
    expect(seen.at(-1)).toStrictEqual(['navigation', 'navigation-push']);
  });
});
