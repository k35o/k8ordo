import { Component } from 'react';
import type { ReactNode } from 'react';
import { render } from 'vitest-browser-react';

import { markNavigated, Recover, reloadInstead } from './recover';
import { reloadDocument } from './reload';

// location.reload は差し替えられない(Location は unforgeable)。
// 名前を付けた唯一の継ぎ目をここで見張る
vi.mock('./reload', () => ({ reloadDocument: vi.fn<() => void>() }));

const Boom = (): ReactNode => {
  throw new Error('boom');
};

// Recover が再スローしたものを受け止める。「上に届く」ことの証明
class Outer extends Component<
  { children: ReactNode; onCatch: (error: unknown) => void },
  { caught: boolean }
> {
  override state = { caught: false };

  static getDerivedStateFromError(): { caught: boolean } {
    return { caught: true };
  }

  override componentDidCatch(error: unknown): void {
    this.props.onCatch(error);
  }

  override render(): ReactNode {
    return this.state.caught ? (
      <p data-testid="outer">caught</p>
    ) : (
      this.props.children
    );
  }
}

beforeEach(() => {
  vi.mocked(reloadDocument).mockClear();
});

// navigated はドキュメント単位の事実で、一度立てたら下ろせない。
// hydration 側の主張を先に置く
it('lets a failure during hydration propagate instead of asking the server again', async () => {
  const caught: unknown[] = [];
  const screen = await render(
    <Outer
      onCatch={(error) => {
        caught.push(error);
      }}
    >
      <Recover>
        <Boom />
      </Recover>
    </Outer>,
  );

  await expect.element(screen.getByTestId('outer')).toBeInTheDocument();
  expect(caught).toHaveLength(1);
  expect(reloadDocument).not.toHaveBeenCalled();
});

it('asks the server again when a page that arrived by navigation fails to render', async () => {
  markNavigated();
  const screen = await render(
    <Recover>
      <Boom />
    </Recover>,
  );

  await vi.waitFor(() => {
    expect(reloadDocument).toHaveBeenCalledTimes(1);
  });
  // ルートを外して白紙にするのではなく、置き換わる文書の間は何も描かない
  expect(screen.container.textContent).toBe('');
});

it('reloadInstead asks the server again and never hands back a value', async () => {
  const outcome = reloadInstead<string>().then(
    () => 'settled',
    () => 'settled',
  );
  expect(reloadDocument).toHaveBeenCalledTimes(1);

  // 置き換わる文書に値を返してはいけない。「settle しない」は待ってみるしかない
  const timeout = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('still pending');
    }, 20);
  });
  await expect(Promise.race([outcome, timeout])).resolves.toBe('still pending');
});
