import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import postcss from 'postcss';
import type { AtRule, ChildNode, Declaration, Rule } from 'postcss';
import { describe, expect, it } from 'vite-plus/test';

// 配布物そのものを読む。CI はテストの前に組み、手元では pnpm build のあとに走らせる
const dist = path.resolve(import.meta.dirname, '../../dist');
const LAYERS = ['properties', 'theme', 'base', 'components', 'utilities'];

const filesIn = (extension: string): string[] =>
  readdirSync(dist, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith(extension))
    .toSorted();

const parse = (file: string) =>
  postcss.parse(readFileSync(path.join(dist, file), 'utf8'));

const layerOf = (node: ChildNode): AtRule | undefined =>
  node.type === 'atrule' && node.name === 'layer' ? node : undefined;

const isTokenDeclaration = (node: ChildNode): node is Declaration =>
  node.type === 'decl' && node.prop.startsWith('--');

const declaresOnlyTokens = (rule: Rule): boolean =>
  rule.every(isTokenDeclaration);

// レイヤーの名前を、宣言文とブロックに初めて現れた順に並べる
const layerOrder = (nodes: ChildNode[]): string[] => [
  ...new Set(
    nodes.flatMap(
      (node) =>
        layerOf(node)
          ?.params.split(',')
          .map((name) => name.trim()) ?? [],
    ),
  ),
];

// レイヤーの外に置いた、トークンの宣言でないもの。@media の中の :root と .dark
// （配色のモード）もトークンの宣言として数える
const unlayeredStyles = (nodes: ChildNode[]): ChildNode[] =>
  nodes.flatMap((node) => {
    if (node.type === 'comment' || layerOf(node)) return [];
    const rules =
      node.type === 'atrule' && node.name === 'media'
        ? (node.nodes ?? [])
        : [node];
    return rules.filter(
      (rule) => rule.type !== 'rule' || !declaresOnlyTokens(rule),
    );
  });

// components レイヤーのブロックと、中身のないレイヤーの宣言文のほかにあるもの
const outsideComponents = (nodes: ChildNode[]): ChildNode[] =>
  nodes.filter((node) => {
    const layer = layerOf(node);
    const allowed =
      layer !== undefined &&
      (layer.nodes === undefined || layer.params === 'components');
    return node.type !== 'comment' && !allowed;
  });

// 隣に出した自分の CSS を import していない .module.mjs
const modulesWithoutCss = (modules: string[]): string[] =>
  modules.filter((file) => {
    const [, css] =
      /^import '\.\/(.+\.css)';/mu.exec(
        readFileSync(path.join(dist, file), 'utf8'),
      ) ?? [];
    return (
      css === undefined || !existsSync(path.join(dist, path.dirname(file), css))
    );
  });

describe('dist', () => {
  const styles = path.join('styles', 'index.css');
  const components = filesIn('.css').filter(
    (file) => !file.startsWith(`styles${path.sep}`),
  );

  it('部品の CSS はどの規則も components レイヤーに入っている', () => {
    expect(components.length).toBeGreaterThan(0);
    expect(
      components.filter(
        (file) => outsideComponents(parse(file).nodes).length > 0,
      ),
    ).toStrictEqual([]);
  });

  it('部品の CSS はレイヤーの順をすべて宣言してから書く', () => {
    // 部品の CSS が styles.css より先に読まれても、Tailwind のユーティリティが
    // 部品に勝つ順になる
    expect(
      components.filter(
        (file) => layerOrder(parse(file).nodes).join(',') !== LAYERS.join(','),
      ),
    ).toStrictEqual([]);
  });

  it('CSS Modules のモジュールは隣に出した自分の CSS を読み込む', () => {
    const modules = filesIn('.module.mjs');

    expect(modules.length).toBeGreaterThan(0);
    expect(modulesWithoutCss(modules)).toStrictEqual([]);
  });

  it('tokens は styles.css のトークンとモードを DTCG の resolver 文書で出す', () => {
    const source = readFileSync(
      path.join(dist, 'styles', 'tokens.mjs'),
      'utf8',
    );
    const { version, resolutionOrder } = JSON.parse(
      source.slice(source.indexOf('{'), source.lastIndexOf('}') + 1),
    ) as {
      version: string;
      resolutionOrder: Array<{
        name: string;
        sources?: Array<Record<string, unknown>>;
        contexts?: { on: Array<Record<string, unknown>> };
      }>;
    };
    const [root, ...modes] = resolutionOrder;

    expect(version).toBe('2025.10');
    expect(root?.sources?.[0]?.['color-fg-base']).toStrictEqual({
      $type: 'color',
      $value: '{gray-900}',
    });
    expect(
      modes.find(({ name }) => name === '.dark')?.contexts?.on[0]?.[
        'color-fg-base'
      ],
    ).toStrictEqual({ $type: 'color', $value: '{gray-50}' });
  });

  it('styles.css はトークンのほかをどれかのレイヤーに入れる', () => {
    // ほかの規則がレイヤーの外にあると、利用者がレイヤーに入れた CSS に勝ってしまう
    const root = parse(styles);

    expect(layerOrder(root.nodes)).toStrictEqual(LAYERS);
    expect(unlayeredStyles(root.nodes)).toStrictEqual([]);
  });
});
