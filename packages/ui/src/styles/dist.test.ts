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

// レイヤーの外に置いた、トークンの宣言でないもの。@media の中の :root
// （コントラストのモード）もトークンの宣言として数える
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

type UnlayeredToken = { place: string; name: string; value: string };

const unlayeredTokens = (nodes: ChildNode[]): UnlayeredToken[] =>
  nodes.flatMap((node) => {
    const media =
      node.type === 'atrule' && node.name === 'media' ? node : undefined;
    return (media?.nodes ?? [node])
      .filter((rule): rule is Rule => rule.type === 'rule')
      .flatMap((rule) =>
        rule.nodes.filter(isTokenDeclaration).map(({ prop, value }) => ({
          place: media
            ? `@media ${media.params} ${rule.selector}`
            : rule.selector,
          name: prop,
          value,
        })),
      );
  });

const lightDarkTokens = (nodes: ChildNode[]): string[] =>
  unlayeredTokens(nodes)
    .filter(({ value }) => value.includes('light-dark('))
    .map(({ place, name }) => `${place} ${name}`);

// toString() で比べると、ビルドが入れる空白と改行まで期待値に書くことになる
const outline = (node: ChildNode): string => {
  if (node.type === 'decl') return `${node.prop}: ${node.value}`;
  if (node.type === 'rule') {
    return `${node.selector} { ${node.nodes.map(outline).join('; ')} }`;
  }
  if (node.type === 'atrule') {
    return `@${node.name} ${node.params} { ${(node.nodes ?? []).map(outline).join(' ')} }`;
  }
  return '';
};

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

type Tokens = Record<string, { $type?: string }>;
type TokensDocument = {
  version: string;
  resolutionOrder: Array<{
    name: string;
    sources?: Tokens[];
    contexts?: { on: Tokens[] };
  }>;
};

const readTokens = (): TokensDocument => {
  const source = readFileSync(path.join(dist, 'styles', 'tokens.mjs'), 'utf8');
  return JSON.parse(
    source.slice(source.indexOf('{'), source.lastIndexOf('}') + 1),
  ) as TokensDocument;
};

const tokensIn = (
  resolutionOrder: TokensDocument['resolutionOrder'],
  name: string,
): Tokens => {
  const entry = resolutionOrder.find((candidate) => candidate.name === name);
  const tokens = entry?.sources?.[0] ?? entry?.contexts?.on[0];
  if (tokens === undefined) {
    throw new Error(`tokens に ${name} が無い`);
  }
  return tokens;
};

const lightDarkNamesIn = (media: string | undefined): string[] => {
  const sheet = postcss.parse(
    readFileSync(path.join(import.meta.dirname, 'tokens.css'), 'utf8'),
  );
  const container =
    media === undefined
      ? sheet
      : sheet.nodes.find(
          (node): node is AtRule =>
            node.type === 'atrule' &&
            node.name === 'media' &&
            node.params === media,
        );
  return (container?.nodes ?? [])
    .filter(
      (node): node is Rule => node.type === 'rule' && node.selector === ':root',
    )
    .flatMap((rule) =>
      rule.nodes.filter(
        (node): node is Declaration =>
          node.type === 'decl' && node.value.includes('light-dark('),
      ),
    )
    .map((declaration) => declaration.prop.slice('--'.length));
};

describe('dist', () => {
  const styles = path.join('styles', 'index.css');
  const tokensCss = path.join('styles', 'tokens.css');
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
    const { version, resolutionOrder } = readTokens();

    expect(version).toBe('2025.10');
    expect(tokensIn(resolutionOrder, ':root')['color-fg-base']).toStrictEqual({
      $type: 'color',
      $value: '{gray-900}',
    });
    expect(
      tokensIn(resolutionOrder, ':root color-scheme: dark')['color-fg-base'],
    ).toStrictEqual({ $type: 'color', $value: '{gray-50}' });
  });

  it('tokens の modifier は、場所ごとの値と light-dark() の暗い側を名前で分ける', () => {
    expect(readTokens().resolutionOrder.map(({ name }) => name)).toStrictEqual([
      ':root',
      ':root color-scheme: dark',
      '@media (prefers-contrast: more) :root',
      '@media (prefers-contrast: more) :root color-scheme: dark',
      '.writing-h',
      '.writing-v',
    ]);
  });

  it.each([
    { place: ':root', media: undefined },
    {
      place: '@media (prefers-contrast: more) :root',
      media: '(prefers-contrast: more)',
    },
  ])(
    '$place で light-dark() に書いた色は、明るい側も暗い側も型つきで出る',
    ({ place, media }) => {
      const { resolutionOrder } = readTokens();
      const names = lightDarkNamesIn(media);
      const typesIn = (name: string) =>
        Object.fromEntries(
          Object.entries(tokensIn(resolutionOrder, name))
            .filter(([token]) => names.includes(token))
            .map(([token, { $type }]) => [token, $type]),
        );
      const colors = Object.fromEntries(names.map((name) => [name, 'color']));

      expect(names.length).toBeGreaterThanOrEqual(20);
      expect(typesIn(place)).toStrictEqual(colors);
      expect(
        Object.keys(tokensIn(resolutionOrder, `${place} color-scheme: dark`)),
      ).toStrictEqual(names);
      expect(typesIn(`${place} color-scheme: dark`)).toStrictEqual(colors);
    },
  );

  it('styles.css はトークンのほかをどれかのレイヤーに入れる', () => {
    // ほかの規則がレイヤーの外にあると、利用者がレイヤーに入れた CSS に勝ってしまう
    const root = parse(styles);

    expect(layerOrder(root.nodes)).toStrictEqual(LAYERS);
    expect(unlayeredStyles(root.nodes)).toStrictEqual([]);
  });

  it('tokens.css は、styles.css がレイヤーの外に置くトークンを --writing のほかすべて同じ値で持つ', () => {
    // --writing は縦書きの部品が読む目印で、トークンではない
    const inStyles = unlayeredTokens(parse(styles).nodes).filter(
      ({ name }) => name !== '--writing',
    );

    expect(inStyles.length).toBeGreaterThan(200);
    expect(unlayeredTokens(parse(tokensCss).nodes)).toStrictEqual(inStyles);
  });

  it('tokens.css は、トークンのほかに base レイヤーの color-scheme の規則だけを持つ', () => {
    const root = parse(tokensCss);

    expect(unlayeredStyles(root.nodes)).toStrictEqual([]);
    expect(
      root.nodes.filter((node) => layerOf(node) !== undefined).map(outline),
    ).toStrictEqual([
      [
        '@layer base {',
        ':root { color-scheme: light }',
        '.dark { color-scheme: dark }',
        '@media print { .dark:where(:not(:has(.print-as-shown))) { color-scheme: light } }',
        '}',
      ].join(' '),
    ]);
  });

  it('tokens.css は、light-dark() で書いた値を置き換えずに持つ', () => {
    // Lightning CSS は古い target に向けると light-dark() を --lightningcss-light /
    // -dark の変数に置き換え、html のほかに付けた .dark の中が暗くならなくなる
    const source = postcss.parse(
      readFileSync(path.join(import.meta.dirname, 'tokens.css'), 'utf8'),
    );
    const root = parse(tokensCss);

    expect(lightDarkTokens(source.nodes).length).toBeGreaterThan(40);
    expect(lightDarkTokens(root.nodes)).toStrictEqual(
      lightDarkTokens(source.nodes),
    );
    expect(root.toString()).not.toContain('--lightningcss');
  });
});
