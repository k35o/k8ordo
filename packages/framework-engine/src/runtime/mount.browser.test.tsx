import { renderToString } from 'react-dom/server';

import { mount } from './mount';

// 描画中に URL を読む部品。@k8ordo/i18n の文言がロケールの区間を読むのと同じ。
// 描いた <h1> を ref で知らせるので、hydrate したか描き直したかが分かる。
const Segment = ({ onCommit }: { onCommit: (node: Element) => void }) => (
  <h1
    ref={(node) => {
      if (node !== null) onCommit(node);
    }}
  >
    {location.pathname.split('/')[1]}
  </h1>
);

const original = location.pathname;
const placed: Element[] = [];

// サーバーが pathname で描いた HTML を、文書に置いた形で返す
const serverHtml = (pathname: string): Element => {
  history.replaceState(null, '', pathname);
  const container = document.createElement('div');
  container.innerHTML = renderToString(<Segment onCommit={() => {}} />);
  document.body.append(container);
  placed.push(container);
  return container;
};

afterEach(() => {
  for (const container of placed.splice(0)) container.remove();
  history.replaceState(null, '', original);
});

describe('mount', () => {
  it('hydrates HTML rendered for the pathname the browser is at, keeping the nodes the server wrote', async () => {
    const container = serverHtml('/en/docs');
    const written = container.querySelector('h1');
    const committed = Promise.withResolvers<Element>();
    const errors: unknown[] = [];

    const root = mount(
      container,
      <Segment onCommit={committed.resolve} />,
      '/en/docs/',
      {
        onRecoverableError: (error) => {
          errors.push(error);
        },
      },
    );

    expect(await committed.promise).toBe(written);
    expect(errors).toStrictEqual([]);
    root.unmount();
  });

  it('renders HTML rendered for another pathname (a prerendered 404) afresh, where the browser is', async () => {
    const container = serverHtml('/_/_');
    expect(container.textContent).toBe('_');
    history.replaceState(null, '', '/en/missing');
    const committed = Promise.withResolvers<Element>();
    const errors: unknown[] = [];

    const root = mount(
      container,
      <Segment onCommit={committed.resolve} />,
      '/_/_',
      {
        onRecoverableError: (error) => {
          errors.push(error);
        },
      },
    );

    expect((await committed.promise).textContent).toBe('en');
    expect(container.textContent).toBe('en');
    expect(errors).toStrictEqual([]);
    root.unmount();
  });
});
