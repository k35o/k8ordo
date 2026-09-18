import { library } from './library';

const CONTAINERS = [
  'Stack',
  'Grid',
  'Card',
  'Form',
  'Modal',
  'Dialog',
  'Drawer',
  'Popover',
];

const spec = library.toSpec();

// LLM が読むのはシグネチャの型注釈だけなので、子に置ける名前もそこから読む
const childrenOf = (name: string): string[] =>
  /children: \((?<names>[^)]+)\)\[\]/u
    .exec(spec.components[name]?.signature ?? '')
    ?.groups?.names?.split(' | ') ?? [];

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
