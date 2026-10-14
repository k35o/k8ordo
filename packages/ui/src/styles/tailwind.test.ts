import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { compile } from 'tailwindcss';
import { beforeAll, describe, expect, it } from 'vite-plus/test';

const stylesDir = import.meta.dirname;
const require = createRequire(import.meta.url);

// 利用者の Tailwind と同じく、橋の @import をたどってから候補のクラスを組む
const loadStylesheet = async (id: string, base: string) => {
  const file =
    id === 'tailwindcss'
      ? require.resolve('tailwindcss/index.css')
      : path.resolve(base, id);
  return {
    path: file,
    base: path.dirname(file),
    content: readFileSync(file, 'utf8'),
  };
};

let build: (candidates: string[]) => string;

beforeAll(async () => {
  const entry = path.join(stylesDir, 'tailwind.css');
  const compiler = await compile(readFileSync(entry, 'utf8'), {
    base: stylesDir,
    from: entry,
    loadStylesheet,
  });
  build = (candidates) => compiler.build(candidates);
});

// tokens.css の :root で宣言した、接頭辞が prefix のトークンの名前と値
const rootTokens = (prefix: string): Array<{ name: string; value: string }> => {
  const tokens = readFileSync(path.join(stylesDir, 'tokens.css'), 'utf8');
  const root = tokens.slice(tokens.indexOf(':root {'));
  return [
    ...root
      .slice(0, root.indexOf('\n}'))
      .matchAll(/^ {2}--([a-z0-9-]+): ([^;]+);/gmu),
  ].flatMap(([, name = '', value = '']) =>
    name.startsWith(prefix) ? [{ name: name.slice(prefix.length), value }] : [],
  );
};

// 1 つのクラスが出す規則の中身（宣言の並び）を返す
const ruleOf = (css: string, selector: string): string => {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`${selector} was not generated`);
  return css.slice(start, css.indexOf('}', start) + 1);
};

describe('tailwind.css', () => {
  it('色のユーティリティは --color-* のトークンを読む', () => {
    const css = build(['bg-bg-base', 'text-fg-mute', 'border-primary-border']);

    expect(ruleOf(css, '.bg-bg-base')).toContain(
      'background-color: var(--color-bg-base);',
    );
    expect(ruleOf(css, '.text-fg-mute')).toContain(
      'color: var(--color-fg-mute);',
    );
    expect(ruleOf(css, '.border-primary-border')).toContain(
      'border-color: var(--color-primary-border);',
    );
  });

  it('tokens.css のすべての色にユーティリティがある', () => {
    const names = rootTokens('color-').map(({ name }) => name);
    const css = build(names.map((name) => `bg-${name}`));

    expect(names.length).toBeGreaterThan(40);
    expect(
      names.filter(
        (name) =>
          !ruleOf(css, `.bg-${name}`).includes(
            `background-color: var(--color-${name});`,
          ),
      ),
    ).toStrictEqual([]);
  });

  it('文字の大きさは --font-size-* と対の --line-height-* を読む', () => {
    const css = build(['text-md']);

    expect(ruleOf(css, '.text-md')).toContain(
      'font-size: var(--font-size-md);',
    );
    expect(ruleOf(css, '.text-md')).toContain(
      'line-height: var(--tw-leading, var(--line-height-md));',
    );
  });

  it('組みと文字のユーティリティは名前を変えたトークンを読む', () => {
    const css = build([
      'leading-loose',
      'tracking-normal',
      'font-bold',
      'font-noto-sans-jp',
    ]);

    expect(ruleOf(css, '.leading-loose')).toContain(
      'line-height: var(--line-height-loose);',
    );
    expect(ruleOf(css, '.tracking-normal')).toContain(
      'letter-spacing: var(--letter-spacing-normal);',
    );
    expect(ruleOf(css, '.font-bold')).toContain(
      'font-weight: var(--font-weight-bold);',
    );
    expect(ruleOf(css, '.font-noto-sans-jp')).toContain(
      'font-family: var(--font-family-noto-sans-jp);',
    );
  });

  it('角丸・影・余白・重なりはトークンを読む', () => {
    const css = build([
      'rounded-lg',
      'shadow-md',
      'inset-shadow-xs',
      'p-4',
      'z-modal',
    ]);

    expect(ruleOf(css, '.rounded-lg')).toContain(
      'border-radius: var(--radius-lg);',
    );
    expect(ruleOf(css, '.shadow-md')).toContain(
      '--tw-shadow: var(--shadow-md);',
    );
    expect(ruleOf(css, '.inset-shadow-xs')).toContain(
      '--tw-inset-shadow: var(--shadow-inset-xs);',
    );
    expect(ruleOf(css, '.p-4')).toContain('padding: calc(var(--spacing) * 4);');
    expect(ruleOf(css, '.z-modal')).toContain('z-index: var(--z-index-modal);');
  });

  it('テーマの変数を自分では宣言しない', () => {
    // 宣言すると --color-bg-base: var(--color-bg-base) の循環になり、
    // styles.css のトークンより弱いレイヤーにあっても値を壊しうる
    const css = build(['bg-bg-base', 'text-md', 'rounded-lg']);

    expect(css).not.toContain('--color-bg-base: var(--color-bg-base)');
    expect(css).not.toContain('--text-md:');
    expect(css).not.toContain('--radius-lg: var(--radius-lg)');
  });

  it('ブレークポイントは tokens.css と同じ幅で書き出す', () => {
    const breakpoints = rootTokens('breakpoint-');
    const css = build(breakpoints.map(({ name }) => `${name}:flex`));

    expect(breakpoints).toHaveLength(5);
    expect(
      breakpoints.filter(
        ({ value }) => !css.includes(`@media (width >= ${value})`),
      ),
    ).toStrictEqual([]);
  });

  it('dark・light・vertical の変種を持つ', () => {
    const css = build(['dark:hidden', 'light:hidden', 'vertical:hidden']);

    expect(css).toContain('.dark\\:hidden:where(.dark, .dark *)');
    expect(css).toContain('.light\\:hidden:where(:not(.dark, .dark *))');
    expect(css).toContain(
      '.vertical\\:hidden:where(.writing-v, .writing-v *):not(.writing-h, .writing-h *)',
    );
  });

  it('縦書きのユーティリティは部品の読む --writing も切り替える', () => {
    const css = build(['writing-v', 'writing-h']);

    expect(ruleOf(css, '.writing-v')).toContain('--writing: vertical;');
    expect(ruleOf(css, '.writing-h')).toContain('--writing: horizontal;');
  });
});
