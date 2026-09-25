import type { FC } from 'react';
import {
  lazy,
  startTransition,
  Suspense,
  useDeferredValue,
  useEffect,
  useState,
  ViewTransition,
} from 'react';
import { render } from 'vitest-browser-react';

import { defineRoutes } from './define-routes';
import { bindParams, href, navigateTo } from './links';
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

// 絞り込み欄はレイアウトに置く。ページが替わっても残る要素にフォーカスが
// あるときに、それがどこへ行くかを見る
const Shell: FC = () => (
  <section data-testid="shell">
    <PathnameProbe />
    <SectionProbe />
    <input aria-label="filter" />
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

it('resolves finished awaited inside an async action, with the page on screen', async () => {
  await render(<Router routes={routes} />);
  await navigateTo('/', { history: 'replace' }).finished;

  const onScreen = new Promise<boolean>((resolve) => {
    startTransition(async () => {
      await navigateTo('/about').finished;
      resolve(document.querySelector('[data-testid="about"]') !== null);
    });
  });

  // transition で木を適用すると、アクションの終わりを待つ適用と
  // 適用を待つアクションが互いに待ち合って、どちらも終わらない
  await expect(onScreen).resolves.toBe(true);
});

it('puts a page on screen while an unrelated async action is still pending', async () => {
  await render(<Router routes={routes} />);
  await navigateTo('/', { history: 'replace' }).finished;
  let release!: () => void;
  const action = new Promise<void>((resolve) => {
    release = resolve;
  });
  startTransition(async () => {
    await action;
  });

  try {
    await navigateTo('/about').finished;

    expect(document.querySelector('[data-testid="about"]')).not.toBeNull();
  } finally {
    release();
  }
});

const Loading: FC = () => (
  <Suspense fallback={<p data-testid="fallback">loading</p>}>
    <Outlet />
  </Suspense>
);

it('keeps the previous page on screen while the next one suspends', async () => {
  let release!: () => void;
  const chunk = new Promise<void>((resolve) => {
    release = resolve;
  });
  const Slow = lazy(async () => {
    await chunk;
    return { default: AboutPage };
  });
  const suspending = defineRoutes({
    '/': { layout: Loading, children: { '/': HomePage, '/slow': Slow } },
  });
  const screen = await render(<Router routes={suspending} />);
  await navigateTo('/', { history: 'replace' }).finished;
  await expect.element(screen.getByTestId('home')).toBeInTheDocument();

  const slow = navigateTo('/slow');
  await slow.committed;
  // 新しい木を描き始めて chunk で止まるまでの猶予
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  expect(document.querySelector('[data-testid="home"]')).not.toBeNull();
  expect(document.querySelector('[data-testid="fallback"]')).toBeNull();

  release();
  await slow.finished;
  expect(document.querySelector('[data-testid="about"]')).not.toBeNull();
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

it('restores the position a page was left at when the visitor goes back to it', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/tall', { history: 'replace' }).finished;
  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  window.scrollTo(0, 3000);
  const left = window.scrollY;
  await navigateTo('/about').finished;
  expect(window.scrollY).toBe(0);

  await navigation.back().finished;

  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  expect(window.scrollY).toBe(left);
});

it('restores the position a page was left at when the visitor goes forward to it', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/about', { history: 'replace' }).finished;
  await navigateTo('/tall').finished;
  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  window.scrollTo(0, 3000);
  const left = window.scrollY;
  await navigation.back().finished;
  await expect.element(screen.getByTestId('about')).toBeInTheDocument();

  await navigation.forward().finished;

  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  expect(window.scrollY).toBe(left);
});

it('keeps the scroll position when only the search moves', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/tall', { history: 'replace' }).finished;
  await expect.element(screen.getByTestId('tall')).toBeInTheDocument();
  window.scrollTo(0, 3000);
  const reading = window.scrollY;

  const url = new URL(location.href);
  url.searchParams.set('q', 'shoes');
  await navigation.navigate(url.href, { history: 'replace' }).finished;

  expect(window.scrollY).toBe(reading);
});

