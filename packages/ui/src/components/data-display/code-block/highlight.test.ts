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

  it('トークンの色は k8o のブログと同じ one-light と plastic のまま使う', async () => {
    const html = await highlight('// note', { lang: 'ts' });

    // コメントは地に対して 4.5:1 に届かないが、ブログと同じ色のまま出す
    expect(textColorsOf(html)).toContainEqual({
      light: '#A0A1A7',
      dark: '#5F6672',
    });
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
