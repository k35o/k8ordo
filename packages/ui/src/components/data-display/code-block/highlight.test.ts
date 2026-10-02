import { highlight } from './highlight';

const linesOf = (html: string): string[] =>
  [...html.matchAll(/<span class="line"[^>]*>/gu)].map((match) => match[0]);

// 文字色（背景色ではない）の light-dark() の組
const textColorsOf = (html: string): Array<{ light: string; dark: string }> =>
  [
    ...html.matchAll(
      /(?<!background-)color:light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)/giu,
    ),
  ].map(([, light = '', dark = '']) => ({ light, dark }));

// WCAG 2 のコントラスト比
const luminance = (hex: string): number => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string): number => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// トークンの種類が多く出るよう、言語を変えて書いたコード
const SAMPLES: ReadonlyArray<readonly [code: string, lang: string]> = [
  [
    `import { Button } from '@k8ordo/ui';
// 保存中は二重送信を防ぐ
export function Save({ onSave }: { onSave: () => Promise<void> }) {
  return <Button disabled={false} onAction={onSave}>保存 {1 + 2}</Button>;
}`,
    'tsx',
  ],
  [
    `/** 型 */
type T = Readonly<Record<string, number | null>>;
const rate = total === 0 ? 0 : done / total; // 割合
class A extends B { #x = /re+/gu; get y() { return this.#x; } }`,
    'ts',
  ],
  ['pnpm add @k8ordo/ui # 入れる\nexport FOO="bar" && echo $FOO', 'bash'],
  ['.a:hover { color: #fff; --x: calc(1px + 2em); } /* c */', 'css'],
  ['{ "a": 1, "b": [true, null, "s"] }', 'json'],
  ['<div class="a" id=b>&amp;<!-- c --></div>', 'html'],
  ['# 見出し\n\n- **太字** と `code` と [リンク](https://example.com)', 'md'],
];

describe('highlight', () => {
  it('色をライトは one-light、ダークは plastic の light-dark() で出す', async () => {
    const html = await highlight('const a = 1;', { lang: 'ts' });

    // const はライトで one-light の紫、ダークで plastic の青
    expect(textColorsOf(html)).toContainEqual({
      light: '#A626A4',
      dark: '#61AFEF',
    });
    expect(html).toContain('background-color:light-dark(#FAFAFA, #21252B)');
  });

  it('コードの地に 4.5:1 で届かない色は使わない', async () => {
    const htmls = await Promise.all(
      SAMPLES.map(([code, lang]) => highlight(code, { lang })),
    );
    const colors = htmls.flatMap((html) => textColorsOf(html));

    expect(colors.length).toBeGreaterThan(SAMPLES.length);
    expect(
      colors.filter(({ light }) => contrast(light, '#fafafa') < 4.5),
    ).toStrictEqual([]);
    expect(
      colors.filter(({ dark }) => contrast(dark, '#21252b') < 4.5),
    ).toStrictEqual([]);
  });

  it('知らない言語名は色を付けずに描く', async () => {
    const html = await highlight('const a = 1;', { lang: 'no-such-language' });

    // 地の文字色のほかに、トークンごとの色が無い
    expect(new Set(textColorsOf(html).map(({ light }) => light))).toStrictEqual(
      new Set(['#383A42']),
    );
    expect(html).toContain('const a = 1;');
  });

  it('コードの中の HTML はエスケープする', async () => {
    const html = await highlight('<script>alert(1)</script>', { lang: 'text' });

    expect(html).not.toContain('<script>');
    expect(html).toContain('&#x3C;script>');
  });

  it('marks で指定した行（1 始まり）にだけ印を付ける', async () => {
    const html = await highlight('a\nb\nc', {
      lang: 'text',
      marks: { 1: 'highlight', 3: 'remove' },
    });

    expect(linesOf(html)).toStrictEqual([
      '<span class="line" data-mark="highlight">',
      '<span class="line">',
      '<span class="line" data-mark="remove">',
    ]);
    expect(html).toMatch(/<pre [^>]*data-marked=""/u);
  });

  it('印が無ければ pre に data-marked を付けない', async () => {
    const html = await highlight('a', { lang: 'text' });

    expect(html).not.toContain('data-marked');
  });

  it('注記は指定した行の直後に、コードの行とは別の要素として入る', async () => {
    const html = await highlight('a\nb', {
      lang: 'text',
      callouts: { 1: 'ここがポイント' },
    });

    expect(html).toMatch(
      /<span class="line"><span>a<\/span><\/span>\n<span data-callout="" [^>]*>ここがポイント<\/span>\n<span class="line"><span>b<\/span><\/span>/u,
    );
  });

  it('注記の文字列もエスケープする', async () => {
    const html = await highlight('a', {
      lang: 'text',
      callouts: { 1: '<b>太字</b>' },
    });

    expect(html).toContain('&#x3C;b>太字&#x3C;/b>');
  });

  it('横にスクロールするコードへキーボードで届くよう、pre にフォーカスを置ける', async () => {
    const html = await highlight('a', { lang: 'text' });

    expect(html).toMatch(/<pre [^>]*tabindex="0"/u);
  });

  it('空のコードでも描ける', async () => {
    const html = await highlight('', { lang: 'ts', callouts: { 1: '注記' } });

    expect(html).toContain('<pre');
  });

  it('1 行に複数の注記を、書いた順に重ねる', async () => {
    const html = await highlight('a\nb', {
      lang: 'text',
      callouts: { 2: ['1 つ目', '2 つ目'] },
    });

    expect(html.indexOf('1 つ目')).toBeLessThan(html.indexOf('2 つ目'));
    expect(html.indexOf('<span>b</span>')).toBeLessThan(html.indexOf('1 つ目'));
  });

  it('注記は、指す行の字下げを持つ', async () => {
    const html = await highlight('if (a) {\n    run();\n}', {
      lang: 'text',
      callouts: { 2: '字下げに揃う' },
    });

    expect(html).toContain('style="--ao-callout-indent:4ch"');
  });

  it('同じ行に印と注記を両方付けられる', async () => {
    const html = await highlight('a', {
      lang: 'text',
      marks: { 1: 'add' },
      callouts: { 1: '足した行' },
    });

    expect(html).toContain('data-mark="add"');
    expect(html).toContain('足した行');
  });
});
