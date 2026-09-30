import { fillGenerated, regroupSections, wrap } from './component-docs.ts';

const TITLES = new Map([
  ['buttons', 'Buttons'],
  ['form', 'Forms'],
  ['layout', 'Layout'],
]);
const CATEGORY: Record<string, string> = {
  Button: 'buttons',
  Toolbar: 'buttons',
  TextField: 'form',
  Select: 'form',
  Stack: 'layout',
};
const categoryOf = (name: string): string | undefined => CATEGORY[name];

const regroup = (markdown: string): string =>
  regroupSections(markdown, TITLES, categoryOf);

const doc = (...lines: string[]): string => `${lines.join('\n')}\n`;

describe('regroupSections', () => {
  it('別の分類の見出しの下にある部品の節を、自分の分類の見出しの最後へ移す', () => {
    const markdown = doc(
      '## Buttons',
      '',
      '### Button',
      '',
      'Presses.',
      '',
      '### Select',
      '',
      'Picks one.',
      '',
      '## Forms',
      '',
      '### TextField',
      '',
      'Types.',
    );

    expect(regroup(markdown)).toBe(
      doc(
        '## Buttons',
        '',
        '### Button',
        '',
        'Presses.',
        '',
        '## Forms',
        '',
        '### TextField',
        '',
        'Types.',
        '',
        '### Select',
        '',
        'Picks one.',
      ),
    );
  });

  it('正しい見出しの下にある節は、書いた順のまま残す', () => {
    const markdown = doc(
      '## Buttons',
      '',
      '### Toolbar',
      '',
      'Groups.',
      '',
      '### Button',
      '',
      'Presses.',
    );

    expect(regroup(markdown)).toBe(markdown);
  });

  it('分類の見出しを渡した順に並べ直す', () => {
    const markdown = doc(
      '## Forms',
      '',
      '### TextField',
      '',
      '## Buttons',
      '',
      '### Button',
    );

    expect(regroup(markdown)).toBe(
      doc('## Buttons', '', '### Button', '', '## Forms', '', '### TextField'),
    );
  });

  it('部品を名指さない ### と、分類の前書きはその場に残す', () => {
    const markdown = doc(
      '## Forms',
      '',
      'Every field works with FormControl.',
      '',
      '### Toast',
      '',
      'Not an export.',
      '',
      '### TextField',
    );

    expect(regroup(markdown)).toBe(markdown);
  });

  it('最初の分類より前と最後の分類より後ろの文章は、そのまま残す', () => {
    const markdown = doc(
      '# Catalog',
      '',
      '## Importing',
      '',
      '### Resolution order',
      '',
      '## Buttons',
      '',
      '### Button',
      '',
      '## i18n',
      '',
      '### Key list',
    );

    expect(regroup(markdown)).toBe(markdown);
  });

  it('最後の分類より後ろに書いた部品の節も、自分の分類へ移す', () => {
    const markdown = doc(
      '## Buttons',
      '',
      '### Button',
      '',
      '## i18n',
      '',
      '### Key list',
      '',
      '### Toolbar',
      '',
      'Groups.',
    );

    expect(regroup(markdown)).toBe(
      doc(
        '## Buttons',
        '',
        '### Button',
        '',
        '### Toolbar',
        '',
        'Groups.',
        '',
        '## i18n',
        '',
        '### Key list',
      ),
    );
  });

  it('見出しの無い分類は、移ってきた節のために作る', () => {
    const markdown = doc('## Buttons', '', '### Button', '', '### Stack');

    expect(regroup(markdown)).toBe(
      doc('## Buttons', '', '### Button', '', '## Layout', '', '### Stack'),
    );
  });

  it('見出しの 1 語目で部品を読む', () => {
    const markdown = doc('## Buttons', '', '### TextField (native)');

    expect(regroup(markdown)).toBe(
      doc('## Forms', '', '### TextField (native)'),
    );
  });

  it('コードブロックの中の ## と ### は見出しとして読まない', () => {
    const markdown = doc(
      '## Buttons',
      '',
      '### Button',
      '',
      '```md',
      '## Forms',
      '### TextField',
      '```',
    );

    expect(regroup(markdown)).toBe(markdown);
  });

  it('2 度かけても結果は変わらない', () => {
    const once = regroup(
      doc('## Forms', '', '### Button', '', '## Buttons', '', '### Select'),
    );

    expect(regroup(once)).toBe(once);
  });

  it('分類の見出しが 2 つあると止める', () => {
    const markdown = doc('## Buttons', '', '## Forms', '', '## Buttons');

    expect(() => regroup(markdown)).toThrow('a category heading appears twice');
  });

  it('同じ部品の節が 2 つあると止める', () => {
    const markdown = doc('## Buttons', '', '### Button', '', '### Button');

    expect(() => regroup(markdown)).toThrow('### Button appears twice');
  });

  it('分類の見出しの間に分類でない ## があると止める', () => {
    const markdown = doc('## Buttons', '', '## Render props', '', '## Forms');

    expect(() => regroup(markdown)).toThrow('## Render props');
  });

  it('分類の見出しが 1 つも無いと止める', () => {
    expect(() => regroup(doc('## Importing'))).toThrow('no category section');
  });
});

describe('wrap', () => {
  it('80 桁に収まるだけ語を 1 行に詰める', () => {
    const word = 'x'.repeat(39);

    expect(wrap([word, word, word])).toBe(`${word} ${word}\n${word}\n`);
  });

  it('ちょうど 80 桁の行は折り返さない', () => {
    expect(wrap(['x'.repeat(40), 'y'.repeat(39)])).toBe(
      `${'x'.repeat(40)} ${'y'.repeat(39)}\n`,
    );
  });
});

describe('fillGenerated', () => {
  it('印の間を、整形後と同じ形で書き換える', () => {
    const markdown = doc(
      'Before.',
      '',
      '<!-- generated:list -->',
      'stale',
      '<!-- /generated:list -->',
      '',
      'After.',
    );

    expect(fillGenerated('doc.md', markdown, 'list', '- a\n')).toBe(
      doc(
        'Before.',
        '',
        '<!-- generated:list -->',
        '',
        '- a',
        '',
        '<!-- /generated:list -->',
        '',
        'After.',
      ),
    );
  });

  it('本文の $ を置換の記号として読まない', () => {
    const markdown = doc('<!-- generated:list -->', '<!-- /generated:list -->');

    expect(fillGenerated('doc.md', markdown, 'list', '$& $1\n')).toContain(
      '$& $1',
    );
  });

  it('印が無いと止める', () => {
    expect(() => fillGenerated('doc.md', 'Nothing.\n', 'list', '')).toThrow(
      'doc.md: <!-- generated:list --> must appear exactly once, found 0',
    );
  });

  it('印が 2 組あると止める', () => {
    const pair = doc('<!-- generated:list -->', '<!-- /generated:list -->');

    expect(() => fillGenerated('doc.md', pair + pair, 'list', '')).toThrow(
      'found 2',
    );
  });
});