it('moves focus to the top of the document on a page change, the way a document load does', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;
  const filter = screen.getByRole('textbox', { name: 'filter' }).element();
  (filter as HTMLInputElement).focus();
  expect(document.activeElement).toBe(filter);

  await navigateTo('/products/:id', { id: 'shoes' }).finished;

  // 絞り込み欄はレイアウトごと残っている。それでもフォーカスは離れる
  expect(screen.getByRole('textbox', { name: 'filter' }).element()).toBe(
    filter,
  );
  expect(document.activeElement).toBe(document.body);
});

it('leaves focus where it was when only the search moves', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;
  const filter = screen.getByRole('textbox', { name: 'filter' }).element();
  (filter as HTMLInputElement).focus();

  const url = new URL(location.href);
  url.searchParams.set('q', 'shoes');
  await navigation.navigate(url.href, { history: 'replace' }).finished;

  expect(document.activeElement).toBe(filter);
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
  const [latest, setLatest] = useState('start');
  useInterceptedNavigation<string>({
    claim: () => true,
    load: async (url) => {
      await gate;
      return url.pathname;
    },
    apply: setLatest,
  });
  const page = useDeferredValue(latest);
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
// 境界の内側にあるレイアウト。ページが替わっても同じ要素のままかを見る
const Inner: FC = () => (
  <section data-testid="inner">
    <Outlet />
  </section>
);
const guarded = defineRoutes({
  '/': HomePage,
  '/area': {
    layout: Frame,
    error: Oops,
    children: {
      '/boom': Boom,
      '/fine': Fine,
      '/inner': {
        layout: Inner,
        children: { '/fine': Fine, '/about': AboutPage },
      },
    },
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

it('keeps a layout inside the boundary mounted when the page changes', async () => {
  const screen = await render(<Router routes={guarded} />);
  await navigateTo('/area/inner/fine', { history: 'replace' }).finished;
  const inner = screen.getByTestId('inner').element();

  await navigateTo('/area/inner/about').finished;

  await expect.element(screen.getByTestId('about')).toBeInTheDocument();
  expect(screen.getByTestId('inner').element()).toBe(inner);
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

it('navigates with a bound param supplied by its source, and honours the options', async () => {
  const screen = await render(<Router routes={routes} />);
  await navigateTo('/products', { history: 'replace' }).finished;
  const bound = bindParams(() => ({ id: 'bound' }));

  await bound.navigateTo('/products/:id').finished;

  await expect
    .element(screen.getByTestId('detail'))
    .toHaveTextContent('/products/:id:bound');
  expect(location.pathname).toBe('/products/bound');

  // Every param is bound, so the options come second, after an omitted
  // params argument — and are not mistaken for params.
  const index = navigation.currentEntry?.index;
  await bound.navigateTo(
    '/products/:id',
    { id: 'other' },
    { history: 'replace' },
  ).finished;
  expect(location.pathname).toBe('/products/other');
  expect(navigation.currentEntry?.index).toBe(index);
});

describe('under a base', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/docs/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('matches the pathname below the base, and reads it without the base', async () => {
    await navigateOutsideTheTable('/docs/products');

    const screen = await render(<Router routes={routes} />);

    await expect.element(screen.getByTestId('list')).toBeInTheDocument();
    expect(screen.getByTestId('pathname').element().textContent).toBe(
      '/products',
    );
  });

  it('navigates to the URL under the base and renders the page the table names', async () => {
    await navigateOutsideTheTable('/docs/products');
    const screen = await render(<Router routes={routes} />);

    await navigateTo('/products/:id', { id: '7' }).finished;

    expect(location.pathname).toBe('/docs/products/7');
    await expect
      .element(screen.getByTestId('detail'))
      .toHaveTextContent('/products/:id:7');
  });

  it('leaves a URL outside the base to the browser, whatever the table says', async () => {
    await navigateOutsideTheTable('/docs/products');
    const screen = await render(<Router routes={routes} />);

    // ルーターが引き受けなければ、文書の読み込みになってテストが落ちる。
    // 引き受けなかったことは、ページが替わらないことで確かめる
    await navigateOutsideTheTable('/about');

    await expect.element(screen.getByTestId('list')).toBeInTheDocument();
    expect(screen.container.querySelector('[data-testid="about"]')).toBeNull();
  });
});
