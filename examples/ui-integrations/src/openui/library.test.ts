import { describe, expect, it } from 'vite-plus/test';

import { library } from './library';

const CONTAINERS = [
  'Stack',
  'Grid',
  'Card',
  'Form',
  'Dialog',
  'Drawer',
  'Popover',
];

const spec = library.toSpec();

// LLM が読むのはシグネチャの型注釈だけなので、子に置ける名前もそこから読む
const signatureOf = (name: string): string =>
  Object.entries(spec.components).find(([key]) => key === name)?.[1]
    .signature ?? '';

const childrenOf = (name: string): string[] =>
  /children: \((?<names>[^)]+)\)\[\]/u
    .exec(signatureOf(name))
    ?.groups?.names.split(' | ') ?? [];

const reachableFromRoot = (): string[] => {
  const reached = new Set([String(spec.root)]);
  for (const name of reached) {
    for (const child of childrenOf(name)) {
      reached.add(child);
    }
  }
  return [...reached].toSorted();
};

describe('openui library のプロンプト上の入れ子', () => {
  it('root から children のシグネチャをたどって全コンポーネントに届く', () => {
    expect(reachableFromRoot()).toStrictEqual(
      Object.keys(spec.components).toSorted(),
    );
  });

  it.each(CONTAINERS)('%s の子にどのコンテナも置ける', (container) => {
    expect(childrenOf(container)).toStrictEqual(
      expect.arrayContaining(CONTAINERS),
    );
  });
});

describe('openui library の位置引数', () => {
  it.each([
    'TextField',
    'Textarea',
    'PasswordInput',
    'NumberField',
    'Slider',
    'Select',
    'Autocomplete',
    'ListBox',
  ])('%s は name の次に label を書く', (name) => {
    expect(signatureOf(name)).toMatch(
      new RegExp(`^${name}\\(name: string, label: string, `, 'u'),
    );
  });

  it('FileField は label から書く', () => {
    expect(signatureOf('FileField')).toMatch(/^FileField\(label: string, /u);
  });
});
