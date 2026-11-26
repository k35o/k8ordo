import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vite-plus/test';

import { renderers } from './render';

const press = (): void => {};

describe('操作を結んだ部品の描画', () => {
  it('press を結んでいない Card はボタンを持たない', () => {
    const html = renderToStaticMarkup(
      renderers.Card({ props: {}, children: ['中身'] }),
    );

    expect(html).not.toContain('<button');
  });

  it('press を結んだ Card は、中身を名前にしたボタンを重ねる', () => {
    const html = renderToStaticMarkup(
      renderers.Card({ props: {}, children: ['中身'], on: { press } }),
    );

    expect(html).toMatch(/<button[^>]*aria-labelledby="[^"]+"/u);
  });

  it('href を持つ Card は、press を結んでもリンクになる', () => {
    const html = renderToStaticMarkup(
      renderers.Card({
        props: { href: '/articles/1' },
        children: ['中身'],
        on: { press },
      }),
    );

    expect(html).toContain('href="/articles/1"');
    expect(html).not.toContain('<button');
  });

  it('href を持つ Button は、press を結んでもリンクになる', () => {
    const html = renderToStaticMarkup(
      renderers.Button({
        props: { label: '開く', href: '/articles/1' },
        children: [],
        on: { press },
      }),
    );

    expect(html).toMatch(/^<a [^>]*href="\/articles\/1"/u);
  });
});
