import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vite-plus/test';

import { ToastProvider } from '../components/feedback/toast';
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

describe('入力欄の描画', () => {
  it('TextField は type の種類の入力欄を描く', () => {
    const html = renderToStaticMarkup(
      renderers.TextField({
        props: { name: 'checkIn', type: 'date' },
        children: [],
        value: '2026-11-27',
        setValue: () => {},
      }),
    );

    expect(html).toMatch(/<input[^>]*type="date"/u);
  });
});

describe('Toast の描画', () => {
  const toast = {
    props: { triggerLabel: '通知を表示', tone: 'success', message: '保存した' },
    children: [],
  } as const;

  it('アプリの ToastProvider の中に、トーストを出すボタンを描く', () => {
    const html = renderToStaticMarkup(
      <ToastProvider>{renderers.Toast(toast)}</ToastProvider>,
    );

    expect(html).toMatch(/<button[^>]*>.*通知を表示/u);
  });

  it('ToastProvider の外では、useToast のエラーになる', () => {
    expect(() => renderToStaticMarkup(renderers.Toast(toast))).toThrow(
      'useToast must be used within a ToastProvider',
    );
  });
});
