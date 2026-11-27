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

const ignore = (): void => {};
const options = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
];

const escaped = (text: string): string =>
  text.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);

const controlOf = (html: string, label: string): string | undefined => {
  const id = new RegExp(`<label[^>]*for="([^"]+)"[^>]*>${label}<`, 'u').exec(
    html,
  )?.[1];
  return id === undefined
    ? undefined
    : new RegExp(`<[a-z]+ [^>]*id="${escaped(id)}"[^>]*>`, 'u').exec(html)?.[0];
};

const descriptionOf = (html: string, label: string): string | undefined => {
  const id = /aria-describedby="([^"]+)"/u.exec(
    controlOf(html, label) ?? '',
  )?.[1];
  return id === undefined
    ? undefined
    : new RegExp(`<p[^>]*id="${escaped(id)}"[^>]*>([^<]*)<`, 'u').exec(
        html,
      )?.[1];
};

const namedBy = (html: string, label: string): string[] => {
  const id = new RegExp(`<span[^>]*id="([^"]+)"[^>]*>${label}<`, 'u').exec(
    html,
  )?.[1];
  return id === undefined
    ? []
    : [
        ...html.matchAll(
          new RegExp(
            `<[a-z]+ [^>]*aria-labelledby="(?:[^"]* )?${escaped(id)}(?: [^"]*)?"[^>]*>`,
            'gu',
          ),
        ),
      ].map((match) => match[0]);
};

describe('入力欄の描画', () => {
  it('TextField は type の種類の入力欄を描く', () => {
    const html = renderToStaticMarkup(
      renderers.TextField({
        props: { name: 'checkIn', label: 'チェックイン', type: 'date' },
        children: [],
        value: '2026-11-27',
        setValue: ignore,
      }),
    );

    expect(html).toMatch(/<input[^>]*type="date"/u);
  });

  it.each([
    [
      'TextField',
      renderers.TextField({
        props: { name: 'nickname', label: '名前' },
        children: [],
        value: '',
        setValue: ignore,
      }),
      /^<input /u,
    ],
    [
      'Textarea',
      renderers.Textarea({
        props: { name: 'bio', label: '名前' },
        children: [],
        value: '',
        setValue: ignore,
      }),
      /^<textarea /u,
    ],
    [
      'PasswordInput',
      renderers.PasswordInput({
        props: { name: 'secret', label: '名前' },
        children: [],
        value: '',
        setValue: ignore,
      }),
      /^<input /u,
    ],
    [
      'NumberField',
      renderers.NumberField({
        props: { name: 'count', label: '名前' },
        children: [],
        value: null,
        setValue: ignore,
      }),
      /^<input /u,
    ],
    [
      'Slider',
      renderers.Slider({
        props: { name: 'volume', label: '名前' },
        children: [],
        value: 0,
        setValue: ignore,
      }),
      /^<input [^>]*type="range"/u,
    ],
    [
      'Select',
      renderers.Select({
        props: { name: 'size', label: '名前', options },
        children: [],
        value: 's',
        setValue: ignore,
      }),
      /^<select /u,
    ],
    [
      'Autocomplete',
      renderers.Autocomplete({
        props: { name: 'tags', label: '名前', options },
        children: [],
        value: [],
        setValue: ignore,
      }),
      /^<input /u,
    ],
    [
      'DatePicker',
      renderers.DatePicker({
        props: { name: 'day', label: '名前' },
        children: [],
        value: '',
        setValue: ignore,
      }),
      /^<input /u,
    ],
    [
      'ColorPicker',
      renderers.ColorPicker({
        props: { name: 'accent', label: '名前' },
        children: [],
        value: '',
        setValue: ignore,
      }),
      /^<input /u,
    ],
    [
      'Combobox',
      renderers.Combobox({
        props: { name: 'city', label: '名前', options },
        children: [],
        value: '',
        setValue: ignore,
      }),
      /^<input /u,
    ],
  ])(
    '%s の label は、入力する要素を指す <label for> になる',
    (_, node, control) => {
      expect(controlOf(renderToStaticMarkup(node), '名前')).toMatch(control);
    },
  );

  it.each([
    [
      'Radio',
      renderers.Radio({
        props: { name: 'size', label: '名前', options },
        children: [],
        value: 's',
        setValue: ignore,
      }),
      /role="radiogroup"/u,
    ],
    [
      'RadioCard',
      renderers.RadioCard({
        props: { name: 'size', label: '名前', options },
        children: [],
        value: 's',
        setValue: ignore,
      }),
      /role="radiogroup"/u,
    ],
    [
      'CheckboxGroup',
      renderers.CheckboxGroup({
        props: { name: 'sizes', label: '名前', options },
        children: [],
        value: [],
        setValue: ignore,
      }),
      /^<fieldset /u,
    ],
    [
      'CheckboxCard',
      renderers.CheckboxCard({
        props: { name: 'sizes', label: '名前', options },
        children: [],
        value: [],
        setValue: ignore,
      }),
      /role="group"/u,
    ],
    [
      'RangeSlider',
      renderers.RangeSlider({
        props: { name: 'price', label: '名前' },
        children: [],
        value: [0, 100],
        setValue: ignore,
      }),
      /role="group"/u,
    ],
    [
      'FileField',
      renderers.FileField({ props: { label: '名前' }, children: [] }),
      /^<button /u,
    ],
  ])('%s の label は、グループの名前になる見出しになる', (_, node, named) => {
    expect(namedBy(renderToStaticMarkup(node), '名前')).toContainEqual(
      expect.stringMatching(named),
    );
  });

  it('helpText は欄の下に描かれ、欄の説明になる', () => {
    const html = renderToStaticMarkup(
      renderers.TextField({
        props: { name: 'nickname', label: '名前', helpText: '20 文字まで' },
        children: [],
        value: '',
        setValue: ignore,
      }),
    );

    expect(descriptionOf(html, '名前')).toBe('20 文字まで');
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
